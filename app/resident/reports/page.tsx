import React from "react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { getResidentReports } from "@/lib/services/reports";
import { PageHeader } from "@/components/layout/page-header";
import { ReportTable } from "@/components/reports/report-table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import { Report } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function ResidentReportsPage() {
  const profile = await getCurrentProfile();
  const profileId = profile?.id || "00000000-0000-0000-0000-000000000002";

  const dbReports = await getResidentReports(profileId);

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
        title="My Incident Reports"
        description="Track the status and progress updates of reports you have submitted to the barangay"
        breadcrumbs={[
          { label: "Dashboard", href: "/resident/dashboard" },
          { label: "My Reports" },
        ]}
        action={
          <Link href="/resident/reports/new">
            <Button className="gap-2">
              <IconPlus className="h-4 w-4" />
              New Report
            </Button>
          </Link>
        }
      />

      {/* Report Table with Supabase data */}
      <ReportTable reports={reports} baseHref="/resident/reports" />
    </div>
  );
}
