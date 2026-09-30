import React from "react";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-44 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
