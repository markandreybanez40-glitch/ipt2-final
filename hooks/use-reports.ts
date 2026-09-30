"use client";

import { useState, useEffect, useCallback } from "react";
import { Report, ReportStatus } from "@/types/report";
import { reports as initialReports } from "@/lib/mock-data";

const STORAGE_KEY = "barangay_reports_data";

export function useReports(residentFilterId?: string) {
  const [reportsList, setReportsList] = useState<Report[]>(initialReports);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReportsList(JSON.parse(stored));
      }
    } catch {
      // fallback to initial
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveReports = (newList: Report[]) => {
    setReportsList(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch {
      // ignore storage errors
    }
  };

  const addReport = useCallback(
    (newReport: Omit<Report, "id" | "dateSubmitted" | "status" | "timeline">) => {
      const id = `BR-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const now = new Date();
      const dateSubmitted = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now);

      const created: Report = {
        ...newReport,
        id,
        dateSubmitted,
        status: "submitted",
        timeline: [
          {
            id: `TL-${Date.now()}`,
            status: "submitted",
            title: "Report Submitted",
            description: "Report filed successfully and queued for review.",
            timestamp: `${dateSubmitted}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            updatedBy: newReport.residentName || "Resident",
          },
        ],
      };

      const updated = [created, ...reportsList];
      saveReports(updated);
      return created;
    },
    [reportsList]
  );

  const updateReportStatus = useCallback(
    (
      id: string,
      status: ReportStatus,
      adminNotes?: string,
      updatedBy: string = "Admin Desk"
    ) => {
      const updated = reportsList.map((r) => {
        if (r.id !== id) return r;

        const now = new Date();
        const dateStr = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(now);

        const newTimelineEvent = {
          id: `TL-${Date.now()}`,
          status,
          title: `Status updated to ${status.replace("-", " ").toUpperCase()}`,
          description: adminNotes || `Report status updated by ${updatedBy}.`,
          timestamp: `${dateStr}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          updatedBy,
        };

        return {
          ...r,
          status,
          adminNotes: adminNotes ?? r.adminNotes,
          timeline: [...(r.timeline || []), newTimelineEvent],
        };
      });

      saveReports(updated);
    },
    [reportsList]
  );

  const getReportById = useCallback(
    (id: string) => {
      return reportsList.find((r) => r.id === id);
    },
    [reportsList]
  );

  const filteredReports = residentFilterId
    ? reportsList.filter((r) => r.residentId === residentFilterId)
    : reportsList;

  const stats = {
    total: filteredReports.length,
    submitted: filteredReports.filter((r) => r.status === "submitted").length,
    underReview: filteredReports.filter((r) => r.status === "under-review").length,
    inProgress: filteredReports.filter((r) => r.status === "in-progress").length,
    resolved: filteredReports.filter((r) => r.status === "resolved").length,
    rejected: filteredReports.filter((r) => r.status === "rejected").length,
  };

  return {
    reports: filteredReports,
    allReports: reportsList,
    stats,
    isLoaded,
    addReport,
    updateReportStatus,
    getReportById,
  };
}
