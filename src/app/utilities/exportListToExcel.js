import * as XLSX from "xlsx";

/**
 * Export tabular data to an .xlsx file in the browser.
 * @param {{ sheetName?: string, fileName: string, rows: Record<string, unknown>[] }} options
 */
export function exportRowsToExcel({ sheetName = "Export", fileName, rows }) {
  if (!rows?.length) {
    throw new Error("No rows to export");
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`);
}
