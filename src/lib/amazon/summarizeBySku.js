// Turn "1,234.56" or "" into a real number
function toNumber(value) {
  const n = parseFloat(String(value ?? "").replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

// Round to 2 decimal places (money)
function round2(n) {
  return Math.round(n * 100) / 100;
}

// Takes the rows from parseReport.
// Returns a list with one object per SKU.
export function summarizeBySku(rows) {
  const totals = {};

  for (const row of rows) {
    const sku = (row["sku"] || "").trim();
    const type = (row["type"] || "").trim();

    // Skip rows that aren't about a product (like Service Fee)
    if (!sku) continue;
    if (type !== "Order" && type !== "Refund") continue;

    // First time we see this SKU? Start its tally at zero
    if (!totals[sku]) {
      totals[sku] = {
        sku: sku,
        product_name: row["description"] || "",
        units_sold: 0,
        refund_count: 0,
        revenue: 0,
        amazon_fees: 0,
      };
    }

    const t = totals[sku];
    const quantity = Math.abs(toNumber(row["quantity"]));

    if (type === "Order") t.units_sold += quantity;
    if (type === "Refund") t.refund_count += quantity;

    // Money the customer paid (refunds are already negative)
    t.revenue +=
      toNumber(row["product sales"]) +
      toNumber(row["shipping credits"]) +
      toNumber(row["promotional rebates"]);

    // Fees are negative in the report, so subtract to make them positive
    t.amazon_fees -=
      toNumber(row["selling fees"]) +
      toNumber(row["fba fees"]) +
      toNumber(row["other transaction fees"]);
  }

  // Turn the object into a list, round the money, add the extra numbers
  return Object.values(totals).map((t) => {
    const revenue = round2(t.revenue);
    const fees = round2(t.amazon_fees);

    return {
      ...t,
      revenue,
      amazon_fees: fees,
      revenue_after_fees: round2(revenue - fees),
      refund_rate: t.units_sold > 0 ? round2((t.refund_count / t.units_sold) * 100) : 0,
      fee_percent: revenue !== 0 ? round2((fees / revenue) * 100) : 0,
      avg_price_per_unit: t.units_sold > 0 ? round2(revenue / t.units_sold) : 0,
      fee_per_unit: t.units_sold > 0 ? round2(fees / t.units_sold) : 0,
    };
  });
}

// Rows that are NOT product orders/refunds (Service Fee, Adjustment, etc.)
// Returns a list: [{ type, count, amount }]
export function summarizeOtherCharges(rows) {
  const byType = {};

  for (const row of rows) {
    const sku = (row["sku"] || "").trim();
    const type = (row["type"] || "").trim();

    // Normal product rows are handled by summarizeBySku
    if (sku && (type === "Order" || type === "Refund")) continue;

    const label = type || "Other";

    if (!byType[label]) {
      byType[label] = { type: label, count: 0, amount: 0 };
    }

    byType[label].count += 1;
    byType[label].amount += toNumber(row["total"]);
  }

  return Object.values(byType).map((c) => ({
    ...c,
    amount: round2(c.amount),
  }));
}