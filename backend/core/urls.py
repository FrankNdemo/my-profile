from django.urls import path

from .views import admin_login, admin_logout, admin_session, public_portfolio, save_portfolio, update_credentials


urlpatterns = [
    path("public/", public_portfolio, name="portfolio-public"),
    path("session/", admin_session, name="portfolio-session"),
    path("login/", admin_login, name="portfolio-login"),
    path("logout/", admin_logout, name="portfolio-logout"),
    path("content/", save_portfolio, name="portfolio-save-content"),
    path("credentials/", update_credentials, name="portfolio-update-credentials"),
]

