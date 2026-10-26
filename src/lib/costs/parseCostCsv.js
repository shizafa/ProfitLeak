import Papa from "papaparse";

// Accepted header names (compared after lowercasing and removing spaces/underscores)
const SKU_HEADERS = ["sku", "sellersku", "productsku"];
const COST_HEADERS = ["costperunit", "cost", "unitcost", "productcost"];
const NAME_HEADERS = ["productname", "name", "title", "description"];

function cleanHeader(h) {
  return String(h ?? "")
    .replace(/^\uFEFF/, "") // hidden character Excel puts at the start of a file
    .toLowerCase()
    .replace(/[\s_\-]/g, "");
}

// "$1,234.50" -> 1234.5 ; "abc" or "" -> null
function toCost(value) {
  const cleaned = String(value ?? "").replace(/[$,\s]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return isNaN(n) ? null : n;
}

// Takes the CSV text from the uploaded file.
// Returns { rows, errors, headerError }
//   rows:  [{ sku, product_name, cost_per_unit }]  (valid rows only, SKU trimmed + lowercase)
//   errors: [{ line, message }]                    (rows that were skipped)
//   headerError: text if the file has no SKU or cost column, otherwise null
export function parseCostCsv(text) {
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: cleanHeader,
  });

  const fields = parsed.meta.fields ?? [];
  const skuField = fields.find((f) => SKU_HEADERS.includes(f));
  const costField = fields.find((f) => COST_HEADERS.includes(f));
  const nameField = fields.find((f) => NAME_HEADERS.includes(f));

  if (!skuField || !costField) {
    return {
      rows: [],
      errors: [],
      headerError: 'The file needs a "sku" column and a "cost_per_unit" column.',
    };
  }

  const bySku = {}; // same SKU twice in the file: the last one wins
  const errors = [];

  parsed.data.forEach((row, index) => {
    const line = index + 2; // +1 for the header row, +1 because lines start at 1

    const sku = String(row[skuField] ?? "").trim().toLowerCase();
    const cost = toCost(row[costField]);

    if (!sku) {
      errors.push({ line, message: "SKU is empty" });
      return;
    }

    if (cost === null) {
      errors.push({ line, message: `Cost for "${sku}" is empty or not a number` });
      return;
    }

    if (cost < 0) {
      errors.push({ line, message: `Cost for "${sku}" is negative` });
      return;
    }

    bySku[sku] = {
      sku,
      product_name: nameField ? String(row[nameField] ?? "").trim() : "",
      cost_per_unit: cost,
    };
  });

  return { rows: Object.values(bySku), errors, headerError: null };
}