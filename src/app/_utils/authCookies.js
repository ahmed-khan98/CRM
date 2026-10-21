import Cookies from "js-cookie";

/** First-party cookies — SameSite=Lax is more reliable on mobile Chrome than None. */
export function authCookieOptions(extra = {}) {
  const isHttps =
    typeof window !== "undefined" && window.location?.protocol === "https:";
  return {
    expires: 7,
    path: "/",
    sameSite: "lax",
    secure: isHttps,
    ...extra,
  };
}

export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** true if missing/invalid/expired (with 30s clock skew) */
export function isAccessTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000 - 30_000;
}

export function getAccessToken() {
  return Cookies.get("token") || null;
}

export function getRefreshToken() {
  return Cookies.get("refreshToken") || null;
}

export function hasValidSession() {
  const token = getAccessToken();
  return Boolean(token && !isAccessTokenExpired(token));
}

export function setAuthCookies({ accessToken, refreshToken, user }) {
  const opts = authCookieOptions();
  if (accessToken) Cookies.set("token", accessToken, opts);
  if (refreshToken) Cookies.set("refreshToken", refreshToken, opts);
  if (user) {
    // Keep cookie small for mobile Chrome (~4KB limit)
    const slim = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      activityStatus: user.activityStatus,
      lastBreakInTime: user.lastBreakInTime,
      departmentId: user.departmentId,
      avatar: user.avatar,
    };
    Cookies.set("currentuser", JSON.stringify(slim), opts);
  }
}

export function clearAuthCookies() {
  const opts = { path: "/" };
  Cookies.remove("token", opts);
  Cookies.remove("refreshToken", opts);
  Cookies.remove("currentuser", opts);
  Cookies.remove("accessToken", opts);
}
