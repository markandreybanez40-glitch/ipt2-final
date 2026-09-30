export type ReportStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "under-review"
  | "in-progress";

export type ReportPriority = "low" | "medium" | "high" | "urgent";

export interface ReportTimelineEvent {
  id: string;
  status: ReportStatus;
  title: string;
  description: string;
  timestamp: string;
  updatedBy: string;
}

export interface Report {
  id: string;
  reportNumber?: string;
  residentId: string;
  residentName: string;
  category: string;
  subject: string;
  description: string;
  location: string;
  dateSubmitted: string;
  status: ReportStatus;
  priority?: ReportPriority;
  image?: string;
  adminNotes?: string;
  timeline?: ReportTimelineEvent[];
}
