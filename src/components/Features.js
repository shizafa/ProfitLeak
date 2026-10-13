import Link from "next/link";
const FEATURES = [
  { icon: 'uil-water',           title: 'True profit per product' , description: 'See the actual profit margin for each product in your Amazon inventory.' },
  { icon: 'uil-dropbox',         title: 'Green or red, at a glance' , description: 'Quickly identify which products are profitable and which are losing money.' },
  { icon: 'uil-focus-target',    title: 'The reason behind each loss' , description: 'Understand the specific factors contributing to product losses.' },
  { icon: 'uil-fire',            title: 'Drill into any product' , description: 'Analyze individual products in detail to uncover hidden issues.' },
  { icon: 'uil-game-structure',  title: 'No Amazon login needed' , description: 'Access your data without requiring Amazon account credentials.' },
  { icon: 'uil-flower',          title: 'Track changes over time' , description: 'Monitor your product performance and profitability trends over time.' },
];

// const FEATURE_DESC =[
//   { title: 'True profit per product', description: 'See the actual profit margin for each product in your Amazon inventory.' },
//   { title: 'Green or red, at a glance', description: 'Quickly identify which products are profitable and which are losing money.' },
//   { title: 'The reason behind each loss', description: 'Understand the specific factors contributing to product losses.' },
//   { title: 'Drill into any product', description: 'Analyze individual products in detail to uncover hidden issues.' },
//   { title: 'No Amazon login needed', description: 'Access your data without requiring Amazon account credentials.' },
//   { title: 'Track changes over time', description: 'Monitor your product performance and profitability trends over time.' }
// ];
const CHECKLIST = [
  'Your supplier costs live outside Amazon',
  'Fees are scattered across many rows',
  'Nobody is checking profit per product',
];

const CLIENTS = ['amazon', 'google', 'lenovo', 'paypal', 'shopify', 'spotify'];

export default function Features() {
  return (
    <section className="section mt-0 mt-md-5 overflow-hidden" id="features">
      {/* ---------- 1. feature cards ---------- */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="section-title mb-4 pb-2">
              <h4 className="title mb-4">Know exactly where your money goes</h4>
              <p className="text-muted para-desc mx-auto mb-0">
                Profit Leak reads your Amazon report and shows you, product by product, what’s earning and what’s losing. you need
                to generate awareness, drive traffic, connect.
              </p>
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}

        <div className="row">
          {FEATURES.map((feature) => (
            <div className="col-lg-4 col-md-6 mt-4 pt-2" key={feature.title}>
              <div className="d-flex features feature-primary">
                <div className="feature-icon text-center">
                  <i className={`uil ${feature.icon} rounded h4`}></i>
                </div>
                <div className="flex-1 ms-4">
                  <h5 className="mt-0">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
          {/* End Col */}
        </div>
        {/* End Row */}
      </div>
      {/* end container */}

      {/* ---------- 2. image left / text right ---------- */}
      <div className="container mt-100 mt-60">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-5">
            <div className="app-feature-shape-left position-relative">
              <div className="text-center text-md-start">
                <img src="/images/app/classic03.png" className="img-fluid" alt="" />
              </div>
            </div>
          </div>
          {/* end col */}

          <div className="col-lg-6 col-md-7 mt-5 mt-sm-0">
            <div className="section-title">
              <h1 className="title mb-3">
                Your Amazon payout hides <br /> the real story
              </h1>
              <p className="para-desc text-muted">
                Amazon pays you one lump sum that mixes sales, refunds and fees. You see the total, but not which products earned it and which ones ate it. A product can lose money every day while your account looks healthy.
              </p>
              <ul className="list-unstyled text-muted">
                {CHECKLIST.map((item) => (
                  <li className="mb-1" key={item}>
                    <span className="text-primary h5 me-2">
                      <i className="uil uil-check-circle align-middle"></i>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                {/* TODO: point this at a real route */}
                <Link href="/signup" className="mt-3 h6 text-primary">
                  Find Out More <i className="uil uil-angle-right-b"></i>
                </Link>
              </div>
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* end container */}

      {/* ---------- 3. text left / image right ---------- */}
      <div className="container mt-100 mt-60">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-7 order-2 order-md-1 mt-5 mt-sm-0">
            <div className="section-title">
              <h1 className="title mb-3">
                Upload a report. Get your answer.
              </h1>
              <p className="para-desc text-muted">
                Download one report from Seller Central and drop it in. Add what each product costs you, and Profit Leak works out your real profit for every product. Red ones are losing money. We show you how much, and which cost is pulling it down. Come back with a newer report whenever you want fresh numbers.
              </p>
              <div className="mt-4">
                {/* TODO: point this at a real route */}
                <Link href="/signup" className="btn btn-primary">
                  Learn More <i className="uil uil-angle-right-b"></i>
                </Link>
              </div>
            </div>
          </div>
          {/* end col */}

          <div className="col-lg-6 col-md-5 order-1 order-md-2">
            <div className="app-feature-shape-right position-relative">
              <div className="text-center text-md-end">
                <img src="/images/app/classic03.png" className="img-fluid" alt="" />
              </div>
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* end container */}

      {/* ---------- 4. client logos ---------- */}
      <div className="container mt-100 mt-60">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="section-title mb-4 pb-2">
              <h4 className="title mb-4">More than 10K+ Sellers are Using Profit Leak</h4>
              <p className="text-muted para-desc mx-auto mb-0">
                See your actual profit with Profit Leak. No Amazon login needed. No complicated setup. Just upload a report and see your real profit per product.
              </p>
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}

        <div className="row justify-content-center">
          {CLIENTS.map((client) => (
            <div
              className="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2"
              key={client}
            >
              <img
                src={`/images/client/${client}.svg`}
                className="avatar avatar-ex-sm"
                alt={client}
              />
            </div>
          ))}
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* end container */}
    </section>
  );
}
