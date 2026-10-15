"use client";

export default function Sidebar() {
  return (
    <div className="app-menu navbar-menu">
      <div className="navbar-brand-box">
        {/* Dark Logo*/}
        <a href="/dashboard/overview" className="logo logo-dark">
          <span className="logo-sm">
            <img src="/images/dark-img.png" alt="" height={80} />
          </span>
          <span className="logo-lg">
            <img src="/images/dark-img.png" alt="" height={80} />
          </span>
        </a>
        {/* Light Logo*/}
        <a href="/dashboard/overview" className="logo logo-light">
          <span className="logo-sm">
            <img src="/images/dark-img.png" alt="" height={80} />
          </span>
          <span className="logo-lg">
            <img src="/images/dark-img.png" alt="" height={80} />
          </span>
        </a>
      </div>
      <div id="scrollbar">
        <div className="container-fluid">
          <div id="two-column-menu"></div>
          <ul className="navbar-nav" id="navbar-nav">
            <li className="nav-item">
              <a href="/dashboard/overview" className="nav-link menu-link">
                <i className="ri-dashboard-2-line" />{" "}
                <span>Overview</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/dashboard/history" className="nav-link menu-link">
                <i className="ri-history-line" />{" "}
                <span>History</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/dashboard/settings" className="nav-link menu-link">
                <i className="ri-settings-3-line" />{" "}
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="sidebar-background" />
    </div>
  );
}
