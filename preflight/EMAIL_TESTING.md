# Testing Email (Magic Link) locally

This guide shows how to quickly enable and test the Email (magic link) sign-in locally using Mailtrap (recommended) or Ethereal (alternative).

1) Mailtrap (recommended)

- Create a free account at https://mailtrap.io and create an "inbox".
- In the inbox settings you will find SMTP credentials (host, port, username, password).
- Set the following in your local `.env.local` (copy from `.env.local.example`):

  EMAIL_SERVER=smtp://<MAILTRAP_USER>:<MAILTRAP_PASS>@smtp.mailtrap.io:2525
  EMAIL_FROM=preflight@example.com
  NEXT_PUBLIC_EMAIL_ENABLED=1

- Restart your dev server. When a user requests a magic link, Mailtrap will capture the email and show it in the Mailtrap UI.

2) Ethereal (quick throwaway test)

- Ethereal provides disposable SMTP accounts for testing. You can create an account programmatically using nodemailer `createTestAccount()` and obtain SMTP credentials.
- Example (node script):

  ```js
  import nodemailer from 'nodemailer';

  const testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);
  // Use testAccount.smtp to build EMAIL_SERVER and EMAIL_FROM
  ```

- Then set `.env.local` values accordingly and set `NEXT_PUBLIC_EMAIL_ENABLED=1`.

Notes
- Never commit real production SMTP credentials to the repo. Use Vercel/Netlify/your host secrets for production.
- In production, set `NEXTAUTH_URL` to your site URL and `NEXTAUTH_SECRET` to a secure random value.
