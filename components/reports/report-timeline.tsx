import React from "react";
import { ReportTimelineEvent } from "@/types/report";
import { ReportStatusBadge } from "./report-status-badge";
import { IconCheckCircle } from "@/components/ui/icons";

export interface ReportTimelineProps {
  timeline?: ReportTimelineEvent[];
}

export function ReportTimeline({ timeline = [] }: ReportTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No timeline events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 after:absolute after:bottom-0 after:left-[11px] after:top-2 after:w-[2px] after:bg-slate-200 dark:after:bg-slate-800">
      <div className="space-y-6">
        {timeline.map((event, index) => {
          const isLatest = index === timeline.length - 1;

          return (
            <div key={event.id || index} className="relative flex items-start gap-4">
              {/* Dot Icon */}
              <div
                className={`absolute -left-[27px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 ${
                  isLatest
                    ? "border-blue-600 text-blue-600 ring-4 ring-blue-100 dark:border-blue-400 dark:text-blue-400 dark:ring-blue-950"
                    : "border-slate-300 text-slate-400 dark:border-slate-700"
                }`}
              >
                <IconCheckCircle className="h-3.5 w-3.5" />
              </div>

              <div className="flex-1 rounded-lg border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {event.title}
                  </h4>
                  <ReportStatusBadge status={event.status} />
                </div>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {event.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <span>Updated by: {event.updatedBy}</span>
                  <span>{event.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
