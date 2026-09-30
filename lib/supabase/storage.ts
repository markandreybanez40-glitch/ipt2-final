import { createClient } from "./client";

export async function uploadReportPhoto(
  file: File,
  userId: string,
  reportId: string = "temp"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { url: null, error: "File size exceeds 10MB limit." };
    }

    // Validate extension
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: "Only JPG, PNG, WEBP, and PDF files are allowed." };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `reports/${userId}/${reportId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("report-attachments")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return { url: null, error: "Failed to upload attachment. Please try again." };
    }

    const { data: publicUrlData } = supabase.storage
      .from("report-attachments")
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    console.error("Unexpected storage error:", err);
    return { url: null, error: "An unexpected error occurred during upload." };
  }
}
