"use server";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/validations/profile";
import { updateProfile } from "@/lib/services/profiles";
import { revalidatePath } from "next/cache";

export async function updateMyProfileAction(
  data: UpdateProfileInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { success: false, error: "Not authenticated" };
    }

    const validated = updateProfileSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const result = await updateProfile(profile.id, validated.data);

    if (!result.success) {
      return { success: false, error: result.error || "Failed to update profile." };
    }

    revalidatePath("/resident/profile");
    revalidatePath("/resident/dashboard");
    revalidatePath("/admin/residents");

    return { success: true };
  } catch (err) {
    console.error("Error in updateMyProfileAction:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
