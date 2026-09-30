import React from "react";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-44 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
      <div className="h-64 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
