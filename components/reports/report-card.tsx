import React from "react";
import Link from "next/link";
import { Report } from "@/types/report";
import { Card, CardContent } from "@/components/ui/card";
import { ReportStatusBadge } from "./report-status-badge";
import { IconMapPin, IconCalendar, IconChevronRight } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";

export interface ReportCardProps {
  report: Report;
  baseHref?: string; // default "/resident/reports" or "/admin/reports"
}

export function ReportCard({
  report,
  baseHref = "/resident/reports",
}: ReportCardProps) {
  const detailUrl = `${baseHref}/${report.id}`;

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Optional thumbnail image */}
          {report.image ? (
            <div className="relative h-28 w-full sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
              <img
                src={report.image}
                alt={report.subject}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-24 w-full sm:w-28 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 dark:bg-slate-800">
              No Image
            </div>
          )}

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {report.id}
                </span>
                <Badge variant="outline" className="text-[11px]">
                  {report.category}
                </Badge>
              </div>
              <ReportStatusBadge status={report.status} />
            </div>

            <Link href={detailUrl} className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <h3 className="text-base font-semibold text-slate-900 line-clamp-1 dark:text-slate-100">
                {report.subject}
              </h3>
            </Link>

            <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-400">
              {report.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 truncate">
                <IconMapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{report.location}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  <IconCalendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{report.dateSubmitted}</span>
                </div>
                <Link
                  href={detailUrl}
                  className="flex items-center gap-0.5 text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400"
                >
                  Details
                  <IconChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
