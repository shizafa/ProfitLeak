function round2(n) {
  return Math.round(n * 100) / 100;
}

// products: the list from summarizeBySku
// costs: rows from the product_costs table ({ sku, cost_per_unit })
// Returns { results, missingCosts }
export function calculateProfit(products, costs) {
  // Make a quick lookup: { "MUG-BLUE-01": 4, "LAMP-DESK": 28, ... }
  const costBySku = {};
  for (const c of costs) {
    costBySku[c.sku] = Number(c.cost_per_unit);
  }

  const results = [];
  const missingCosts = [];

  for (const p of products) {
    // No cost saved for this SKU? Remember it and skip
    if (costBySku[p.sku] === undefined) {
      missingCosts.push({ sku: p.sku, product_name: p.product_name });
      continue;
    }

    const productTotalCost = costBySku[p.sku] * p.units_sold;
    const profit = p.revenue - p.amazon_fees - productTotalCost;
    const profitPerUnit = p.units_sold > 0 ? profit / p.units_sold : 0;
    const margin = p.revenue !== 0 ? (profit / p.revenue) * 100 : 0;

    results.push({
      ...p,
      product_total_cost: round2(productTotalCost),
      profit: round2(profit),
      profit_per_unit: round2(profitPerUnit),
      margin: round2(margin),
      is_loss: profit < 0,
    });
  }

  return { results, missingCosts };
}