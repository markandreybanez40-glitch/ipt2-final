import { redirect } from "next/navigation";
import { getCurrentProfile } from "./get-current-profile";
import { ProfileRow } from "@/types/database";

export async function requireResident(): Promise<ProfileRow> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}
