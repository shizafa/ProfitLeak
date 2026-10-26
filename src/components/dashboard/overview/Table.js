"use client";

const money = (n) => `$${Number(n).toFixed(2)}`;
const empty = { profit: 0, units: 0, fees: 0, revenue: 0 };

export default function Table({ results = [] }) {
  return (
    <div className="col-xl-12">
      <div className="card" style={{ width: "100%" }}>
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Products</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive table-card">
            <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
              <thead className="text-muted table-light">
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Units</th>
                  <th>Refunds</th>
                  <th>Revenue</th>
                  <th>Fees</th>
                  <th>Cost</th>
                  <th>Profit</th>
                  <th>Margin</th>
                  <th>Status</th>
                </tr>
              </thead>
              {results.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center text-muted">
                    Upload a report to see your products.
                  </td>
                </tr>
              )}
              <tbody>
                {results.map((r) => (
                  <tr key={r.sku}>
                    <td className="fw-medium link-primary">{r.sku}</td>
                    <td>{r.product_name}</td>
                    <td>{r.units_sold}</td>
                    <td>{r.refund_count}</td>
                    <td>{money(r.revenue)}</td>
                    <td>{money(r.amazon_fees)}</td>
                    <td>{money(r.product_total_cost)}</td>
                    <td className={r.is_loss ? "text-danger" : "text-success"}>
                      {money(r.profit)}
                    </td>
                    <td>{r.margin}%</td>
                    <td>
                      <span
                        className={
                          r.is_loss
                            ? "badge bg-danger-subtle text-danger"
                            : "badge bg-success-subtle text-success"
                        }
                      >
                        {r.is_loss ? "Loss" : "Profit"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
