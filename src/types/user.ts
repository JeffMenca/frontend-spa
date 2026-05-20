import type { Role } from "./auth";

export type ParticipationType = "ATTENDEE" | "SPEAKER" | "WORKSHOP_LEADER" | "GUEST_SPEAKER";

export interface User {
  id: string;
  email: string;
  fullName: string;
  organization: string;
  phone: string;
  personalId: string;
  photoUrl?: string | null;
  active: boolean;
  roles: Role[];
  linkedInstitutions: string[];
  participationTypes: ParticipationType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserList {
  items: User[];
  totalItems: number;
  totalPages: number;
  currentPage?: number;
}
