"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconBell, IconCheck, IconFileText, IconAlertTriangle } from "@/components/ui/icons";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/lib/actions/notifications";

interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "normal" | "urgent";
  linkUrl?: string;
}

const initialAdminNotifs: AdminNotificationItem[] = [
  {
    id: "AN-1",
    title: "New Urgent Report Submitted",
    message: "Resident Antonio Luna submitted an urgent report regarding Flooding in Lower Purok 2.",
    time: "20 mins ago",
    read: false,
    priority: "urgent",
    linkUrl: "/admin/reports",
  },
  {
    id: "AN-2",
    title: "Field Crew Dispatch Completed",
    message: "Electrician crew reported street light fixtures replaced along Rosal St.",
    time: "2 hours ago",
    read: false,
    priority: "normal",
    linkUrl: "/admin/reports",
  },
  {
    id: "AN-3",
    title: "New Resident Account Registered",
    message: "Resident Jose Rizal Mercado completed address verification.",
    time: "1 day ago",
    read: true,
    priority: "normal",
    linkUrl: "/admin/residents",
  },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(initialAdminNotifs);

  const markAllAsRead = async () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    await markAllNotificationsReadAction();
  };

  const markAsRead = async (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationReadAction(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Admin Notifications"
        description="Incoming resident tickets, municipal alerts, and automated system triggers"
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin/dashboard" },
          { label: "Notifications" },
        ]}
        action={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-1.5 cursor-pointer">
              <IconCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`transition-all ${
              notif.read
                ? "bg-white/60 dark:bg-slate-900/60 opacity-80"
                : "bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/80 shadow-xs"
            }`}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  {notif.priority === "urgent" ? (
                    <IconAlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <IconFileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{notif.time}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    {notif.linkUrl && (
                      <Link
                        href={notif.linkUrl}
                        onClick={() => markAsRead(notif.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Open Ticket →
                      </Link>
                    )}
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
