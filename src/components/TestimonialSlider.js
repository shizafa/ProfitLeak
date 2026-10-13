
const TESTIMONIALS = [
  { img: '01', name: 'Calvin Carlo', role: 'Manager' , },
  { img: '02', name: 'Christa Smith', role: 'Manager' },
  { img: '03', name: 'Jemina CLone', role: 'Manager' },
  { img: '04', name: 'Smith Vodka', role: 'Manager' },
  { img: '05', name: 'Cristino Murfi', role: 'Manager' },
];

const QUOTE =
  '" According to most sources, Lorum Ipsum can be traced back to a text composed by Cicero Launch your campaign and benefit from our expertise. "';

export default function TestimonialSlider() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="features-absolute">
            <div className="row align-items-center g-0">
              <div className="col-12">
                <div className="tiny-three-item">
                  {TESTIMONIALS.map((person) => (
                    <div className="tiny-slide" key={person.img}>
                      <div className="customer-testi m-1">
                        <div className="content p-3 shadow rounded bg-white position-relative text-center">
                          <p className="text-muted fst-italic">{QUOTE}</p>

                          <ul className="list-unstyled mb-0 text-warning mt-2">
                            {[0, 1, 2, 3, 4].map((star) => (
                              <li className="list-inline-item" key={star}>
                                <i className="mdi mdi-star"></i>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-center mt-3">
                          <img
                            src={'/images/client/' + person.img + '.jpg'}
                            className="avatar avatar-small rounded-pill shadow"
                            alt={person.name}
                          />
                          <h6 className="mb-1 mt-2 fw-normal text-dark">
                            {person.name}
                          </h6>
                          <small className="text-muted d-block">
                            {person.role}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
  );
}
