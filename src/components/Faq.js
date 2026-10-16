'use client';
const FAQS = [
  { id: 'One', question: 'How does it work ?', open: true , answer: 'Download one transaction report from Seller Central and upload it here. Enter what each product costs you. Profit Leak works out your real profit for each product and marks it green or red.'},
  { id: 'Two', question: 'Do I need to connect my Amazon account?', open: false , answer: 'No, you do not need to connect your Amazon account. You can upload your transaction reports directly here.'  },
  { id: 'Three', question: 'Which report do I need, and where do I find it?', open: false , answer: 'You need to download your transaction report from Seller Central. You can find it under "Reports" and then "Transaction Reports".' },
  { id: 'five', question: 'Why do I have to enter my product costs?', open: false , answer: 'Entering your product costs allows Profit Leak to calculate your real profit for each item.' },
  { id: 'six', question: 'How does it know why a product is losing money?', open: false , answer: 'Profit Leak analyzes your product costs and sales data to identify potential issues.' },
  { id: 'seven', question: 'How do I check my numbers again later?', open: false , answer: 'Upload a newer report any time. Your costs are kept, everything is recalculated, and you can see what changed since your last upload.' },
];

const FAQ_ANSWER =
  'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.';

export default function Faq() {
  return (
    <div className="container mt-100 mt-60">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="section-title mb-4 pb-2 text-center">
            <h4 className="title mb-3">Frequently Asked Questions</h4>
            <p className="text-muted mx-auto para-desc mb-0">
              Our FAQ section is designed to provide you with quick and easy access to the most common questions and concerns that our users have. We understand that you may have questions about our product or service, and we want to make sure that you have the information you need to make informed decisions.
            </p>
          </div>
        </div>
        {/* end col */}
      </div>
      {/* end row */}

      <div className="row align-items-center">
        <div className="col-md-6 mt-4 pt-2">
          <img src="/images/dashboard-ill.png" className="img-fluid" alt="" />
        </div>
        {/* end col */}

        <div className="col-md-6 mt-4 pt-2">
          <div className="accordion" id="buyingquestion">
            {FAQS.map((faq, i) => (
              <div
                className={'accordion-item rounded' + (i === 0 ? '' : ' mt-3')}
                key={faq.id}
              >
                <h2 className="accordion-header" id={'heading' + faq.id}>
                  <button
                    className={
                      'accordion-button fw-normal border-0 bg-light rounded shadow' +
                      (faq.open ? '' : ' collapsed')
                    }
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={'#collapse' + faq.id}
                    aria-expanded={faq.open ? 'true' : 'false'}
                    aria-controls={'collapse' + faq.id}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div
                  id={'collapse' + faq.id}
                  className={
                    'accordion-collapse border-0 collapse' +
                    (faq.open ? ' show' : '')
                  }
                  aria-labelledby={'heading' + faq.id}
                  data-bs-parent="#buyingquestion"
                >
                  <div className="accordion-body text-muted bg-white">
                    {faq.answer}
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
  );
}
