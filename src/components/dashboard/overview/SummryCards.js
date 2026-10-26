"use client";

const money = (n) => `$${Number(n).toFixed(2)}`;
const empty = { profit: 0, units: 0, fees: 0, revenue: 0 };

export default function SummaryCards({ totals = empty }) {
  const cards = [
    { label: "Total Profit", value: money(totals.profit), icon: "bx bx-dollar-circle", color: "success" },
    { label: "Units Sold", value: totals.units, icon: "bx bx-shopping-bag", color: "info" },
    { label: "Amazon Fees", value: money(totals.fees), icon: "bx bx-user-circle", color: "warning" },
    { label: "Revenue", value: money(totals.revenue), icon: "bx bx-wallet", color: "primary" },
  ];

  return (
    <div className="row">
      {cards.map((c) => (
        <div className="col-xl-3 col-md-6" key={c.label}>
          <div className="card card-animate">
            <div className="card-body">
              <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                {c.label}
              </p>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">{c.value}</h4>
                  <a href="#" className="text-decoration-underline">{c.link}</a>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className={`avatar-title bg-${c.color}-subtle rounded fs-3`}>
                    <i className={`${c.icon} text-${c.color}`} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}