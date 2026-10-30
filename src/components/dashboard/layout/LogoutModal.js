"use client";
import { useEffect, useState } from "react";

// onClose: called when the popup should close without logging out
// onConfirm: called when the user confirms the logout
export default function LogoutModal({ onClose, onConfirm }) {
  const [loggingOut, setLoggingOut] = useState(false);

  // Close with the Escape key (but not while logging out)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && !loggingOut) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loggingOut, onClose]);

  async function handleConfirm() {
    setLoggingOut(true);
    try {
      await onConfirm?.();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      {/* Dark background behind the popup */}
      <div className="modal-backdrop fade show" />

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        onClick={() => !loggingOut && onClose()} // click outside = close
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()} // click inside = stay open
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Logout</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                disabled={loggingOut}
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0">wanna go? HUH??</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                disabled={loggingOut}
                onClick={onClose}
              >
                Noo noo noo...
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={loggingOut}
                onClick={handleConfirm}
              >
                {loggingOut ? "i am going..." : "Yess Duhhh"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
