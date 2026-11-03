"use client";

import { useEffect, useState } from 'react';
import ProfileView from '@/components/ProfileView';

export default function TopBar() {
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.full_name) setFullName(data.full_name);
        if (data?.email) setEmail(data.email);
      })
      .catch(() => {});
  }, []);

  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            {/* App Search*/}
            <form className="app-search d-none d-md-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  autoComplete="off"
                  id="search-options"
                  defaultValue=""
                />
                <span className="mdi mdi-magnify search-widget-icon" />
                <span
                  className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"
                  id="search-close-options"
                />
              </div>
            </form>
          </div>
          {/* APP SEARCH END */}
          <div className="d-flex align-items-center">
            <ProfileView fullName={fullName} email={email} />
          </div>
        </div>
      </div>
    </header>
  );
}
