/** Emails with full unrestricted access (bypass plan/trial gates) */
const ADMIN_EMAILS: string[] = [
  "marcello13fincato@gmail.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
