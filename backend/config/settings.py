from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import parse_qs, urlparse


BASE_DIR = Path(__file__).resolve().parent.parent


def load_env_file() -> None:
    env_path = BASE_DIR / ".env"

    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def parse_database_url(database_url: str) -> dict[str, object]:
    parsed_url = urlparse(database_url)
    query_params = parse_qs(parsed_url.query)
    ssl_mode = query_params.get("sslmode", [os.getenv("SUPABASE_DB_SSLMODE", "require")])[0]

    return {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": parsed_url.path.lstrip("/"),
        "USER": parsed_url.username or "",
        "PASSWORD": parsed_url.password or "",
        "HOST": parsed_url.hostname or "",
        "PORT": str(parsed_url.port or "5432"),
        "CONN_MAX_AGE": int(os.getenv("DB_CONN_MAX_AGE", "60")),
        "OPTIONS": {
            "sslmode": ssl_mode,
        },
    }


load_env_file()

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "change-me-in-production")
DEBUG = os.getenv("DJANGO_DEBUG", "true").lower() == "true"
ALLOWED_HOSTS = [host.strip() for host in os.getenv("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",") if host.strip()]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "core",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "core.middleware.SimpleCorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {"default": parse_database_url(DATABASE_URL)}
else:
    database_name = os.getenv("SUPABASE_DB_NAME")
    database_user = os.getenv("SUPABASE_DB_USER")
    database_password = os.getenv("SUPABASE_DB_PASSWORD")
    database_host = os.getenv("SUPABASE_DB_HOST")

    if all([database_name, database_user, database_password, database_host]):
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": database_name,
                "USER": database_user,
                "PASSWORD": database_password,
                "HOST": database_host,
                "PORT": os.getenv("SUPABASE_DB_PORT", "5432"),
                "CONN_MAX_AGE": int(os.getenv("DB_CONN_MAX_AGE", "60")),
                "OPTIONS": {
                    "sslmode": os.getenv("SUPABASE_DB_SSLMODE", "require"),
                },
            }
        }
    else:
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": BASE_DIR / "db.sqlite3",
            }
        }

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("DJANGO_TIME_ZONE", "Africa/Nairobi")
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [],
}

SESSION_COOKIE_NAME = "portfolio_admin_sessionid"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "Lax" if DEBUG else "None")
CSRF_COOKIE_SAMESITE = os.getenv("CSRF_COOKIE_SAMESITE", "Lax" if DEBUG else "None")
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "false" if DEBUG else "true").lower() == "true"
CSRF_COOKIE_SECURE = os.getenv("CSRF_COOKIE_SECURE", "false" if DEBUG else "true").lower() == "true"

PORTFOLIO_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("PORTFOLIO_ALLOWED_ORIGINS", "http://127.0.0.1:8080,http://localhost:8080").split(",")
    if origin.strip()
]
