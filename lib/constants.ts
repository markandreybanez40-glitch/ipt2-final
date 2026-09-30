export type ReportStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "under-review"
  | "in-progress";

export const REPORT_STATUSES = [
  "submitted",
  "under_review",
  "in_progress",
  "resolved",
  "rejected",
] as const;

export const REPORT_CATEGORIES = [
  "Illegal Dumping",
  "Street Light Out",
  "Road Repair",
  "Flooding",
  "Animal Control",
  "Noise Complaint",
  "Public Hazard",
  "Water Supply Issue",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  "under-review": "Under Review",
  in_progress: "In Progress",
  "in-progress": "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  submitted: {
    bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  under_review: {
    bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  "under-review": {
    bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  in_progress: {
    bg: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  "in-progress": {
    bg: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  resolved: {
    bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  rejected: {
    bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
  },
};

export const APP_NAME = "Barangay Link & Report System";
export const BARANGAY_NAME = "Barangay Poblacion, Butuan City";
