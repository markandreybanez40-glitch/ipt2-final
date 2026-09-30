import React from "react";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-14 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-80 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
