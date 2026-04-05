from django.db import migrations, models

import core.models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="PortfolioContent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(default="primary", max_length=50, unique=True)),
                ("content", models.JSONField(default=core.models.default_portfolio_content)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Portfolio content",
                "verbose_name_plural": "Portfolio content",
            },
        ),
    ]
