import { redirect } from "next/navigation";

export default function LegacyAuditsRedirect() {
  redirect("/app/post");
}
