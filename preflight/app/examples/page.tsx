import { redirect } from "next/navigation";

export default function ExamplesRedirect() {
  // maintain compatibility with old links
  redirect("/perche");
}
