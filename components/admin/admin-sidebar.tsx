"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppSidebar, NavItem } from "@/components/layout/app-sidebar";
import {
  IconHome,
  IconFileText,
  IconUsers,
  IconMegaphone,
  IconBarChart3,
  IconBell,
  IconSettings,
  IconLogOut,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";

export function AdminSidebar() {
  const router = useRouter();

  const handleSignOut = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  const adminNavItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: IconHome,
    },
    {
      label: "Incident Reports",
      href: "/admin/reports",
      icon: IconFileText,
    },
    {
      label: "Residents Directory",
      href: "/admin/residents",
      icon: IconUsers,
    },
    {
      label: "Announcements",
      href: "/admin/announcements",
      icon: IconMegaphone,
    },
    {
      label: "Analytics & Trends",
      href: "/admin/analytics",
      icon: IconBarChart3,
    },
    {
      label: "Notifications",
      href: "/admin/notifications",
      icon: IconBell,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: IconSettings,
    },
  ];

  const sidebarFooter = (
    <div className="space-y-3">
      <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Admin Operations
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Role: Barangay Administrator
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="w-full justify-start text-slate-500 hover:text-rose-600 cursor-pointer"
      >
        <IconLogOut className="h-4 w-4 mr-2" />
        Admin Sign Out
      </Button>
    </div>
  );

  return (
    <AppSidebar
      items={adminNavItems}
      headerTitle="Admin Command"
      footer={sidebarFooter}
    />
  );
}
