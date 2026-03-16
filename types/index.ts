export type Role = "guest" | "member" | "chapter_leader" | "executive" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type MeetingStatus = "pending" | "accepted" | "declined" | "completed";
export type MeetingType = "zoom" | "google_meet" | "phone" | "in_person";
export type ReferralStatus = "open" | "fulfilled";
export type StoreVersion = number;

export type User = {
  id: string;
  email: string;
  password: string; // demo only – never use in production
  fullName: string;
  role: Role;
  approvalStatus: ApprovalStatus;
  createdAt: string;
};

export type Profile = {
  userId: string;
  bio: string;
  expertise: string[];
  companyName: string;
  title: string;
  phone: string;
  website: string;
  state: string;
  industry: string;
  specialties: string[];
  photoUrl: string;
  videoUrl: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  chapter: string;
  createdBy: string;
  attendees: string[]; // RSVP is binary: attending user IDs
};

export type ReferralResponse = {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
};

export type Referral = {
  id: string;
  userId: string;
  title: string;
  description: string;
  industry: string;
  state: string;
  status: ReferralStatus;
  responses: ReferralResponse[]; // embedded response list (not a thread entity)
  createdAt: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: "guidelines" | "forms" | "compliance" | "training" | "chapter_docs";
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
};

export type ResourceDownload = {
  id: string;
  userId: string;
  resourceId: string;
  downloadedAt: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  mediaUrl?: string;
  createdBy: string;
  createdAt: string;
};

export type LeadershipMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  order: number;
};

export type FeedPost = {
  id: string;
  authorId: string;
  title?: string;
  body: string;
  imageUrl?: string;
  videoUrl?: string;
  likedBy: string[];
  hidden: boolean;
  hiddenBy?: string;
  hiddenReason?: string;
  createdAt: string;
};

export type Message = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type MessageThread = {
  id: string; // canonical: sorted participantIds joined by "_"
  participantIds: string[];
  messages: Message[];
};

export type MeetingRequest = {
  id: string;
  fromUserId: string;
  toUserId: string;
  proposedTime: string;
  meetingType: MeetingType;
  notes: string;
  zoomUrl?: string;
  meetUrl?: string;
  status: MeetingStatus;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
};

export type AppStore = {
  version: StoreVersion;
  sessionUserId: string | null;
  users: User[];
  profiles: Profile[];
  events: Event[];
  referrals: Referral[];
  resources: Resource[];
  resourceDownloads: ResourceDownload[];
  announcements: Announcement[];
  leadership: LeadershipMember[];
  threads: MessageThread[];
  meetingRequests: MeetingRequest[];
  feedPosts: FeedPost[];
  notifications: Notification[];
};

export const DEFAULT_STORE: AppStore = {
  version: 1,
  sessionUserId: null,
  users: [],
  profiles: [],
  events: [],
  referrals: [],
  resources: [],
  resourceDownloads: [],
  announcements: [],
  leadership: [],
  threads: [],
  meetingRequests: [],
  feedPosts: [],
  notifications: [],
};
