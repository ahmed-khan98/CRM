import Cookies from "js-cookie";

export function isPdfFile(url, filename) {
  const name = (filename || url || "").toLowerCase();
  return name.endsWith(".pdf") || name.includes(".pdf?");
}

export function getDirectOpenUrl(url) {
  if (!url) return "#";
  return url.replace(/^http:\/\//i, "https://");
}

function getAccessToken() {
  return Cookies.get("token") || Cookies.get("accessToken") || null;
}

function getApiBase() {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return base.endsWith("/") ? base : `${base}/`;
}

/** Backend proxy URL — server fetches from Cloudinary with signed/admin auth */
export function getAttachmentProxyUrl(url, { disposition = "inline", filename, publicId } = {}) {
  const token = getAccessToken();
  const params = new URLSearchParams({ disposition });
  if (url) params.set("url", url);
  if (publicId) params.set("publicId", publicId);
  if (filename) params.set("filename", filename);
  if (token) params.set("token", token);
  return `${getApiBase()}task/attachment/proxy?${params.toString()}`;
}

export async function fetchAttachmentBlob(
  url,
  { disposition = "inline", filename, publicId } = {}
) {
  const token = getAccessToken();
  const proxyUrl = getAttachmentProxyUrl(url, { disposition, filename, publicId });

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(proxyUrl, {
    credentials: "include",
    headers,
  });

  if (!res.ok) throw new Error("Failed to fetch attachment");
  return res.blob();
}
