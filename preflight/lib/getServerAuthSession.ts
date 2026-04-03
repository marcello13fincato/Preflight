import { createClient } from './supabase/server';

type Session = {
  user: {
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

  if (!user) return null;

  return {
    user: {
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      email: user.email || null,
      image: user.user_metadata?.avatar_url || null,
    },
  };
}
