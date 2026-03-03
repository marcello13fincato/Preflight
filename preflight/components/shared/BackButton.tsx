"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-primary text-sm mb-4 hover:underline"
    >
      ← Torna alla home
    </button>
  );
}
