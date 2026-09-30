import React from "react";
import Link from "next/link";
import { Report } from "@/types/report";
import { ReportStatusBadge } from "./report-status-badge";
import { IconEye } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export interface ReportTableProps {
  reports: Report[];
  baseHref?: string;
  showResident?: boolean;
}

export function ReportTable({
  reports,
  baseHref = "/resident/reports",
  showResident = false,
}: ReportTableProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
        <p className="text-base font-medium text-slate-700 dark:text-slate-300">
          No reports found
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Try adjusting your search filters or submit a new incident report.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
          <tr>
            <th className="px-6 py-3.5">Report ID</th>
            <th className="px-6 py-3.5">Subject & Category</th>
            {showResident && <th className="px-6 py-3.5">Resident</th>}
            <th className="px-6 py-3.5">Location</th>
            <th className="px-6 py-3.5">Date</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {reports.map((report) => (
            <tr
              key={report.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                {report.id}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                  {report.subject}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {report.category}
                </div>
              </td>
              {showResident && (
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                  {report.residentName}
                </td>
              )}
              <td className="px-6 py-4 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">
                {report.location}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                {report.dateSubmitted}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <ReportStatusBadge status={report.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <Link href={`${baseHref}/${report.id}`}>
                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                    <IconEye className="h-3.5 w-3.5" />
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
