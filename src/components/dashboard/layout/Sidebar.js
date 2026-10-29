"use client";
import { useState } from "react";

// "2026-10-01" invalid/missing -> null
function formatShortDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// "2026-10-15" -> "Oct 15, 2026" ; invalid/missing -> null
function formatLongDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// e.g. "Oct 1 – Oct 14 (uploaded Oct 15, 2026)". Falls back to the file name
// if the period couldn't be read from the report.
function reportLabel(report) {
  const start = formatShortDate(report.period_start);
  const end = formatShortDate(report.period_end);
  const uploaded = formatLongDate(report.created_at);

  let period = report.file_name;
  if (start && end) period = start === end ? start : `${start} – ${end}`;

  return uploaded ? `${period} (uploaded ${uploaded})` : period;
}

export default function Sidebar() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [reports, setReports] = useState(null); // null = not fetched yet
  const [loadingReports, setLoadingReports] = useState(false);

  async function loadReports() {
    setLoadingReports(true);
    try {
      const res = await fetch("/api/reports");
      const data = res.ok ? await res.json() : null;
      setReports(data?.reports ?? []);
    } catch {
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  }

  function toggleHistory(e) {
    e.preventDefault();
    if (!historyOpen && reports === null) loadReports();
    setHistoryOpen((open) => !open);
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  };

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
              <a
                href="#"
                className="nav-link menu-link"
                onClick={toggleHistory}
                aria-expanded={historyOpen}
              >
                <i className="ri-history-line" />{" "}
                <span className="flex-grow-1">History</span>
                <i className={historyOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
              </a>

              {historyOpen && (
                <ul className="nav nav-sm flex-column ms-4">
                  {loadingReports && (
                    <li className="nav-item">
                      <span className="nav-link text-muted">Loading...</span>
                    </li>
                  )}

                  {!loadingReports && reports?.length === 0 && (
                    <li className="nav-item">
                      <span className="nav-link text-muted">No reports yet</span>
                    </li>
                  )}

                  {!loadingReports &&
                    reports?.map((report) => (
                      <li className="nav-item" key={report.id}>
                        <a
                          href={`/dashboard/overview?report=${report.id}`}
                          className="nav-link"
                        >
                          {reportLabel(report)}
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </li>
            <li className="nav-item">
              <a href="/dashboard/settings" className="nav-link menu-link">
                <i className="ri-settings-3-line" />{" "}
                <span>Settings</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link menu-link" onClick={handleLogout}>
                <i className="ri-logout-box-r-line" />{" "}
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="sidebar-background" />
    </div>
  );
}
