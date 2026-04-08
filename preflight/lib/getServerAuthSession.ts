import { createClient } from './supabase/server';
import prisma from './prisma';

type Session = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
} | null;

export default async function getServerAuthSession(): Promise<Session> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Dev fallback: create/resolve a local dev user so AI routes work without Supabase
    if (process.env.NODE_ENV === 'development') {
      try {
        const devUser = await prisma.user.upsert({
          where: { email: 'dev@preflight.local' },
          create: { email: 'dev@preflight.local', name: 'Dev User' },
          update: {},
          select: { id: true },
        });
        return { user: { id: devUser.id, name: 'Dev User', email: 'dev@preflight.local', image: null } };
      } catch {
        return { user: { id: 'dev-local-user', name: 'Dev User', email: 'dev@preflight.local', image: null } };
      }
    }
    return null;
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const name = user.user_metadata?.full_name || user.user_metadata?.name || null;
  const image = user.user_metadata?.avatar_url || null;

  // Try to resolve the Prisma User.id (cuid) from the email.
  // If the database is unreachable (e.g. SQLite on serverless), fall back to
  // the Supabase UID which is still unique and stable per user.
  let id: string = user.id; // Supabase UID fallback
  try {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        name,
        image,
      },
      update: {
        name,
        image,
      },
      select: { id: true },
    });
    id = dbUser.id;
  } catch {
    // Database unavailable — use Supabase UID as userId
  }

  return {
    user: {
      id,
      name,
      email: user.email,
      image,
    },
  };
}
