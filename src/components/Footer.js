
const SOCIALS = [
  { href: 'http://linkedin.com', icon: 'uil-linkedin', title: 'Linkedin' },
  { href: 'https://www.facebook.com', icon: 'uil-facebook-f align-middle', title: 'facebook' },
  { href: 'https://www.instagram.com', icon: 'uil-instagram align-middle', title: 'instagram' },
  { href: 'https://x.com', icon: 'uil-twitter align-middle', title: 'twitter' },
];

//NEED TO SWAP LINKSSSS
const COMPANY_LINKS = [
  'About us',
  'Services',
  'Pricing',
  'Login',
];

const USEFUL_LINKS = [
  'Terms of Services',
  'Privacy Policy',
  'Documentation',
  'Changelog',
  'Components',
];

export default function Footer() {
  return (
    <footer className="bg-footer">
      {/* ---------- newsletter band ---------- */}
      <div className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="section-title">
                <div className="d-flex align-items-center">
                  <i className="uil uil-envelope-star display-4 text-white title-dark"></i>
                  <div className="flex-1 ms-md-4 ms-3">
                    <h4 className="fw-bold text-light title-dark mb-1">
                      Subscribe to our newsletters
                    </h4>
                    <p className="text-white-50 mb-0">
                      Sign up and receive the latest tips via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-4 mt-sm-0">
              <div className="text-md-end ms-5 ms-sm-0">
                <a href="#" className="btn btn-primary">
                  Subscribe Now
                </a>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
        {/* end container */}
      </div>
      {/* end div */}

      {/* ---------- 4-column link area ---------- */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer-py-60 footer-border">
              <div className="row flex justify-content-center gap-4">
                <div className="col-lg-4 col-12 mb-0 mb-md-4 pb-0 pb-md-2">
                  <a href="#" className="logo-footer">
                    <img src="/images/dark-img.png" alt="" style={{ height: '100px' }} />
                  </a>
                  <p className="mt-4">
                    Know about your Sales, profit and loss, and other key metrics of your business with our easy to use dashboard.
                  </p>
                  <ul className="list-unstyled social-icon foot-social-icon mb-0 mt-4">
                    {SOCIALS.map((social) => (
                      <li className="list-inline-item" key={social.title}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded"
                        >
                          <i className={'uil ' + social.icon} title={social.title}></i>
                        </a>
                      </li>
                    ))}
                  </ul>
                  {/* end icon */}
                </div>
                {/* end col */}

                <div className="col-lg-2 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                  <h5 className="footer-head">Company</h5>
                  <ul className="list-unstyled footer-list mt-4">
                    {COMPANY_LINKS.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-foot">
                          <i className="uil uil-angle-right-b me-1"></i> {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* end col */}

                {/* <div className="col-lg-2 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                  <h5 className="footer-head">Usefull Links</h5>
                  <ul className="list-unstyled footer-list mt-4">
                    {USEFUL_LINKS.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-foot">
                          <i className="uil uil-angle-right-b me-1"></i> {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div> */}
                {/* end col */}

                <div className="col-lg-4 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                  <h5 className="footer-head">Start with Profit Leak Founder</h5>

                  <ul className="list-unstyled footer-list mt-4 mb-2">
                    <li className="list-inline-item mx-1">
                      <a href="#" className="btn btn-soft-primary">
                        Signin
                      </a>
                    </li>
                    <li className="list-inline-item mx-1">
                      <a href="#" className="btn btn-primary">
                        Signup
                      </a>
                    </li>
                  </ul>
                  <small className="d-block">
                    Are you developer ?{' '}
                    <a href="#" className="text-foot fw-semibold">
                      Learn More <i className="uil uil-arrow-right"></i>
                    </a>
                  </small>

                  <img src="/images/dark-img.png" className="mt-4" alt="" style={{ height: '80px' }} />
                </div>
                {/* end col */}
              </div>
              {/* end row */}
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* end container */}

      {/* ---------- copyright bar ---------- */}
      <div className="footer-py-30 footer-bar">
        <div className="container text-center">
          <div className="row">
            <div className="col">
              <div className="text-center">
                <p className="mb-0">
                   Profit Leak 2026 | All Rights Reserved.
                </p>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
        {/* end container */}
      </div>
    </footer>
  );
}
