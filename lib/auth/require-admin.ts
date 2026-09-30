import { redirect } from "next/navigation";
import { getCurrentProfile } from "./get-current-profile";
import { ProfileRow } from "@/types/database";

export async function requireAdmin(): Promise<ProfileRow> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/resident/dashboard");
  }

  return profile;
}
