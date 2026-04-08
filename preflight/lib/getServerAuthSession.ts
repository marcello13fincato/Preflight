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
    return null;
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const name = user.user_metadata?.full_name || user.user_metadata?.name || null;
  const image = user.user_metadata?.avatar_url || null;

  // Upsert Prisma User so that userId (cuid) is always available
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

  return {
    user: {
      id: dbUser.id,
      name,
      email: user.email,
      image,
    },
  };
}
