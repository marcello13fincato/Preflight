import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function LegacyDashboardLayout({ children }: { children: ReactNode }) {
  void children;
  redirect("/app");
}
