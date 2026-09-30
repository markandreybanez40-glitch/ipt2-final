import React from "react";
import { Report } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  IconFileText,
  IconClock,
  IconCheckCircle,
  IconRefreshCw,
} from "@/components/ui/icons";

export interface AdminStatisticsProps {
  reports: Report[];
}

export function AdminStatistics({ reports }: AdminStatisticsProps) {
  const total = reports.length;
  const submitted = reports.filter((r) => r.status === "submitted").length;
  const underReview = reports.filter((r) => r.status === "under-review").length;
  const inProgress = reports.filter((r) => r.status === "in-progress").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const rejected = reports.filter((r) => r.status === "rejected").length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category breakdown
  const categoryCounts = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={total}
          icon={IconFileText}
          variant="blue"
          description="Total community tickets filed"
        />
        <StatCard
          title="Action In Progress"
          value={inProgress}
          icon={IconRefreshCw}
          variant="purple"
          description="Active crew operations"
        />
        <StatCard
          title="Pending / Review"
          value={submitted + underReview}
          icon={IconClock}
          variant="amber"
          description="Awaiting evaluation"
        />
        <StatCard
          title="Resolved Rate"
          value={`${resolutionRate}%`}
          icon={IconCheckCircle}
          variant="emerald"
          trend={{ value: `${resolved} cases solved`, isPositive: true }}
        />
      </div>

      {/* Category breakdown visual overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Reports Distribution by Category</CardTitle>
            <span className="text-xs text-slate-500">{total} Total Cases</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {cat}
                    </span>
                    <span className="text-slate-500">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
