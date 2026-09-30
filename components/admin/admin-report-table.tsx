"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Report, ReportStatus } from "@/types/report";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AdminReportDialog } from "./admin-report-dialog";
import { IconEye, IconEdit } from "@/components/ui/icons";
import { REPORT_CATEGORIES, REPORT_STATUSES, STATUS_LABELS } from "@/lib/constants";

export interface AdminReportTableProps {
  reports: Report[];
  onUpdateStatus?: (id: string, status: ReportStatus, notes: string) => void;
}

export function AdminReportTable({
  reports,
  onUpdateStatus,
}: AdminReportTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.reportNumber && report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || report.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenDialog = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleSaveDialog = (id: string, status: ReportStatus, notes: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(id, status, notes);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Input
            placeholder="Search by ID, subject, resident, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                ...REPORT_STATUSES.map((s) => ({
                  value: s,
                  label: STATUS_LABELS[s],
                })),
              ]}
            />
          </div>

          <div className="w-40">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: "all", label: "All Categories" },
                ...REPORT_CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Subject & Category</th>
              <th className="px-6 py-3.5">Resident</th>
              <th className="px-6 py-3.5">Location</th>
              <th className="px-6 py-3.5">Submitted</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                  No matching incident reports found.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
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
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {report.residentName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {report.residentId}
                    </div>
                  </td>
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => handleOpenDialog(report)}
                      >
                        <IconEdit className="h-3.5 w-3.5" />
                        Status
                      </Button>
                      <Link href={`/admin/reports/${report.id}`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <IconEye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Status Dialog */}
      <AdminReportDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        report={selectedReport}
        onSave={handleSaveDialog}
      />
    </div>
  );
}
