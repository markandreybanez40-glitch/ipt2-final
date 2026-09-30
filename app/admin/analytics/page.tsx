import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  IconBarChart3,
  IconClock,
  IconTrendingUp,
  IconFileText,
} from "@/components/ui/icons";
import { getAdminAnalytics, getCategoryBreakdown } from "@/lib/services/analytics";

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const stats = await getAdminAnalytics();
  const categoryStats = await getCategoryBreakdown();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Operational Insights"
        description="Comprehensive metrics on incident resolution efficiency, response times, and community trends"
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin/dashboard" },
          { label: "Analytics" },
        ]}
      />

      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Overall Resolution Rate"
          value={`${stats.resolutionRate}%`}
          icon={IconTrendingUp}
          variant="emerald"
          description="Solved vs Total Tickets"
        />
        <StatCard
          title="Avg. Resolution Time"
          value="1.8 Days"
          icon={IconClock}
          variant="blue"
          description="From submission to solved"
        />
        <StatCard
          title="Active Operations"
          value={stats.inProgressCount}
          icon={IconBarChart3}
          variant="purple"
          description="Field crews deployed"
        />
        <StatCard
          title="Pending Evaluation"
          value={stats.pendingCount}
          icon={IconFileText}
          variant="amber"
          description="In review queue"
        />
      </div>

      {/* Category Performance Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Incident Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryStats.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              No incident data recorded yet to compute category metrics.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Total Reported</th>
                    <th className="px-4 py-3">Resolved</th>
                    <th className="px-4 py-3">Resolution %</th>
                    <th className="px-4 py-3">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categoryStats.map((item) => (
                    <tr key={item.category}>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {item.category}
                      </td>
                      <td className="px-4 py-3">{item.count}</td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        {item.resolved}
                      </td>
                      <td className="px-4 py-3 font-semibold">{item.rate}%</td>
                      <td className="px-4 py-3 w-48">
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
