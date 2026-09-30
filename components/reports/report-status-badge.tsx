import React from "react";
import { ReportStatus } from "@/types/report";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface ReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
  showDot?: boolean;
}

export function ReportStatusBadge({
  status,
  className,
  showDot = true,
}: ReportStatusBadgeProps) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.submitted;
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
        style.bg,
        style.border,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", style.dot)} />
      )}
      {label}
    </span>
  );
}
