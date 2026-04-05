# Portfolio App

This project now runs as a React frontend with a Django backend that can connect to a Supabase Postgres database.

## Stack

- Frontend: Vite, React, TypeScript, Tailwind, shadcn/ui
- Backend: Django, Django REST Framework
- Database: Supabase Postgres

## Frontend Setup

From `portfolio/`:

```sh
npm install
npm run dev
```

The frontend runs on `http://127.0.0.1:8080` and proxies `/api/*` requests to Django on `http://127.0.0.1:8000`.

## Backend Setup

From `backend/`:

1. Create your environment file.

```sh
copy .env.example .env
```

2. Add your Supabase database connection details to `.env`.

Preferred:

```env
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres?sslmode=require
```

Alternative:

```env
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-password
SUPABASE_DB_HOST=aws-0-eu-west-1.pooler.supabase.com
SUPABASE_DB_PORT=6543
SUPABASE_DB_SSLMODE=require
```

3. Install Python dependencies.

```sh
pip install -r requirements.txt
```

4. Run migrations.

```sh
python manage.py migrate
```

5. Create the initial admin account and seed the main portfolio record.

```sh
python manage.py bootstrap_portfolio
```

6. Start Django.

```sh
python manage.py runserver
```

## Default Admin

- Username: `frank`
- Password: `Ombogo1234.`

Change these from `/admin` after your first login.

## Notes

- The admin page now saves content through Django, not browser-local storage.
- Empty or placeholder content is filtered so visitors only see meaningful entered data.
- If you use the Supabase transaction pooler, use port `6543` and set `DB_CONN_MAX_AGE=0` in `.env`.
