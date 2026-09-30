import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconPlus, IconSparkles } from "@/components/ui/icons";

export interface WelcomeBannerProps {
  userName: string;
  role?: "resident" | "admin";
  barangayName?: string;
}

export function WelcomeBanner({
  userName,
  role = "resident",
  barangayName = "Barangay Poblacion, Butuan City",
}: WelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 text-white shadow-lg sm:p-8">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-10 right-20 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-md">
            <IconSparkles className="h-3.5 w-3.5" />
            <span>Community Portal • {barangayName}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {userName}!
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            {role === "resident"
              ? "Report community issues, track ongoing barangay actions, and receive official notices in real-time."
              : "Monitor community incident reports, assign response teams, manage residents, and broadcast updates."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {role === "resident" ? (
            <Link href="/resident/reports/new">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-md"
              >
                <IconPlus className="h-5 w-5" />
                Submit New Report
              </Button>
            </Link>
          ) : (
            <Link href="/admin/announcements">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-md"
              >
                <IconPlus className="h-5 w-5" />
                Post Announcement
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
