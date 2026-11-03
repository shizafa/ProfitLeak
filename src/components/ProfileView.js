"use client";

import { useEffect, useRef, useState } from "react";
import LogoutModal from "@/components/dashboard/layout/LogoutModal";

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ProfileView({ fullName, email }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    function onOutsideClick(e) {
      if (!containerRef.current?.contains(e.target)) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  };

  const displayName = fullName || "Loading...";

  return (
    <div className="dropdown ms-sm-3 header-item topbar-user" ref={containerRef}>
      <button
        aria-expanded={menuOpen}
        aria-haspopup="true"
        className="btn material-shadow-none"
        id="page-header-user-dropdown"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="d-flex align-items-center">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary flex-shrink-0"
            style={{ width: 32, height: 32, fontSize: 12, fontWeight: 600 }}
          >
            {initials(fullName)}
          </span>
          <span className="text-start ms-xl-2">
            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
              {displayName}
            </span>
            {email && (
              <span
                className="d-none d-xl-block ms-1 user-name-sub-text text-muted"
                style={{ fontSize: 12 }}
              >
                {email}
              </span>
            )}
          </span>
        </span>
      </button>
      {/* Bootstrap only applies its own offsets when Popper.js is loaded, which this
          app doesn't load, so place the menu ourselves. */}
      <div
        className={`dropdown-menu dropdown-menu-end${menuOpen ? " show" : ""}`}
        style={{ top: "100%", right: 0, left: "auto", marginTop: 6 }}
      >
        <h6 className="dropdown-header">Welcome{fullName ? ` ${fullName}` : ""}!</h6>
        <a className="dropdown-item" href="/dashboard/settings">
          <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1" />{" "}
          <span className="align-middle">Settings</span>
        </a>
        <a className="dropdown-item" href="#" onClick={handleLogoutClick}>
          <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{" "}
          <span className="align-middle" data-key="t-logout">
            Logout
          </span>
        </a>
      </div>

      {logoutModalOpen && (
        <LogoutModal
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </div>
  );
}
