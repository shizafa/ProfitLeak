import Papa from "papaparse";

// Takes the CSV text from the uploaded file.
// Returns an array of rows, or null if it's not an Amazon Transaction report.
export function parseReport(text) {
  const lines = text.split(/\r?\n/);

  // Find the real header line (it starts with "date/time")
  const headerIndex = lines.findIndex((line) =>
    line.replace(/"/g, "").toLowerCase().startsWith("date/time")
  );

  if (headerIndex === -1) {
    return null;
  }

  // Keep only the header and the data below it
  const csvText = lines.slice(headerIndex).join("\n");

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data;
}