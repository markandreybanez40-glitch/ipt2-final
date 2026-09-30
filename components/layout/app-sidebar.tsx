"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface AppSidebarProps {
  items: NavItem[];
  headerTitle?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function AppSidebar({
  items,
  headerTitle,
  footer,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900",
        className
      )}
    >
      <div className="space-y-4">
        {headerTitle && (
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {headerTitle}
          </div>
        )}

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/resident/dashboard" &&
                item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      isActive
                        ? "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {footer && <div className="pt-4 border-t border-slate-100 dark:border-slate-800">{footer}</div>}
    </aside>
  );
}
