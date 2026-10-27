"use client";
import { useEffect, useState } from "react";

// row: the table row that was clicked
// onClose: called when the popup should close
// onSaved: called after the cost was saved (the page reloads the report)
export default function AddCostModal({ row, onClose, onSaved }) {
  // Start with the current cost per unit when editing, empty when adding
  const [cost, setCost] = useState(row.cost_per_unit ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Close with the Escape key (but not while saving)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && !saving) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saving, onClose]);

  async function handleSubmit(e) {
    e.preventDefault(); // stops the page from reloading
    setError(null);

    // Quick check in the browser before calling the server
    const cleaned = String(cost).replace(/[$,\s]/g, "");
    if (cleaned === "" || isNaN(Number(cleaned))) {
      setError("Enter the cost as a number, for example 4.50");
      return;
    }
    if (Number(cleaned) < 0) {
      setError("Cost can't be negative");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: row.sku,
          product_name: row.product_name,
          cost_per_unit: cleaned,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save the cost");
        return;
      }

      await onSaved?.(); // the page reloads the report, then closes the popup
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
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
        onClick={() => !saving && onClose()} // click outside = close
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()} // click inside = stay open
        >
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {row.has_cost ? "Edit cost" : "Add cost"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  disabled={saving}
                  onClick={onClose}
                />
              </div>

              <div className="modal-body">
                <p className="mb-1 fw-medium">{row.sku}</p>
                <p className="text-muted mb-3">{row.product_name}</p>

                <label htmlFor="cost-per-unit" className="form-label">
                  Cost per unit ($)
                </label>
                <input
                  id="cost-per-unit"
                  type="text"
                  inputMode="decimal"
                  className="form-control"
                  placeholder="e.g. 4.50"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  autoFocus
                  disabled={saving}
                />
                <div className="form-text">
                  What one unit costs you. It is used for every report with this SKU.
                </div>

                {error && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {error}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  disabled={saving}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}