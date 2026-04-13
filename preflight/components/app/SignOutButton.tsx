"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className="text-[12px] text-slate-400 border border-slate-200 rounded-md px-2.5 py-1 hover:text-slate-600 transition">
      Esci
    </button>
  );
}
