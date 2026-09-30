import React from "react";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { getResidentReports } from "@/lib/services/reports";
import { getPublishedAnnouncements } from "@/lib/services/announcements";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentReports } from "@/components/dashboard/recent-reports";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconFileText,
  IconClock,
  IconCheckCircle,
  IconMegaphone,
  IconAlertTriangle,
} from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import { Report } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function ResidentDashboard() {
  const profile = await getCurrentProfile();
  const profileId = profile?.id || "00000000-0000-0000-0000-000000000002";
  const userName = profile?.full_name || "Juan Dela Cruz";
  const barangayName = profile?.barangay || "Barangay Poblacion, Butuan City";

  // Fetch real reports from Supabase
  const dbReports = await getResidentReports(profileId);

  // Fetch real published announcements from Supabase
  const announcements = await getPublishedAnnouncements(3);

  // Map to UI Report models
  const reports: Report[] = dbReports.map((r) => ({
    id: r.id,
    reportNumber: r.report_number,
    residentId: r.resident_id,
    residentName: r.resident?.full_name || userName,
    category: r.category,
    subject: r.subject,
    description: r.description,
    location: r.location,
    dateSubmitted: formatDate(r.date_time || r.created_at),
    status: r.status as any,
    image: r.photo_url || undefined,
    adminNotes: r.admin_remarks || undefined,
  }));

  const total = reports.length;
  const inProgress = reports.filter((r) => r.status === "in_progress" || r.status === "in-progress").length;
  const submitted = reports.filter((r) => r.status === "submitted").length;
  const underReview = reports.filter((r) => r.status === "under_review" || r.status === "under-review").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner
        userName={userName}
        role="resident"
        barangayName={barangayName}
      />

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={total}
          icon={IconFileText}
          variant="blue"
          description="Total reports filed by you"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={IconClock}
          variant="purple"
          description="Crew currently assigned"
        />
        <StatCard
          title="Under Review"
          value={submitted + underReview}
          icon={IconAlertTriangle}
          variant="amber"
          description="Awaiting evaluation"
        />
        <StatCard
          title="Resolved Cases"
          value={resolved}
          icon={IconCheckCircle}
          variant="emerald"
          description="Successfully completed"
        />
      </div>

      {/* Main Grid: Recent Reports + Announcements */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reports (2 cols) */}
        <div className="lg:col-span-2">
          <RecentReports
            reports={reports}
            viewAllHref="/resident/reports"
            baseHref="/resident/reports"
            limit={3}
          />
        </div>

        {/* Barangay Announcements (1 col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <IconMegaphone className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Barangay Bulletins</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No active announcements posted.
                </p>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <Badge variant="secondary" className="text-[10px]">
                        {announcement.title.includes("Clean-Up")
                          ? "Community Event"
                          : announcement.title.includes("Power")
                          ? "Public Advisory"
                          : "Health & Services"}
                      </Badge>
                      <span className="text-slate-400">
                        {formatDate(announcement.published_at || announcement.created_at)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {announcement.title}
                    </h4>
                    <p className="mt-1 text-slate-600 line-clamp-2 dark:text-slate-300">
                      {announcement.content}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
