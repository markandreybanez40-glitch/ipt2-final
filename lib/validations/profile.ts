import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(250).optional().nullable(),
  barangay: z.string().max(100).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
