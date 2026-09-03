import { redirect } from "next/navigation";

export const metadata = {
  title: "Forgot password",
};

/** Temporarily disabled — redirect to login */
const Page = () => {
  redirect("/login");
};

export default Page;
