// Source: index-saas.html lines 84-110

import Link from "next/link";

// The play button carries data-type/data-id and class "lightbox" -> picked up by Tobii.
export default function Hero() {
  return (
    <section
      className="bg-home bg-primary d-flex align-items-center"
      style={{
        background: "url('/images/saas-shape.png') center center",
        height: 'auto',
      }}
      id="home"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12 text-center mt-0 mt-md-5 pt-0 pt-md-5">
            <div className="title-heading margin-top-100">
              <h1 className="heading text-white title-dark mb-3">
                Find the products <br></br> that are quietly losing you money
              </h1>
              <p className="para-desc mx-auto text-white-50">
                Upload your Amazon report, add your product costs, and see which products lose money, how much, and why. No account access needed.
              </p>

              <Link
                href="/signup"
                className=""
              >
                <button className="btn btn-pills btn-primary">Get Started For free</button>
              </Link>
            </div>

            <div className="home-dashboard">
              <img src="/images/lapy.png" alt="" className="img-fluid" />
            </div>

            <img
              src="/images/square/square-white.png"
              className="img-fluid rounded-pill position-absolute top-0 start-50 translate-middle-x avatar avatar-md-md zoom-in-out z-index-0"
              alt=""
            />
            <img
              src="/images/square/square-white.png"
              className="img-fluid rounded-pill bg-image-position avatar avatar-md-md mover-2 z-index-0"
              alt=""
            />
            <img
              src="/images/square/square-white.png"
              className="img-fluid rounded-md avatar avatar-md-md bg-image-position-2 spin-anything z-index-0"
              alt=""
            />
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* end container */}
    </section>
  );
}
