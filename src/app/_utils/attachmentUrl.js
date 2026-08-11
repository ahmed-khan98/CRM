import Cookies from "js-cookie";

const PROXY_EXTENSIONS = [
  ".pdf",
  ".zip",
  ".rar",
  ".psd",
  ".ai",
  ".eps",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
];

export function isPdfFile(url, filename) {
  const name = (filename || url || "").toLowerCase();
  return name.endsWith(".pdf") || name.includes(".pdf?");
}

/** Binary/raw files that must go through backend proxy (not direct Cloudinary) */
export function needsProxyDownload(url, filename) {
  const name = (filename || url || "").toLowerCase().split("?")[0];
  if (PROXY_EXTENSIONS.some((ext) => name.endsWith(ext))) return true;
  // Cloudinary raw delivery (PDFs/docs often blocked in browser)
  if (/\/raw\/upload\//i.test(url || "")) return true;
  return false;
}

/** Any chat document that should never open via raw Cloudinary link */
export function isChatDocument(url, filename, mimeType = "") {
  const name = (filename || url || "").toLowerCase().split("?")[0];
  const mime = (mimeType || "").toLowerCase();
  if (needsProxyDownload(url, filename)) return true;
  if (mime.includes("pdf") || mime.includes("msword") || mime.includes("officedocument"))
    return true;
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("octet-stream"))
    return true;
  if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|txt|csv)$/i.test(name))
    return true;
  return false;
}


/** Office / archive / design files cannot open in browser tab — force download */
export function isDownloadOnlyFile(url, filename) {
  const name = (filename || url || "").toLowerCase().split("?")[0];
  return [
    ".zip",
    ".rar",
    ".psd",
    ".ai",
    ".eps",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
  ].some((ext) => name.endsWith(ext));
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
