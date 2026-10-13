'use client';
export default function Cta() {
  return (
    <section className="section">
      <div className="bg-overlay bg-gradient-primary"></div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="section-title text-center">
              <h4 className="title text-white title-dark mb-3">
                Get your free quote today?
              </h4>
              <p className="para-desc mx-auto text-white-50">
                Explore and learn more about everything from machine learning and
                global payments to scaling your team.
              </p>

              <div className="subcribe-form mt-5">
                <form>
                  <div className="mb-3">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="bg-white rounded-lg opacity-5"
                      required
                      placeholder="Type your mail id..."
                    />
                    <button type="submit" className="btn btn-pills btn-primary">
                      Get Started
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* end container */}
    </section>
  );
}
