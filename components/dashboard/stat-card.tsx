import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: "default" | "blue" | "emerald" | "amber" | "purple" | "rose";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const iconVariants = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {value}
            </div>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl p-2.5",
              iconVariants[variant]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {(description || trend) && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {trend && (
              <span
                className={cn(
                  "font-medium",
                  trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                )}
              >
                {trend.value}
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
