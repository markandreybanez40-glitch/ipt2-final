import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconShield,
  IconFileText,
  IconUsers,
  IconCheckCircle,
  IconClock,
  IconPhone,
  IconSparkles,
} from "@/components/ui/icons";
import { BARANGAY_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <IconShield className="h-6 w-6" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                BarangayLink
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {BARANGAY_NAME}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="default" size="sm" className="font-semibold">
                Sign In to Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <IconSparkles className="h-4 w-4" />
            Empowering Citizen Engagement & Rapid Incident Response
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-50">
            Clean, Transparent & Responsive{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Barangay Reporting
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Submit community concerns, track municipal field crew dispatches in real-time, and stay informed with official barangay advisories.
          </p>

          {/* Direct Role Access Cards */}
          <div className="mx-auto grid max-w-3xl gap-4 pt-6 sm:grid-cols-2 text-left">
            <Card className="hover:border-blue-400 transition-all hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <IconFileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Resident Portal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Submit reports on illegal dumping, street lights, floodings, and road damages with photo evidence.
                  </p>
                </div>
                <Link href="/resident/dashboard" className="block pt-2">
                  <Button className="w-full">
                    Enter Resident Portal →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-indigo-400 transition-all hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <IconShield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Barangay Admin Console
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Review incoming tickets, update statuses, dispatch repair crews, and broadcast bulletins.
                  </p>
                </div>
                <Link href="/admin/dashboard" className="block pt-2">
                  <Button variant="secondary" className="w-full">
                    Enter Admin Console →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="border-t border-slate-200/80 bg-white/50 px-6 py-16 dark:border-slate-800/80 dark:bg-slate-900/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              System Capabilities & Workflows
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Designed for clean collaboration between citizens and municipal staff
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-4">
                <IconCheckCircle className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Real-time Timelines
              </h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Step-by-step resolution tracking from submission to review, field dispatch, and verified completion.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-4">
                <IconUsers className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Resident Directory
              </h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Organized member records, verified contact information, and resident incident history.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 mb-4">
                <IconClock className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Analytics & Trends
              </h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automated category distribution, average turnaround duration, and solved rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        <p className="font-medium text-slate-700 dark:text-slate-300">
          {BARANGAY_NAME} • Incident & Community Management System
        </p>
        <p className="mt-1">
          Barangay Desk Hotline: (085) 815-1234 | CDRRMO Emergency: 911
        </p>
      </footer>
    </div>
  );
}
