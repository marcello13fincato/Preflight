import { redirect } from "next/navigation";

export default function LegacyPlaybookRedirect() {
  redirect("/app/inbound");
}
