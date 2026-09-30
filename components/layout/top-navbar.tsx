"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { IconBell, IconMenu, IconShield, IconLogOut } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { BARANGAY_NAME } from "@/lib/constants";
import { logoutAction } from "@/lib/actions/auth";

export interface TopNavbarProps {
  user?: User;
  onOpenMobileSidebar?: () => void;
  unreadNotificationsCount?: number;
}

export function TopNavbar({
  user,
  onOpenMobileSidebar,
  unreadNotificationsCount = 2,
}: TopNavbarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isResident = user?.role === "resident";
  const notifHref = isResident ? "/resident/notifications" : "/admin/notifications";
  const profileHref = isResident ? "/resident/profile" : "/admin/settings";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileSidebar}
            className="md:hidden"
            aria-label="Open sidebar"
          >
            <IconMenu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <IconShield className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-none">
              BarangayLink
            </span>
            <span className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
              {BARANGAY_NAME}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Icon with Badge */}
        <Link href={notifHref}>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            aria-label="Notifications"
          >
            <IconBell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </Button>
        </Link>

        {/* User Mini Profile */}
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <Link href={profileHref} className="flex items-center gap-2.5">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user.name}
                </p>
                <p className="text-[10px] uppercase font-medium text-slate-400">
                  {user.role}
                </p>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
              title="Log Out"
              aria-label="Log Out"
            >
              <IconLogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
