"use client";
// Mock callback page - simply redirect to dashboard
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app");
  }, [router]);
  return (
    <main className="min-h-screen bg-app text-app flex items-center justify-center p-6">
      <div>Reindirizzamento...</div>
    </main>
  );
}

