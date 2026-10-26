"use client";
import { useState } from "react";
import PageTitle from "@/components/dashboard/overview/PageTitle";
import SummaryCards from "@/components/dashboard/overview/SummryCards";
import Table from "@/components/dashboard/overview/Table";

export default function Overview() {
  const [report, setReport] = useState(null);
  return (
    <>
      <PageTitle onReportResult={setReport} />
      {report && <SummaryCards totals={report.totals} />}
      {report && <Table rows={report.results} />}
    </>
  );
}