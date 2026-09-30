import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-slate-200/80 bg-white/70 px-6 py-5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                {b.href ? (
                  <a
                    href={b.href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {b.label}
                  </a>
                ) : (
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {b.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
