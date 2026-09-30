"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBell,
  IconCheck,
  IconMegaphone,
  IconClock,
  IconShield,
} from "@/components/ui/icons";
import { mockNotifications } from "@/lib/mock-data";
import { AppNotification } from "@/types/notification";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/lib/actions/notifications";

export default function ResidentNotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsReadAction();
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationReadAction(id);
  };

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "status_update":
        return <IconClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "announcement":
        return <IconMegaphone className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case "system":
        return <IconShield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <IconBell className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Notifications & Alerts"
        description="Stay updated with changes on your reports and official barangay bulletins"
        breadcrumbs={[
          { label: "Dashboard", href: "/resident/dashboard" },
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
        {notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500">
            No notifications at this time.
          </div>
        ) : (
          notifications.map((notif) => (
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
                    {getIcon(notif.type)}
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
                      <span className="text-xs text-slate-400">{notif.date}</span>
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
                          View Details →
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
          ))
        )}
      </div>
    </div>
  );
}
