from __future__ import annotations

from pathlib import Path

from django.core.exceptions import ValidationError
from django.db import models


REQUIRED_PORTFOLIO_KEYS = [
    "hero",
    "about",
    "experience",
    "projects",
    "skills",
    "education",
    "certifications",
    "contact",
]


def default_portfolio_content() -> dict:
    data_path = Path(__file__).resolve().parent.parent / "data" / "portfolio.json"

    if not data_path.exists():
        return {}

    import json

    return json.loads(data_path.read_text(encoding="utf-8"))


class PortfolioContent(models.Model):
    key = models.CharField(default="primary", max_length=50, unique=True)
    content = models.JSONField(default=default_portfolio_content)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Portfolio content"
        verbose_name_plural = "Portfolio content"

    def clean(self) -> None:
        missing_keys = [key for key in REQUIRED_PORTFOLIO_KEYS if key not in self.content]

        if missing_keys:
            raise ValidationError(
                {
                    "content": f"Portfolio content is missing required sections: {', '.join(missing_keys)}"
                }
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.key

