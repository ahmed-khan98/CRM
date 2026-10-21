import { redirect } from "next/navigation";

/** Legacy typo path - keep bookmarks/links working. */
export default function LegacyStaticticsRedirect() {
  redirect("/dashboard/statistics");
}
