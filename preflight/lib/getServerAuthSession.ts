import { getServerSession as nextGetServerSession } from 'next-auth/next';
import authOptions from './auth';
import type { Session } from 'next-auth';

export default async function getServerAuthSession(): Promise<Session | null> {
  // Wrapper for server components to get the current session using centralized authOptions
  return await nextGetServerSession(authOptions);
}
