export type AnnouncementPriority = "low" | "medium" | "high" | "urgent";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  datePosted: string;
  priority: AnnouncementPriority;
  isActive: boolean;
  targetAudience?: "all" | "residents" | "staff";
}
