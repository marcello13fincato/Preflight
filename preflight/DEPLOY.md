## Deploying Preflight with a managed database (Supabase / Neon / PlanetScale)

This project uses Prisma for auth persistence. For production on Vercel you must use a managed database (SQLite files are not suitable).

High-level steps

1. Create a managed Postgres (or compatible) database: Supabase, Neon, PlanetScale, Heroku Postgres.
2. Copy the provider connection string (the `DATABASE_URL`).
3. In your Vercel project settings add the following Environment Variables:
   - `DATABASE_URL` = your connection string
   - `NEXTAUTH_URL` = https://your-site.vercel.app
   - `NEXTAUTH_SECRET` = a strong secret (eg. `openssl rand -hex 32`)
   - If using magic-link email: `EMAIL_SERVER`, `EMAIL_FROM`, `NEXT_PUBLIC_EMAIL_ENABLED=1`

Run migrations

Locally (recommended flow):

1. Point your local `DATABASE_URL` to the managed DB (in `.env.local`).
2. Create and run the migration locally:

```bash
# generate client
npx prisma generate

# create migration (development flow)
npx prisma migrate dev --name init

# push (if you prefer not to create SQL migration files)
npx prisma db push
```

On production (Vercel)

- This repo includes `prisma generate` in `postinstall` and `vercel-build` so the client is generated during build.
- Run migrations on production with `prisma migrate deploy`. You can:
  - Run `npx prisma migrate deploy` manually from a machine with `DATABASE_URL` pointing to production.
  - Or let CI run it (see example workflow in `.github/workflows/prisma-migrate.yml`).

CI / Automation

- The repo contains a GitHub Actions workflow that will run `prisma migrate deploy` when you push to `main` if you configure the `DATABASE_URL` secret in GitHub. Adjust the workflow to your needs.

Notes & troubleshooting

- If you get the "Prisma has detected that this project was built on Vercel" error, ensure `prisma generate` runs during build (this repo already runs it in `postinstall` / `vercel-build`).
- Make sure the DB user has permission to run migrations and that the connection string includes required SSL options if your provider requires them.
