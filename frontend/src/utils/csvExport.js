/**
 * CSV Export Utility for WFX ERP Platform
 *
 * Handles all edge cases: commas, quotes, newlines, nulls, unicode.
 * Uses native Blob API — no external libraries needed.
 */

/**
 * Escape a single cell value for CSV format (RFC 4180).
 * Wraps the value in double quotes if it contains commas, quotes, or newlines.
 */
function escapeCSVCell(value) {
  if (value === null || value === undefined) return '';

  const str = String(value);

  // If the cell contains a comma, double-quote, or newline → wrap in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    // Escape internal double-quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Convert an array of objects into a CSV string.
 *
 * @param {Object[]} data   - Array of row objects (e.g. [{ name: "A", price: 10 }])
 * @param {string[]} [columns] - Optional ordered list of column keys to include.
 *                                If omitted, keys are extracted from the first row.
 * @param {Object}  [headerMap] - Optional mapping of key → display header name.
 * @returns {string} CSV-formatted string with BOM for Excel compatibility
 */
function buildCSVString(data, columns, headerMap = {}) {
  if (!data || data.length === 0) return '';

  // Determine columns from first row if not provided
  const cols = columns || Object.keys(data[0]);

  // Build header row using display names where available
  const headerRow = cols.map((col) => escapeCSVCell(headerMap[col] || col));

  // Build data rows
  const dataRows = data.map((row) =>
    cols.map((col) => escapeCSVCell(row[col])).join(',')
  );

  // Prepend BOM for proper UTF-8 rendering in Excel
  return '\uFEFF' + [headerRow.join(','), ...dataRows].join('\r\n');
}

/**
 * Generate a timestamped filename for CSV downloads.
 *
 * @param {string} baseName - e.g. "finished_goods", "suppliers"
 * @returns {string} e.g. "finished_goods_2026-07-08.csv"
 */
function generateFilename(baseName) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `${baseName}_${date}.csv`;
}

/**
 * Export data as a CSV file download.
 *
 * @param {Object[]} data       - Array of row objects
 * @param {string}   baseName   - Base filename (without extension or date)
 * @param {string[]} [columns]  - Ordered column keys to include
 * @param {Object}  [headerMap] - Key → display header name mapping
 * @throws {Error} If data is empty or invalid
 */
export function exportToCSV(data, baseName, columns, headerMap) {
  if (!data || data.length === 0) {
    throw new Error('No data available to export.');
  }

  const csvString = buildCSVString(data, columns, headerMap);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary download link and trigger click
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = generateFilename(baseName);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export a 2D table (headers + rows) as CSV.
 * Used by the NL Query page where data comes as separate headers/rows arrays.
 *
 * @param {string[]}   headers  - Column header names
 * @param {Array[]}    rows     - 2D array of cell values
 * @param {string}     baseName - Base filename
 */
export function exportTableToCSV(headers, rows, baseName) {
  if (!headers || !rows || rows.length === 0) {
    throw new Error('No data available to export.');
  }

  const headerRow = headers.map(escapeCSVCell).join(',');
  const dataRows = rows.map((row) => row.map(escapeCSVCell).join(','));
  const csvString = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = generateFilename(baseName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
