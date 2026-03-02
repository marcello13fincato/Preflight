import { ReactNode } from "react";
import MarketingHeader from "../../components/marketing/Header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">{children}</main>
    </>
  );
}
