from __future__ import annotations

from django.contrib.auth import authenticate, get_user, get_user_model, login, logout
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from .models import PortfolioContent, REQUIRED_PORTFOLIO_KEYS


User = get_user_model()


def get_django_request(request: Request):
    return getattr(request, "_request", request)


def get_request_user(request: Request):
    django_request = get_django_request(request)
    session_user = get_user(django_request)

    if session_user is not None and session_user.is_authenticated:
        return session_user

    django_user = getattr(django_request, "user", None)

    if django_user is not None and getattr(django_user, "is_authenticated", False):
        return django_user

    request_user = getattr(request, "user", None)

    if request_user is not None and getattr(request_user, "is_authenticated", False):
        return request_user

    return request_user


def get_or_create_portfolio() -> PortfolioContent:
    with transaction.atomic():
        portfolio, _ = PortfolioContent.objects.get_or_create(key="primary")

    return portfolio


def validate_portfolio_content(content: dict) -> bool:
    return all(key in content for key in REQUIRED_PORTFOLIO_KEYS)


def api_payload(data: dict, status_code: int = 200) -> Response:
    return Response({"data": data}, status=status_code)


def api_error(message: str, status_code: int) -> Response:
    return Response({"message": message}, status=status_code)


@api_view(["GET"])
def public_portfolio(request: Request) -> Response:
    portfolio = get_or_create_portfolio()
    username = (
        User.objects.filter(is_superuser=True).order_by("id").values_list("username", flat=True).first()
        or "superuser"
    )
    return api_payload({"content": portfolio.content, "username": username})


@api_view(["GET"])
def admin_session(request: Request) -> Response:
    user = get_request_user(request)
    username = (
        User.objects.filter(is_superuser=True).order_by("id").values_list("username", flat=True).first()
        or "superuser"
    )
    return api_payload(
        {
            "authenticated": bool(user and user.is_authenticated and user.is_superuser),
            "username": username,
        }
    )


@csrf_exempt
@api_view(["POST"])
def admin_login(request: Request) -> Response:
    django_request = get_django_request(request)
    username = str(request.data.get("username", "")).strip()
    password = str(request.data.get("password", ""))
    user = authenticate(django_request, username=username, password=password)

    if user is None or not user.is_superuser:
        return api_error("Invalid username or password.", 401)

    login(django_request, user)
    django_request.user = user
    return api_payload({"authenticated": True, "username": user.username})


@csrf_exempt
@api_view(["POST"])
def admin_logout(request: Request) -> Response:
    django_request = get_django_request(request)
    user = get_request_user(request)
    username = user.username if user and user.is_authenticated else (
        User.objects.filter(is_superuser=True).order_by("id").values_list("username", flat=True).first()
        or "superuser"
    )
    logout(django_request)
    return api_payload({"authenticated": False, "username": username})


@csrf_exempt
@api_view(["POST"])
def save_portfolio(request: Request) -> Response:
    user = get_request_user(request)

    if not user or not user.is_authenticated or not user.is_superuser:
        return api_error("You need to sign in to save portfolio content.", 401)

    content = request.data.get("content")

    if not isinstance(content, dict) or not validate_portfolio_content(content):
        return api_error("The submitted portfolio data is incomplete.", 400)

    portfolio = get_or_create_portfolio()
    portfolio.content = content
    portfolio.save()

    return api_payload({"content": portfolio.content, "username": user.username})


@csrf_exempt
@api_view(["POST"])
def update_credentials(request: Request) -> Response:
    django_request = get_django_request(request)
    user = get_request_user(request)

    if not user or not user.is_authenticated or not user.is_superuser:
        return api_error("You need to sign in to update credentials.", 401)

    username = str(request.data.get("username", "")).strip()
    password = str(request.data.get("password", "")).strip()

    if not username or not password:
        return api_error("Both username and password are required.", 400)

    user.username = username
    user.set_password(password)
    user.save(update_fields=["username", "password"])
    login(django_request, user)
    django_request.user = user

    return api_payload({"username": user.username})
