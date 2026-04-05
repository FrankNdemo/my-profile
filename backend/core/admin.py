from django.contrib import admin

from .models import PortfolioContent


@admin.register(PortfolioContent)
class PortfolioContentAdmin(admin.ModelAdmin):
    list_display = ("key", "updated_at")
    readonly_fields = ("created_at", "updated_at")
    search_fields = ("key",)

