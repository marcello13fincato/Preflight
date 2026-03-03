import { getServerSession as nextGetServerSession } from 'next-auth/next';
import authOptions from './auth';

export default async function getServerAuthSession() {
  // Wrapper for server components to get the current session using centralized authOptions
  return await nextGetServerSession(authOptions as any);
}
