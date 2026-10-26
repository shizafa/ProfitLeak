"use client";

// Show "—" when a value is null (e.g. no cost saved yet)
const money = (n) => (n === null || n === undefined ? "—" : `$${Number(n).toFixed(2)}`);
const percent = (n) => (n === null || n === undefined ? "—" : `${n}%`);

// onAddCost(row) is called when the "Add cost" button is clicked
export default function Table({ results = [], onAddCost, emptyText })  {
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
                  <th>Refund rate</th>
                  <th>Avg price</th>
                  <th>Revenue</th>
                  <th>Fees</th>
                  <th>Fee %</th>
                  <th>After fees</th>
                  <th>Cost</th>
                  <th>Profit</th>
                  <th>Margin</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 && (
                  <tr>
                    <td colSpan={15} className="text-center text-muted">
                      Upload a report to see your products.
                    </td>
                  </tr>
                )}

                {results.map((r) => (
                  <tr key={r.sku}>
                    <td className="fw-medium link-primary">{r.sku}</td>
                    <td>{r.product_name}</td>
                    <td>{r.units_sold}</td>
                    <td>{r.refund_count}</td>
                    <td>{percent(r.refund_rate)}</td>
                    <td>{money(r.avg_price_per_unit)}</td>
                    <td>{money(r.revenue)}</td>
                    <td>{money(r.amazon_fees)}</td>
                    <td>{percent(r.fee_percent)}</td>
                    <td>{money(r.revenue_after_fees)}</td>
                    <td>{money(r.product_total_cost)}</td>
                    <td
                      className={
                        !r.has_cost ? "text-muted" : r.is_loss ? "text-danger" : "text-success"
                      }
                    >
                      {money(r.profit)}
                    </td>
                    <td>{percent(r.margin)}</td>
                    <td>
                      {!r.has_cost ? (
                        <span className="badge bg-warning-subtle text-warning">No cost</span>
                      ) : (
                        <span
                          className={
                            r.is_loss
                              ? "badge bg-danger-subtle text-danger"
                              : "badge bg-success-subtle text-success"
                          }
                        >
                          {r.is_loss ? "Loss" : "Profit"}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-soft-primary material-shadow-none"
                        onClick={() => onAddCost?.(r)}
                      >
                        {r.has_cost ? "Edit cost" : "Add cost"}
                      </button>
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