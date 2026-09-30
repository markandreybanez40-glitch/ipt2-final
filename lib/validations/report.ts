import { z } from "zod";

export const reportCategories = [
  "Illegal Dumping",
  "Street Light Out",
  "Road Repair",
  "Flooding",
  "Animal Control",
  "Noise Complaint",
  "Public Hazard",
  "Water Supply Issue",
] as const;

export const reportStatuses = [
  "submitted",
  "under_review",
  "in_progress",
  "resolved",
  "rejected",
] as const;

export const createReportSchema = z.object({
  category: z.enum(reportCategories, {
    errorMap: () => ({ message: "Please select a valid report category" }),
  }),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject must be under 150 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must be under 200 characters"),
  dateTime: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(reportStatuses, {
    errorMap: () => ({ message: "Please select a valid report status" }),
  }),
  adminRemarks: z.string().max(1000).optional(),
  assignedTo: z.string().uuid().optional().nullable(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
