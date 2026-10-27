"use client";
import { useEffect, useState } from "react";
import PageTitle from "@/components/dashboard/overview/PageTitle";
import SummaryCards from "@/components/dashboard/overview/SummryCards";
import Table from "@/components/dashboard/overview/Table";
import OtherChargesTable from "@/components/dashboard/overview/OtherChargesTable";
import AddCostModal from "@/components/dashboard/overview/AddCostModal";

export default function DashboardPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null); // the row whose cost is being added/edited

  // Fetch the newest saved report and put it on the page
  async function loadReport() {
    try {
      const res = await fetch("/api/reports/latest");
      const data = res.ok ? await res.json() : null;

      // { empty: true } means the user has not uploaded a report yet
      if (data && !data.empty) setReport(data);
    } catch {}
  }

  // Load the report when the page opens
  useEffect(() => {
    loadReport().finally(() => setLoading(false));
  }, []);

  // Called by the popup after the cost was saved
  async function handleCostSaved() {
    await loadReport(); // profit, margin and badges are recalculated
    setSelectedRow(null); // close the popup
  }

  return (
    <>
      <PageTitle title="Dashboard" onReportResult={setReport} />

      {report?.file_name && (
        <p className="text-muted mb-3">
          Showing report: <strong>{report.file_name}</strong>
          {report.period_start && report.period_end
            ? ` (${report.period_start} to ${report.period_end})`
            : ""}
        </p>
      )}

      <SummaryCards totals={report?.totals} />

      <div className="row">
        <Table
          results={report?.results}
          emptyText={loading ? "Loading..." : undefined}
          onAddCost={setSelectedRow}
        />
      </div>

      <div className="row">
        <OtherChargesTable otherCharges={report?.otherCharges} />
      </div>

      {selectedRow && (
        <AddCostModal
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onSaved={handleCostSaved}
        />
      )}
    </>
  );
}