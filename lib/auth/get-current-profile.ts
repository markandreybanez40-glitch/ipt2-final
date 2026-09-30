import { createClient } from "@/lib/supabase/server";
import { ProfileRow } from "@/types/database";

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile;
  } catch {
    return null;
  }
}
