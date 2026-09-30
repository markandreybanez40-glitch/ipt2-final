export type UserRole = "resident" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  barangay?: string;
  avatarUrl?: string;
  joinedDate?: string;
}

export interface ResidentProfile extends User {
  role: "resident";
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
}
