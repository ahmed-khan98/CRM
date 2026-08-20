/** Extracts File objects out of a clipboard paste event — used for the
 * "Win+Shift+S → Ctrl+V" screenshot workflow in both chat and task
 * attachments. Returns [] if the clipboard held no files (e.g. plain text). */
export function extractFilesFromClipboard(e) {
  const items = e.clipboardData?.items;
  if (!items?.length) return [];
  const files = [];
  for (const item of items) {
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  }
  return files;
}
