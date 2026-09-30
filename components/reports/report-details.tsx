import React from "react";
import { Report } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportStatusBadge } from "./report-status-badge";
import { ReportTimeline } from "./report-timeline";
import { Badge } from "@/components/ui/badge";
import { IconMapPin, IconCalendar, IconUser } from "@/components/ui/icons";

export interface ReportDetailsProps {
  report: Report;
  actionSlot?: React.ReactNode;
}

export function ReportDetails({ report, actionSlot }: ReportDetailsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Details Column (2 cols) */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {report.id}
                </span>
                <Badge variant="outline">{report.category}</Badge>
                {report.priority && (
                  <Badge
                    variant={
                      report.priority === "urgent" || report.priority === "high"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {report.priority.toUpperCase()} PRIORITY
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-2 text-xl">{report.subject}</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <ReportStatusBadge status={report.status} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Incident Description
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {report.description}
              </p>
            </div>

            {/* Photo Attachment if available */}
            {report.image && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Photographic Evidence
                </h4>
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <img
                    src={report.image}
                    alt={report.subject}
                    className="max-h-96 w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Admin Notes if available */}
            {report.adminNotes && (
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                  Barangay Desk Resolution Notes
                </h4>
                <p className="mt-1 text-sm text-blue-950 dark:text-blue-200">
                  {report.adminNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action slot (e.g. Admin Status Update button / form) */}
        {actionSlot && <div>{actionSlot}</div>}
      </div>

      {/* Sidebar Metadata & Timeline Column (1 col) */}
      <div className="space-y-6">
        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Incident Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <IconMapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs text-slate-400">Location</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {report.location}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconCalendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs text-slate-400">Date Submitted</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {report.dateSubmitted}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconUser className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs text-slate-400">Reported By</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {report.residentName}
                </span>
                <span className="block text-xs text-slate-400">
                  ID: {report.residentId}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTimeline timeline={report.timeline} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
