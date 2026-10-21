'use client';

import { useEffect, useState } from 'react';

// Source: index-saas.html lines 34-80
// Client component: the hamburger calls toggleMenu(), defined in /js/app.js
export default function Navbar() {
  const [fullName, setFullName] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.full_name) setFullName(data.full_name);
      })
      .catch(() => {});
  }, []);

  return (
    <header id="topnav" className="defaultscroll sticky">
      <div className="container">
        {/* Logo container */}
        <a className="logo" href="/" style={{ height: 'auto' }}>
          <span className="logo-light-mode">
            <img src="/images/image.png" className="l-dark" alt="" style={{ height: '80px' }} />
            <img src="/images/dark-img.png" className="l-light" alt="" style={{ height: '80px' }} />
          </span>
          <img src="/images/dark-img.png" className="logo-dark-mode" alt="" style={{ height: '80px' }} />
        </a>
        {/* Logo End */}

        {/* Start navbar Toggle */}
        <div className="menu-extras">
          <div className="menu-item">
            {/* Mobile menu toggle */}
            <a
              className="navbar-toggle"
              id="isToggle"
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => window.toggleMenu?.()}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </a>
            {/* End mobile menu toggle */}
          </div>
        </div>
        {/* End navbar Toggle */}

        <div id="navigation">
          {/* Navigation Menu */}
          <ul className="navigation-menu nav-right nav-light" id="navmenu-nav">
            <li className="has-submenu">
              <a href="#home">Home</a>
            </li>
            <li className="has-submenu">
              <a href="#features">Feature</a>
            </li>
            <li className="has-submenu">
              <a href="#testi">Testimonial</a>
            </li>
            <li className="has-submenu">
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href={fullName ? '/dashboard' : '/login'}>{fullName || 'Login'}</a>
            </li>
          </ul>
          {/* end navigation menu */}
        </div>
        {/* end navigation */}
      </div>
      {/* end container */}
    </header>
  );
}
