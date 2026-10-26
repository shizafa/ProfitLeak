"use client";
import { useEffect, useState } from "react";
import PageTitle from "@/components/dashboard/overview/PageTitle";
import SummaryCards from "@/components/dashboard/overview/SummryCards";
import Table from "@/components/dashboard/overview/Table";
import OtherChargesTable from "@/components/dashboard/overview/OtherChargesTable";

export default function DashboardPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the newest saved report when the page opens
  useEffect(() => {
    fetch("/api/reports/latest")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // { empty: true } means the user has not uploaded a report yet
        if (data && !data.empty) setReport(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        />
      </div>

      <div className="row">
        <OtherChargesTable otherCharges={report?.otherCharges} />
      </div>
    </>
  );
}