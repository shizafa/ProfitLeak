const PLANS = [
  {
    price: '0',
    name: 'Once Free',
    reviews: '1 Free Report Review',
    button: 'btn-light',
    cta: 'Start Free',
  },
  {
    price: '9',
    name: 'Pro',
    reviews: '2 Report Reviews per Month',
    button: 'btn-primary',
    cta: 'Start Now',
  },
  {
    price: '19',
    name: 'Max',
    reviews: '4 Report Reviews per Month',
    button: 'btn-light',
    cta: 'Start Now',
  },
];

// Same perks on every plan; only the number of reviews changes.
const PLAN_PERKS = [
  'Loss-Making Products Highlighted',
  'Profit Calculated per Product',
  'Loss Reason for Each Product',
  'Report History Saved',
];

export default function Pricing() {
  return (
    <div className="container mt-100 mt-60" id="pricing">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="section-title text-center mb-4 pb-2">
            <h4 className="title mb-4">Pricing Plans</h4>
            <p className="text-muted para-desc mx-auto mb-0">
              Upload your Amazon report and see which products are losing money.
              Your first review is free.
            </p>
          </div>
        </div>
        {/* end col */}
      </div>
      {/* end row */}

      <div className="row">
        {PLANS.map((plan) => (
          <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2" key={plan.name}>
            <div className="card pricing price-two rounded text-center border-0 shadow px-4 py-5 bg-white">
              <div className="d-flex justify-content-center mb-5">
                <span className="mb-0 mt-2">$</span>
                <span className="price h1 mb-0">{plan.price}</span>
                <span className="align-self-end mb-1">/Per Month</span>
              </div>

              <div className="p-2 bg-soft-primary h6 mx-5 rounded-lg">
                <span className="text-uppercase">{plan.name}</span>
              </div>

              <ul className="list-unstyled mb-0 mt-4">
                <li className="text-muted mt-3">{plan.reviews}</li>
                {PLAN_PERKS.map((perk) => (
                  <li className="text-muted mt-3" key={perk}>
                    {perk}
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-2">
                {/* TODO: point this at your signup / checkout route */}
                <a href="#" className={'btn ' + plan.button}>
                  {plan.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
        {/* end col */}
      </div>
      {/* end row */}
    </div>
  );
}