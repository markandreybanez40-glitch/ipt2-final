"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppSidebar, NavItem } from "@/components/layout/app-sidebar";
import {
  IconHome,
  IconFileText,
  IconPlus,
  IconBell,
  IconUser,
  IconLogOut,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";

export function ResidentSidebar() {
  const router = useRouter();

  const handleSignOut = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  const residentNavItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/resident/dashboard",
      icon: IconHome,
    },
    {
      label: "My Reports",
      href: "/resident/reports",
      icon: IconFileText,
    },
    {
      label: "New Report",
      href: "/resident/reports/new",
      icon: IconPlus,
    },
    {
      label: "Notifications",
      href: "/resident/notifications",
      icon: IconBell,
      badge: 2,
    },
    {
      label: "My Profile",
      href: "/resident/profile",
      icon: IconUser,
    },
  ];

  const sidebarFooter = (
    <div className="space-y-3">
      <div className="rounded-xl bg-blue-50/80 p-3 dark:bg-blue-950/40">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
          Emergency Hotlines
        </p>
        <p className="text-[11px] text-blue-700/80 dark:text-blue-400 mt-0.5">
          Barangay Desk: (085) 815-1234
        </p>
        <p className="text-[11px] text-blue-700/80 dark:text-blue-400">
          Police / CDRRMO: 911
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="w-full justify-start text-slate-500 hover:text-rose-600 cursor-pointer"
      >
        <IconLogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );

  return (
    <AppSidebar
      items={residentNavItems}
      headerTitle="Resident Portal"
      footer={sidebarFooter}
    />
  );
}
