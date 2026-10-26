"use client";

const money = (n) => `$${Number(n ?? 0).toFixed(2)}`;

const empty = {
  revenue: 0,
  fees: 0,
  units: 0,
  refunds: 0,
  other_charges: 0,
  profit: 0,
  skus_total: 0,
  skus_with_cost: 0,
};

export default function SummaryCards({ totals = empty }) {
  const hasProfit = totals.skus_with_cost > 0;

  const cards = [
    {
      label: "Revenue",
      value: money(totals.revenue),
      note: `${totals.units} units sold, ${totals.refunds} refunded`,
      icon: "bx bx-wallet",
      color: "primary",
    },
    {
      label: "Amazon Fees",
      value: money(totals.fees),
      note: "Selling + FBA + other fees",
      icon: "bx bx-receipt",
      color: "warning",
    },
    {
      label: "Other Charges",
      value: money(totals.other_charges),
      note: "Service fees, adjustments, etc.",
      icon: "bx bx-error-circle",
      color: "danger",
    },
    {
      label: "Total Profit",
      value: hasProfit ? money(totals.profit) : "—",
      note: hasProfit
        ? `Based on ${totals.skus_with_cost} of ${totals.skus_total} SKUs`
        : "Add product costs to see profit",
      icon: "bx bx-dollar-circle",
      color: "success",
    },
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
                  <h4 className="fs-22 fw-semibold ff-secondary mb-2">{c.value}</h4>
                  <p className="text-muted fs-12 mb-0">{c.note}</p>
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