# Django Backend

This backend serves the portfolio content API and stores admin-managed portfolio data in Django's database.

## Quick Start

```sh
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py bootstrap_portfolio
python manage.py runserver
```

## Supabase Connection

Use either:

- `DATABASE_URL`
- The explicit `SUPABASE_DB_*` environment variables in `.env.example`

For best results:

- Use the direct Supabase Postgres connection string for long-lived Django connections when available.
- If you use the transaction pooler, use port `6543` and set `DB_CONN_MAX_AGE=0`.
- The transaction pooler host can still present Postgres internally as port `5432`; what matters for Django is that your configured client port is `6543`.

## API Routes

- `GET /api/public/`
- `GET /api/session/`
- `POST /api/login/`
- `POST /api/logout/`
- `POST /api/content/`
- `POST /api/credentials/`

## Bootstrap Command

```sh
python manage.py bootstrap_portfolio
```

Optional overrides:

```sh
python manage.py bootstrap_portfolio --username frank --password "Ombogo1234." --email admin@example.com
```
