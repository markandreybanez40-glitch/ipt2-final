"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export async function loginAction(
  data: LoginInput
): Promise<{ success: boolean; role?: string; error?: string }> {
  try {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: validated.data.email,
        password: validated.data.password,
      });

    if (authError || !authData.user) {
      return {
        success: false,
        error: "Invalid email or password. Please check your credentials.",
      };
    }

    // Retrieve user's role from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", authData.user.id)
      .single();

    revalidatePath("/", "layout");

    return {
      success: true,
      role: profile?.role || "resident",
    };
  } catch (err) {
    console.error("Login action error:", err);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false };
  }
}
