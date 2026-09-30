import React from "react";
import Link from "next/link";
import { Report } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReportCard } from "@/components/reports/report-card";
import { Button } from "@/components/ui/button";
import { IconChevronRight } from "@/components/ui/icons";

export interface RecentReportsProps {
  reports: Report[];
  viewAllHref?: string;
  baseHref?: string;
  limit?: number;
}

export function RecentReports({
  reports,
  viewAllHref = "/resident/reports",
  baseHref = "/resident/reports",
  limit = 3,
}: RecentReportsProps) {
  const displayedReports = reports.slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg">Recent Incident Reports</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Latest community concerns submitted and their current statuses
          </p>
        </div>
        <Link href={viewAllHref}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-blue-600 dark:text-blue-400">
            View All
            <IconChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedReports.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No incident reports found.
          </p>
        ) : (
          displayedReports.map((report) => (
            <ReportCard key={report.id} report={report} baseHref={baseHref} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
