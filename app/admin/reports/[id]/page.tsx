import React from "react";
import Link from "next/link";
import { getReportById } from "@/lib/services/reports";
import { PageHeader } from "@/components/layout/page-header";
import { ReportDetails } from "@/components/reports/report-details";
import { AdminReportDetailPageClient } from "./admin-report-detail-client";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import { Report } from "@/types/report";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminReportDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const reportId = resolvedParams.id;

  const dbReport = await getReportById(reportId);

  if (!dbReport) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Report Not Found"
          breadcrumbs={[
            { label: "Admin Dashboard", href: "/admin/dashboard" },
            { label: "Reports", href: "/admin/reports" },
            { label: "Not Found" },
          ]}
        />
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No incident report matching ID &quot;{reportId}&quot; was found.
          </p>
          <Link href="/admin/reports" className="mt-4 inline-block">
            <Button variant="outline">
              <IconChevronLeft className="h-4 w-4 mr-1" />
              Back to Reports Management
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const report: Report = {
    id: dbReport.id,
    reportNumber: dbReport.report_number,
    residentId: dbReport.resident_id,
    residentName: dbReport.resident?.full_name || "Resident",
    category: dbReport.category,
    subject: dbReport.subject,
    description: dbReport.description,
    location: dbReport.location,
    dateSubmitted: formatDate(dbReport.date_time || dbReport.created_at),
    status: dbReport.status as any,
    image: dbReport.photo_url || undefined,
    adminNotes: dbReport.admin_remarks || undefined,
    timeline: (dbReport.history || []).map((h, i) => ({
      id: h.id || `TL-${i}`,
      status: h.status as any,
      title: `Status: ${h.status.replace("_", " ").toUpperCase()}`,
      description: h.remarks || "Status change recorded.",
      timestamp: formatDate(h.created_at),
      updatedBy: "Barangay Operations",
    })),
  };

  return <AdminReportDetailPageClient initialReport={report} />;
}
