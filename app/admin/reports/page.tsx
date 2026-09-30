import React from "react";
import { getReports } from "@/lib/services/reports";
import { PageHeader } from "@/components/layout/page-header";
import { AdminReportTable } from "@/components/admin/admin-report-table";
import { formatDate } from "@/lib/utils";
import { Report } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const dbReports = await getReports();

  const reports: Report[] = dbReports.map((r) => ({
    id: r.id,
    reportNumber: r.report_number,
    residentId: r.resident_id,
    residentName: r.resident?.full_name || "Resident",
    category: r.category,
    subject: r.subject,
    description: r.description,
    location: r.location,
    dateSubmitted: formatDate(r.date_time || r.created_at),
    status: r.status as any,
    image: r.photo_url || undefined,
    adminNotes: r.admin_remarks || undefined,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Reports Management"
        description="Review community tickets, assign municipal crews, and update resolution statuses"
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin/dashboard" },
          { label: "Incident Reports" },
        ]}
      />

      <AdminReportTable reports={reports} />
    </div>
  );
}
