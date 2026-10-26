"use client";
import { useEffect, useRef, useState } from "react";

export default function PageTitle({ title, onReportResult }) {
  const [fullName, setFullName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "danger", text }
  const reportInput = useRef(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.full_name) setFullName(data.full_name);
      })
      .catch(() => {});
  }, []);

  async function handleReportChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the same file be picked again
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file); // must match formData.get("file") in the route

      // Don't set Content-Type yourself; the browser adds the boundary
      const res = await fetch("/api/reports/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "danger", text: data.error || "Upload failed" });
        return;
      }

      onReportResult?.(data); // { results, missingCosts, totals }
      setMessage({
        type: "success",
        text:
          data.missingCosts?.length > 0
            ? `Report processed. ${data.missingCosts.length} SKU(s) are missing costs.`
            : "Report processed.",
      });
    } catch {
      setMessage({ type: "danger", text: "Something went wrong. Try again." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="h-100">
      <div className="row mb-3 pb-1">
        <div className="col-12">
          <div className="d-flex align-items-lg-center flex-lg-row flex-column">
            <div className="flex-grow-1">
              <h4 className="fs-16 mb-1">Good Morning, {fullName || "Loading..."}!</h4>
              <p className="text-muted mb-0">
                Here's what's happening with your store this week.
              </p>
            </div>

            <div className="mt-3 mt-lg-0 d-flex gap-2">
              <input
                ref={reportInput}
                type="file"
                accept=".csv"
                hidden
                onChange={handleReportChange}
              />
              <button
                type="button"
                className="btn btn-soft-success material-shadow-none"
                disabled={uploading}
                onClick={() => reportInput.current?.click()}
              >
                <i className="ri-add-circle-line align-middle me-1" />
                {uploading ? "Uploading..." : "Upload Report"}
              </button>

              <button
                type="button"
                className="btn btn-soft-success material-shadow-none"
              >
                <i className="ri-add-circle-line align-middle me-1" /> Upload Cost CSV
              </button>
            </div>
          </div>

          {message && (
            <div className={`alert alert-${message.type} mt-3 mb-0`} role="alert">
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}