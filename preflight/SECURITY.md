## Auth and Passwords — Production guidance

This project ships with two authentication options:

- Credentials provider (dev): a simple username/password read from environment variables `DASHBOARD_USER` and `DASHBOARD_PASS`. This is intended for development or single-admin demos only.
- Email (recommended for production): magic-link sign-in using an SMTP server. Configure `EMAIL_SERVER` and `EMAIL_FROM` in environment to enable.

Why Email provider? It provides passwordless, secure login without storing passwords in env. In production you should:

1. Configure a real email provider (SMTP) and set `EMAIL_SERVER` and `EMAIL_FROM` in project environment (Vercel secrets, etc.).
2. Set `NEXTAUTH_URL` to your production URL and `NEXTAUTH_SECRET` to a strong secret.
3. Use a persistent user store (database) and switch from Credentials env-based auth to a proper users table (NextAuth adapters or custom DB). Storing credentials only in env is not suitable for multi-user production.
4. For password reset flows, prefer magic-link email sign-in or implement a secure reset token flow backed by a database and email sending.

If you need help wiring SMTP or moving to a DB-backed user store, I can add adapters and migration helpers.
