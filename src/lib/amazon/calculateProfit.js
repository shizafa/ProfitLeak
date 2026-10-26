function round2(n) {
  return Math.round(n * 100) / 100;
}

// Same SKU written differently ("Mug-Blue-01 " vs "mug-blue-01") should match
export function normalizeSku(sku) {
  return String(sku ?? "").trim().toLowerCase();
}

// products: the list from summarizeBySku
// costs: rows from the product_costs table ({ sku, cost_per_unit })
// Returns { results, missingCosts }
// results has EVERY product. If a SKU has no cost, the profit fields are null.
export function calculateProfit(products, costs) {
  // Quick lookup: { "mug-blue-01": 4, "lamp-desk": 28, ... }
  const costBySku = {};
  for (const c of costs) {
    costBySku[normalizeSku(c.sku)] = Number(c.cost_per_unit);
  }

  const results = [];
  const missingCosts = [];

  for (const p of products) {
    const cost = costBySku[normalizeSku(p.sku)];

    // Units we actually kept = sold minus refunded (never below 0)
    const netUnits = Math.max(p.units_sold - p.refund_count, 0);

    // No cost saved: keep the row, leave profit empty
    if (cost === undefined || isNaN(cost)) {
      missingCosts.push({ sku: p.sku, product_name: p.product_name });

      results.push({
        ...p,
        net_units: netUnits,
        cost_per_unit: null,
        product_total_cost: null,
        profit: null,
        profit_per_unit: null,
        margin: null,
        is_loss: false,
        has_cost: false,
      });
      continue;
    }

    const productTotalCost = cost * netUnits;
    const profit = p.revenue - p.amazon_fees - productTotalCost;
    const profitPerUnit = netUnits > 0 ? profit / netUnits : 0;
    const margin = p.revenue !== 0 ? (profit / p.revenue) * 100 : 0;

    results.push({
      ...p,
      net_units: netUnits,
      cost_per_unit: cost,
      product_total_cost: round2(productTotalCost),
      profit: round2(profit),
      profit_per_unit: round2(profitPerUnit),
      margin: round2(margin),
      is_loss: profit < 0,
      has_cost: true,
    });
  }

  return { results, missingCosts };
}