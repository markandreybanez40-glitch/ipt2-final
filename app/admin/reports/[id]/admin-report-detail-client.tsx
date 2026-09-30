"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ReportDetails } from "@/components/reports/report-details";
import { AdminReportDialog } from "@/components/admin/admin-report-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconChevronLeft, IconEdit } from "@/components/ui/icons";
import { Report, ReportStatus } from "@/types/report";

export function AdminReportDetailPageClient({
  initialReport,
}: {
  initialReport: Report;
}) {
  const router = useRouter();
  const [report, setReport] = useState<Report>(initialReport);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveStatus = (id: string, status: ReportStatus, notes: string) => {
    setReport((prev) => ({
      ...prev,
      status,
      adminNotes: notes,
      timeline: [
        ...(prev.timeline || []),
        {
          id: `TL-${Date.now()}`,
          status,
          title: `Status: ${status.replace("_", " ").toUpperCase()}`,
          description: notes || "Status updated by administrator.",
          timestamp: "Just now",
          updatedBy: "Hon. Maria Santos (Admin)",
        },
      ],
    }));
    router.refresh();
  };

  const adminActionSlot = (
    <Card className="border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
            Administrative Action Required?
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Change ticket status, assign maintenance crews, or post official resolution notes.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-1.5 shrink-0 cursor-pointer">
          <IconEdit className="h-4 w-4" />
          Update Status & Dispatch
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Admin Review • ${report.reportNumber || report.id}`}
        description={`Incident: "${report.subject}" filed by ${report.residentName}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Reports", href: "/admin/reports" },
          { label: report.reportNumber || report.id },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="cursor-pointer">
              <IconChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button size="sm" onClick={() => setIsDialogOpen(true)} className="gap-1.5 cursor-pointer">
              <IconEdit className="h-4 w-4" />
              Change Status
            </Button>
          </div>
        }
      />

      <ReportDetails report={report} actionSlot={adminActionSlot} />

      <AdminReportDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        report={report}
        onSave={handleSaveStatus}
      />
    </div>
  );
}
