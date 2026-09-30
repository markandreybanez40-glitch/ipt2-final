import { createClient } from "@/lib/supabase/server";

export interface AdminAnalyticsStats {
  totalReports: number;
  submittedCount: number;
  underReviewCount: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  rejectedCount: number;
  registeredResidentsCount: number;
  resolutionRate: number;
}

export interface CategoryStatItem {
  category: string;
  count: number;
  resolved: number;
  rate: number;
}

export async function getAdminAnalytics(): Promise<AdminAnalyticsStats> {
  try {
    const supabase = await createClient();

    // Fetch reports
    const { data: reports, error: reportsError } = await supabase
      .from("reports")
      .select("status");

    // Fetch registered residents count
    const { count: residentsCount, error: resError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "resident");

    if (reportsError || !reports) {
      return {
        totalReports: 0,
        submittedCount: 0,
        underReviewCount: 0,
        pendingCount: 0,
        inProgressCount: 0,
        resolvedCount: 0,
        rejectedCount: 0,
        registeredResidentsCount: residentsCount || 0,
        resolutionRate: 0,
      };
    }

    const total = reports.length;
    const submitted = reports.filter((r) => r.status === "submitted").length;
    const underReview = reports.filter((r) => r.status === "under_review").length;
    const inProgress = reports.filter((r) => r.status === "in_progress").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const rejected = reports.filter((r) => r.status === "rejected").length;

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      totalReports: total,
      submittedCount: submitted,
      underReviewCount: underReview,
      pendingCount: submitted + underReview,
      inProgressCount: inProgress,
      resolvedCount: resolved,
      rejectedCount: rejected,
      registeredResidentsCount: residentsCount || 0,
      resolutionRate,
    };
  } catch {
    return {
      totalReports: 0,
      submittedCount: 0,
      underReviewCount: 0,
      pendingCount: 0,
      inProgressCount: 0,
      resolvedCount: 0,
      rejectedCount: 0,
      registeredResidentsCount: 0,
      resolutionRate: 0,
    };
  }
}

export async function getCategoryBreakdown(): Promise<CategoryStatItem[]> {
  try {
    const supabase = await createClient();

    const { data: reports, error } = await supabase
      .from("reports")
      .select("category, status");

    if (error || !reports) return [];

    const grouped = reports.reduce<
      Record<string, { count: number; resolved: number }>
    >((acc, r) => {
      if (!acc[r.category]) {
        acc[r.category] = { count: 0, resolved: 0 };
      }
      acc[r.category].count += 1;
      if (r.status === "resolved") {
        acc[r.category].resolved += 1;
      }
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, data]) => ({
      category,
      count: data.count,
      resolved: data.resolved,
      rate: data.count > 0 ? Math.round((data.resolved / data.count) * 100) : 0,
    }));
  } catch {
    return [];
  }
}
