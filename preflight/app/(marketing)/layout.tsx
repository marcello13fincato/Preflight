import { ReactNode } from "react";
import MarketingHeader from "@/components/marketing/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Layout from "@/components/shared/Layout";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <Layout header={<MarketingHeader />}>
      <Breadcrumb />
      {children}
    </Layout>
  );
}
