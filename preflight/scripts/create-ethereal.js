#!/usr/bin/env node

(async () => {
  try {
    const nodemailer = (await import('nodemailer')).default;
    const testAccount = await nodemailer.createTestAccount();
    if (process.env.NODE_ENV !== "production") {
      console.log('=== Ethereal test account (development) ===');
      console.log(`user: ${testAccount.user}`);
      console.log(`pass: ${testAccount.pass}`);
      console.log('\nSMTP settings:');
      console.log(JSON.stringify(testAccount.smtp, null, 2));
    }

    const smtp = testAccount.smtp;
    const url = `smtp://${encodeURIComponent(testAccount.user)}:${encodeURIComponent(testAccount.pass)}@${smtp.host}:${smtp.port}`;
    if (process.env.NODE_ENV !== "production") {
      console.log('\nSuggested .env.local entries (copy to .env.local):');
      console.log(`EMAIL_SERVER=${url}`);
      console.log('EMAIL_FROM=no-reply@example.com');
      console.log('NEXT_PUBLIC_EMAIL_ENABLED=1');
    }

    if (process.env.NODE_ENV !== "production") {
      console.log('\nNote: open https://ethereal.email/login and sign in with the credentials above to view messages.');
    }
  } catch (err) {
    console.error('Failed to create Ethereal account:', err);
    process.exit(1);
  }
})();
