import { z } from "zod";

export const announcementStatuses = ["draft", "published", "archived"] as const;

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(announcementStatuses).default("published"),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
