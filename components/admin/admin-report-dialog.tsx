"use client";

import React, { useState, useEffect } from "react";
import { Report, ReportStatus } from "@/types/report";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { REPORT_STATUSES, STATUS_LABELS } from "@/lib/constants";
import { updateReportStatusAction } from "@/lib/actions/reports";
import { reportStatuses } from "@/lib/validations/report";
import { IconCheckCircle, IconAlertTriangle } from "@/components/ui/icons";

export interface AdminReportDialogProps {
  open: boolean;
  onClose: () => void;
  report: Report | null;
  onSave?: (id: string, status: ReportStatus, adminNotes: string) => void;
}

export function AdminReportDialog({
  open,
  onClose,
  report,
  onSave,
}: AdminReportDialogProps) {
  const [status, setStatus] = useState<ReportStatus>("submitted");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (report) {
      setStatus(report.status);
      setNotes(report.adminNotes || "");
      setFeedback(null);
    }
  }, [report]);

  if (!report) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      // Normalize status to DB format (under_review, in_progress) for Zod validation
      const dbStatus = status.replace("-", "_") as (typeof reportStatuses)[number];

      // Call Server Action → Supabase update + timeline log
      const result = await updateReportStatusAction(report.id, {
        status: dbStatus,
        adminRemarks: notes,
      });

      if (result.success) {
        setFeedback({ type: "success", message: "Report status updated in database." });
        if (onSave) {
          onSave(report.id, status, notes);
        }
        // Auto-close after brief feedback
        setTimeout(() => {
          setFeedback(null);
          onClose();
        }, 800);
      } else {
        setFeedback({ type: "error", message: result.error || "Failed to save to database." });
        // Still call onSave so the UI updates optimistically
        if (onSave) {
          onSave(report.id, status, notes);
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setFeedback({ type: "error", message: "Network error. Changes may not have been saved." });
      if (onSave) {
        onSave(report.id, status, notes);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Update Report #${report.reportNumber || report.id}`}
      description={`Manage status and add official resolution notes for "${report.subject}"`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {feedback && (
          <div
            className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold border ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900"
            }`}
          >
            {feedback.type === "success" ? (
              <IconCheckCircle className="h-4 w-4" />
            ) : (
              <IconAlertTriangle className="h-4 w-4" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div>
          <Select
            label="Report Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ReportStatus)}
            options={REPORT_STATUSES.map((st) => ({
              value: st,
              label: STATUS_LABELS[st],
            }))}
          />
        </div>

        <div>
          <Textarea
            label="Official Resolution / Dispatch Notes"
            placeholder="Add notes about response team deployment, repairs made, or referral details..."
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            helperText="These notes will be logged in the public timeline for the resident to see."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving to Supabase..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
