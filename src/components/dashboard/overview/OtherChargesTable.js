"use client";

const money = (n) => `$${Number(n ?? 0).toFixed(2)}`;

export default function OtherChargesTable({ otherCharges = [] }) {
  return (
    <div className="col-xl-12">
      <div className="card" style={{ width: "100%" }}>
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Other Charges</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive table-card">
            <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
              <thead className="text-muted table-light">
                <tr>
                  <th>Type</th>
                  <th>Transactions</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {otherCharges.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No other charges in this report.
                    </td>
                  </tr>
                )}

                {otherCharges.map((c) => (
                  <tr key={c.type}>
                    <td className="fw-medium">{c.type}</td>
                    <td>{c.count}</td>
                    <td className={c.amount < 0 ? "text-danger" : "text-success"}>
                      {money(c.amount)}
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