import { Role, User } from "@/types";

export type Permission =
  | "createEvent"
  | "editAnyEvent"
  | "deleteAnyEvent"
  | "approveUsers"
  | "promoteUsers"
  | "deleteUsers"
  | "postAnnouncement"
  | "deleteAnyAnnouncement"
  | "manageLeadership"
  | "moderateFeed"
  | "uploadResource"
  | "deleteAnyResource"
  | "deleteAnyReferral"
  | "viewAdmin"
  | "deleteAnyPost";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: [],
  member: [],
  chapter_leader: [
    "createEvent",
    "editAnyEvent",
    "deleteAnyEvent",
    "postAnnouncement",
    "uploadResource",
  ],
  executive: [
    "createEvent",
    "editAnyEvent",
    "deleteAnyEvent",
    "postAnnouncement",
    "deleteAnyAnnouncement",
    "manageLeadership",
    "uploadResource",
  ],
  admin: [
    "createEvent",
    "editAnyEvent",
    "deleteAnyEvent",
    "approveUsers",
    "promoteUsers",
    "deleteUsers",
    "postAnnouncement",
    "deleteAnyAnnouncement",
    "manageLeadership",
    "moderateFeed",
    "uploadResource",
    "deleteAnyResource",
    "deleteAnyReferral",
    "viewAdmin",
    "deleteAnyPost",
  ],
};

export function can(user: User | null, permission: Permission): boolean {
  if (!user || user.approvalStatus !== "approved") return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
}
