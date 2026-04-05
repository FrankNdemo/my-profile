from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from core.models import PortfolioContent


User = get_user_model()


class Command(BaseCommand):
    help = "Create or update the portfolio superuser and ensure the primary portfolio record exists."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="frank", help="Superuser username")
        parser.add_argument("--password", default="Ombogo1234.", help="Superuser password")
        parser.add_argument("--email", default="admin@example.com", help="Superuser email")

    def handle(self, *args, **options):
        username = options["username"].strip()
        password = options["password"]
        email = options["email"].strip()

        if not username or not password:
            raise CommandError("Both username and password are required.")

        superuser = User.objects.filter(is_superuser=True).order_by("id").first()

        if superuser is None:
            superuser = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
            )
            self.stdout.write(self.style.SUCCESS(f"Created superuser '{superuser.username}'"))
        else:
            superuser.username = username
            superuser.email = email
            superuser.set_password(password)
            superuser.is_staff = True
            superuser.is_superuser = True
            superuser.save()
            self.stdout.write(self.style.SUCCESS(f"Updated superuser '{superuser.username}'"))

        PortfolioContent.objects.get_or_create(key="primary")
        self.stdout.write(self.style.SUCCESS("Ensured the primary portfolio content record exists."))
