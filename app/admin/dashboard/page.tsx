import React from "react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { getReports } from "@/lib/services/reports";
import { getAdminAnalytics } from "@/lib/services/analytics";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { RecentReports } from "@/components/dashboard/recent-reports";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  IconFileText,
  IconUsers,
  IconMegaphone,
  IconChevronRight,
  IconClock,
  IconCheckCircle,
  IconRefreshCw,
} from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import { Report } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const profile = await getCurrentProfile();
  const userName = profile?.full_name || "Hon. Maria Santos";
  const barangayName = profile?.barangay || "Barangay Poblacion, Butuan City";

  // Fetch live analytics and reports from Supabase
  const [analytics, dbReports] = await Promise.all([
    getAdminAnalytics(),
    getReports({ limit: 4 }),
  ]);

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
      {/* Welcome Banner */}
      <WelcomeBanner
        userName={userName}
        role="admin"
        barangayName={barangayName}
      />

      {/* Real Supabase Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={analytics.totalReports}
          icon={IconFileText}
          variant="blue"
          description="Total community tickets filed"
        />
        <StatCard
          title="Action In Progress"
          value={analytics.inProgressCount}
          icon={IconRefreshCw}
          variant="purple"
          description="Active crew operations"
        />
        <StatCard
          title="Pending / Review"
          value={analytics.pendingCount}
          icon={IconClock}
          variant="amber"
          description="Awaiting evaluation"
        />
        <StatCard
          title="Resolved Rate"
          value={`${analytics.resolutionRate}%`}
          icon={IconCheckCircle}
          variant="emerald"
          trend={{
            value: `${analytics.resolvedCount} cases solved`,
            isPositive: true,
          }}
        />
      </div>

      {/* Main Row: Recent Reports (admin view) + Quick Administrative Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reports (2 cols) */}
        <div className="lg:col-span-2">
          <RecentReports
            reports={reports}
            viewAllHref="/admin/reports"
            baseHref="/admin/reports"
            limit={4}
          />
        </div>

        {/* Quick Operations (1 col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Barangay Admin Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/reports">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <IconFileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Dispatch & Incident Queue
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {analytics.totalReports} live reports in system
                      </p>
                    </div>
                  </div>
                  <IconChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/admin/residents">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <IconUsers className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Registered Residents
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {analytics.registeredResidentsCount} verified residents
                      </p>
                    </div>
                  </div>
                  <IconChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/admin/announcements">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                      <IconMegaphone className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Public Bulletins & Broadcasts
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Manage community notices
                      </p>
                    </div>
                  </div>
                  <IconChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
