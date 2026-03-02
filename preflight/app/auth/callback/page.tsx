"use client";
// Mock callback page - simply redirect to dashboard
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return (
    <main className="min-h-screen bg-main text-main flex items-center justify-center p-6">
      <div>Reindirizzamento...</div>
    </main>
  );
}

