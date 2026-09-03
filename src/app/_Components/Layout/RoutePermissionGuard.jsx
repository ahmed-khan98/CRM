"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { canAccessRoute } from "@/app/config/permissions";

/** Redirect to dashboard if the signed-in role cannot access the current path. */
export default function RoutePermissionGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname?.startsWith("/dashboard")) return;

    const userCookie = Cookies.get("currentuser");
    if (!userCookie) return;

    try {
      const user = JSON.parse(userCookie);
      const role = user?.role;
      if (!canAccessRoute(pathname, role)) {
        router.replace("/dashboard/statictics");
      }
    } catch {
      /* ignore malformed cookie */
    }
  }, [pathname, router]);

  return children;
}
