"use client";
import { useEffect, useState } from 'react';
export default function PageTitle({ title }) {
    const [fullName, setFullName] = useState(null);
  
    useEffect(() => {
      fetch('/api/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.full_name) setFullName(data.full_name);
        })
        .catch(() => {});3
    }, []);
  
  return (
    <div className="h-100">
      <div className="row mb-3 pb-1">
        <div className="col-12">
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-16 mb-1">Good Morning, {fullName || 'Loading...'}!</h4>
              <p className="text-muted mb-0">
                Here's what's happening with your store this week.
              </p>
            </div>
            <div className="mt-3 mt-lg-0">
              <form action="javascript:void(0);">
                <div className="row g-3 mb-0 align-items-center">
                  <div className="col-sm-auto">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border-0 minimal-border dash-filter-picker shadow"
                        data-provider="flatpickr"
                        data-range-date="true"
                        data-date-format="d M, Y"
                        data-deafult-date="01 Jan 2022 to 31 Jan 2022"
                      />
                      <div className="input-group-text bg-primary border-primary text-white">
                        <i className="ri-calendar-2-line" />
                      </div>
                    </div>
                  </div>
                  {/*end col*/}
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-soft-success material-shadow-none"
                    >
                      <i className="ri-add-circle-line align-middle me-1" /> Product 
                    </button>
                  </div>
                  {/*end col*/}
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-soft-info btn-icon waves-effect material-shadow-none waves-light layout-rightside-btn"
                    >
                      <i className="ri-pulse-line" />
                    </button>
                  </div>
                  {/*end col*/}
                </div>
                {/*end row*/}
              </form>
            </div>
          </div>
          {/* end card header */}
        </div>
        {/*end col*/}
      </div>
    </div>
  );
}
