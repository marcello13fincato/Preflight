"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  "": "Home",
  "how-it-works": "Come funziona",
  "per-chi-e": "Per chi è",
  perche: "Perché",
  pricing: "Piani",
  audit: "Audit",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  if (!pathname) return null;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="text-sm text-muted mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        {segments.map((seg, idx) => {
          const href = "/" + segments.slice(0, idx + 1).join("/");
          const label = labels[seg] || seg;
          return (
            <li key={idx} className="flex items-center">
              <span className="mx-1">/</span>
              {idx === segments.length - 1 ? (
                <span className="font-semibold">{label}</span>
              ) : (
                <Link href={href} className="hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
