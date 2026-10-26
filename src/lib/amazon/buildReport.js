import { calculateProfit } from "./calculateProfit";

function round2(n) {
  return Math.round(n * 100) / 100;
}

// products: base numbers per SKU { sku, product_name, units_sold, refund_count, revenue, amazon_fees }
// otherCharges: [{ type, count, amount }]
// costs: rows from product_costs ({ sku, cost_per_unit })
// Returns { results, otherCharges, missingCosts, totals }
export function buildReport(products, otherCharges, costs) {
  // 1. Rebuild the extra numbers from the base numbers
  const withExtras = products.map((p) => {
    const units = Number(p.units_sold);
    const refunds = Number(p.refund_count);
    const revenue = round2(Number(p.revenue));
    const fees = round2(Number(p.amazon_fees));

    return {
      sku: p.sku,
      product_name: p.product_name,
      units_sold: units,
      refund_count: refunds,
      revenue,
      amazon_fees: fees,
      revenue_after_fees: round2(revenue - fees),
      refund_rate: units > 0 ? round2((refunds / units) * 100) : 0,
      fee_percent: revenue !== 0 ? round2((fees / revenue) * 100) : 0,
      avg_price_per_unit: units > 0 ? round2(revenue / units) : 0,
      fee_per_unit: units > 0 ? round2(fees / units) : 0,
    };
  });

  // 2. Profit (SKUs without a cost stay in the list with null profit)
  const { results, missingCosts } = calculateProfit(withExtras, costs ?? []);

  // 3. Totals for the summary cards
  const withCost = results.filter((r) => r.has_cost);

  const totals = {
    revenue: round2(withExtras.reduce((sum, p) => sum + p.revenue, 0)),
    fees: round2(withExtras.reduce((sum, p) => sum + p.amazon_fees, 0)),
    units: withExtras.reduce((sum, p) => sum + p.units_sold, 0),
    refunds: withExtras.reduce((sum, p) => sum + p.refund_count, 0),
    other_charges: round2(otherCharges.reduce((sum, c) => sum + Number(c.amount), 0)),
    profit: round2(withCost.reduce((sum, r) => sum + r.profit, 0)),
    skus_total: results.length,
    skus_with_cost: withCost.length,
  };

  return { results, otherCharges, missingCosts, totals };
}