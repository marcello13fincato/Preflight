import { redirect } from "next/navigation";

export default function LegacyAuditDetailRedirect() {
  redirect("/app/post");
}
