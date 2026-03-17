"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadStore, saveStore, clearStore } from "@/lib/storage";
import { getSeedData, isSeedLoaded } from "@/lib/seed";
import { validateCredentials, getCurrentUser } from "@/lib/auth";
import { canonicalThreadId, generateId } from "@/lib/utils";
import {
  AppStore,
  DEFAULT_STORE,
  MeetingStatus,
  MeetingType,
  Role,
  User,
} from "@/types";

type ProfileData = Partial<Omit<import("@/types").Profile, "userId">>;
type EventData = Omit<import("@/types").Event, "id" | "attendees" | "createdBy">;
type ReferralData = Omit<import("@/types").Referral, "id" | "status" | "responses" | "createdAt" | "userId">;
type ResourceData = Omit<import("@/types").Resource, "id" | "createdAt" | "uploadedBy">;
type PostData = Omit<import("@/types").FeedPost, "id" | "likedBy" | "hidden" | "hiddenBy" | "hiddenReason" | "createdAt" | "authorId">;
type MeetingData = { toUserId: string; proposedTime: string; meetingType: MeetingType; notes: string; zoomUrl?: string; meetUrl?: string; };
type LeaderData = Partial<Omit<import("@/types").LeadershipMember, "id">>;
type AnnouncementData = Omit<import("@/types").Announcement, "id" | "createdAt" | "createdBy">;

export type ToastType = "success" | "error" | "info";
export type Toast = { id: string; message: string; type: ToastType };

let globalToastSetter: ((t: Toast) => void) | null = null;

function addToast(message: string, type: ToastType = "success") {
  globalToastSetter?.({ id: generateId(), message, type });
}

export function useAppStore() {
  const [store, setStoreState] = useState<AppStore>({ ...DEFAULT_STORE });
  const [isHydrated, setIsHydrated] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const storeRef = useRef(store);

  useEffect(() => {
    globalToastSetter = setToast;
    return () => { globalToastSetter = null; };
  }, []);

  // Initial hydration
  useEffect(() => {
    const loaded = loadStore();
    queueMicrotask(() => {
      setStoreState(loaded);
      storeRef.current = loaded;
      setIsHydrated(true);
    });
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handler = () => {
      const fresh = loadStore();
      // Preserve session from current tab
      const withSession = { ...fresh, sessionUserId: storeRef.current.sessionUserId };
      setStoreState(withSession);
      storeRef.current = withSession;
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const mutate = useCallback((updater: (prev: AppStore) => AppStore) => {
    setStoreState((prev) => {
      const next = updater(prev);
      saveStore(next);
      storeRef.current = next;
      return next;
    });
  }, []);

  const currentUser = getCurrentUser(store);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const seedDemoData = useCallback(() => {
    if (isSeedLoaded(storeRef.current)) {
      addToast("Demo data already loaded", "info");
      return;
    }
    const seed = getSeedData();
    saveStore(seed);
    setStoreState(seed);
    storeRef.current = seed;
    addToast("Demo data loaded successfully");
  }, []);

  const resetStore = useCallback(() => {
    clearStore();
    setStoreState({ ...DEFAULT_STORE });
    storeRef.current = { ...DEFAULT_STORE };
    addToast("App reset successfully", "info");
  }, []);

  const login = useCallback((email: string, password: string): { ok: boolean; reason?: string } => {
    const user = validateCredentials(storeRef.current, email, password);
    if (!user) return { ok: false, reason: "Invalid email or password." };
    if (user.approvalStatus === "pending") return { ok: false, reason: "Your application is pending admin approval." };
    if (user.approvalStatus === "rejected") return { ok: false, reason: "Your application was not approved." };
    mutate((s) => ({ ...s, sessionUserId: user.id }));
    return { ok: true };
  }, [mutate]);

  const logout = useCallback(() => {
    mutate((s) => ({ ...s, sessionUserId: null }));
  }, [mutate]);

  const applyForAccess = useCallback((data: {
    fullName: string; email: string; password: string;
    title: string; companyName: string; state: string; industry: string; bio: string;
  }): { ok: boolean; reason?: string } => {
    if (storeRef.current.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, reason: "An account with this email already exists." };
    }
    const id = "u_" + generateId();
    const newUser: User = {
      id,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: "member",
      approvalStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    const newProfile: import("@/types").Profile = {
      userId: id,
      bio: data.bio,
      expertise: [],
      companyName: data.companyName,
      title: data.title,
      phone: "",
      website: "",
      state: data.state,
      industry: data.industry,
      specialties: [],
      photoUrl: "",
      videoUrl: "",
    };
    mutate((s) => ({
      ...s,
      users: [...s.users, newUser],
      profiles: [...s.profiles, newProfile],
    }));
    addToast("Application submitted! An admin will review your request.");
    return { ok: true };
  }, [mutate]);

  // ── Admin ─────────────────────────────────────────────────────────────────

  const approveUser = useCallback((userId: string) => {
    mutate((s) => ({
      ...s,
      users: s.users.map((u) => u.id === userId ? { ...u, approvalStatus: "approved" as const } : u),
    }));
    addToast("Member approved");
  }, [mutate]);

  const rejectUser = useCallback((userId: string) => {
    mutate((s) => ({
      ...s,
      users: s.users.map((u) => u.id === userId ? { ...u, approvalStatus: "rejected" as const } : u),
    }));
    addToast("Member rejected", "info");
  }, [mutate]);

  const promoteUser = useCallback((userId: string, role: Role) => {
    mutate((s) => ({
      ...s,
      users: s.users.map((u) => u.id === userId ? { ...u, role } : u),
    }));
    addToast("Role updated");
  }, [mutate]);

  const deleteUser = useCallback((userId: string) => {
    mutate((s) => ({
      ...s,
      users: s.users.filter((u) => u.id !== userId),
      profiles: s.profiles.filter((p) => p.userId !== userId),
    }));
    addToast("Member removed", "info");
  }, [mutate]);

  // ── Profiles ──────────────────────────────────────────────────────────────

  const updateProfile = useCallback((userId: string, data: ProfileData) => {
    mutate((s) => {
      const exists = s.profiles.some((p) => p.userId === userId);
      const blank: import("@/types").Profile = {
        userId, bio: "", expertise: [], companyName: "", title: "",
        phone: "", website: "", state: "", industry: "", specialties: [],
        photoUrl: "", videoUrl: "",
      };
      return {
        ...s,
        profiles: exists
          ? s.profiles.map((p) => p.userId === userId ? { ...p, ...data } : p)
          : [...s.profiles, { ...blank, ...data }],
      };
    });
    addToast("Profile saved");
  }, [mutate]);

  // ── Events ────────────────────────────────────────────────────────────────

  const createEvent = useCallback((data: EventData, createdBy: string) => {
    const ev: import("@/types").Event = { id: "ev_" + generateId(), ...data, attendees: [createdBy], createdBy };
    mutate((s) => ({ ...s, events: [...s.events, ev] }));
    addToast("Event created");
  }, [mutate]);

  const updateEvent = useCallback((id: string, data: Partial<EventData>) => {
    mutate((s) => ({ ...s, events: s.events.map((e) => e.id === id ? { ...e, ...data } : e) }));
    addToast("Event updated");
  }, [mutate]);

  const deleteEvent = useCallback((id: string) => {
    mutate((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
    addToast("Event deleted", "info");
  }, [mutate]);

  const toggleRsvp = useCallback((eventId: string, userId: string) => {
    mutate((s) => ({
      ...s,
      events: s.events.map((e) => {
        if (e.id !== eventId) return e;
        const attending = e.attendees.includes(userId);
        return {
          ...e,
          attendees: attending
            ? e.attendees.filter((id) => id !== userId)
            : [...e.attendees, userId],
        };
      }),
    }));
  }, [mutate]);

  // ── Referrals ─────────────────────────────────────────────────────────────

  const createReferral = useCallback((data: ReferralData, userId: string) => {
    const ref: import("@/types").Referral = {
      id: "ref_" + generateId(), userId, ...data, status: "open", responses: [],
      createdAt: new Date().toISOString(),
    };
    mutate((s) => ({ ...s, referrals: [...s.referrals, ref] }));
    addToast("Referral posted");
  }, [mutate]);

  const respondToReferral = useCallback((referralId: string, userId: string, message: string) => {
    mutate((s) => ({
      ...s,
      referrals: s.referrals.map((r) => r.id !== referralId ? r : {
        ...r,
        responses: [...r.responses, {
          id: "rr_" + generateId(), userId, message, createdAt: new Date().toISOString(),
        }],
      }),
    }));
    addToast("Response sent");
  }, [mutate]);

  const markReferralFulfilled = useCallback((referralId: string) => {
    mutate((s) => ({
      ...s,
      referrals: s.referrals.map((r) => r.id === referralId ? { ...r, status: "fulfilled" as const } : r),
    }));
    addToast("Referral marked fulfilled");
  }, [mutate]);

  const deleteReferral = useCallback((id: string) => {
    mutate((s) => ({ ...s, referrals: s.referrals.filter((r) => r.id !== id) }));
    addToast("Referral deleted", "info");
  }, [mutate]);

  // ── Resources ─────────────────────────────────────────────────────────────

  const createResource = useCallback((data: ResourceData, uploadedBy: string) => {
    const res: import("@/types").Resource = {
      id: "res_" + generateId(), ...data, uploadedBy, createdAt: new Date().toISOString(),
    };
    mutate((s) => ({ ...s, resources: [...s.resources, res] }));
    addToast("Resource added");
  }, [mutate]);

  const deleteResource = useCallback((id: string) => {
    mutate((s) => ({ ...s, resources: s.resources.filter((r) => r.id !== id) }));
    addToast("Resource deleted", "info");
  }, [mutate]);

  const trackDownload = useCallback((userId: string, resourceId: string) => {
    const dl: import("@/types").ResourceDownload = {
      id: "dl_" + generateId(), userId, resourceId, downloadedAt: new Date().toISOString(),
    };
    mutate((s) => ({ ...s, resourceDownloads: [...s.resourceDownloads, dl] }));
  }, [mutate]);

  // ── Feed ──────────────────────────────────────────────────────────────────

  const createPost = useCallback((data: PostData, authorId: string) => {
    const post: import("@/types").FeedPost = {
      id: "fp_" + generateId(), authorId, ...data,
      likedBy: [], hidden: false, createdAt: new Date().toISOString(),
    };
    mutate((s) => ({ ...s, feedPosts: [post, ...s.feedPosts] }));
    addToast("Post published");
  }, [mutate]);

  const deletePost = useCallback((id: string) => {
    mutate((s) => ({ ...s, feedPosts: s.feedPosts.filter((p) => p.id !== id) }));
    addToast("Post deleted", "info");
  }, [mutate]);

  const togglePostLike = useCallback((postId: string, userId: string) => {
    mutate((s) => ({
      ...s,
      feedPosts: s.feedPosts.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likedBy.includes(userId);
        return { ...p, likedBy: liked ? p.likedBy.filter((id) => id !== userId) : [...p.likedBy, userId] };
      }),
    }));
  }, [mutate]);

  const hidePost = useCallback((postId: string, adminId: string, reason: string) => {
    mutate((s) => ({
      ...s,
      feedPosts: s.feedPosts.map((p) =>
        p.id === postId ? { ...p, hidden: true, hiddenBy: adminId, hiddenReason: reason } : p
      ),
    }));
    addToast("Post hidden", "info");
  }, [mutate]);

  const unhidePost = useCallback((postId: string) => {
    mutate((s) => ({
      ...s,
      feedPosts: s.feedPosts.map((p) =>
        p.id === postId ? { ...p, hidden: false, hiddenBy: undefined, hiddenReason: undefined } : p
      ),
    }));
    addToast("Post restored");
  }, [mutate]);

  // ── Messages ──────────────────────────────────────────────────────────────

  const sendMessage = useCallback((fromUserId: string, toUserId: string, body: string) => {
    const threadId = canonicalThreadId(fromUserId, toUserId);
    const msg: import("@/types").Message = {
      id: "msg_" + generateId(), senderId: fromUserId, body, createdAt: new Date().toISOString(),
    };
    mutate((s) => {
      const existing = s.threads.find((t) => t.id === threadId);
      if (existing) {
        return {
          ...s,
          threads: s.threads.map((t) =>
            t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t
          ),
        };
      }
      return {
        ...s,
        threads: [...s.threads, { id: threadId, participantIds: [fromUserId, toUserId], messages: [msg] }],
      };
    });
  }, [mutate]);

  // ── Meetings ──────────────────────────────────────────────────────────────

  const createMeetingRequest = useCallback((data: MeetingData, fromUserId: string) => {
    const req: import("@/types").MeetingRequest = {
      id: "mr_" + generateId(), fromUserId, ...data, status: "pending",
    };
    mutate((s) => ({ ...s, meetingRequests: [...s.meetingRequests, req] }));
    addToast("Meeting request sent");
  }, [mutate]);

  const updateMeetingRequestStatus = useCallback((id: string, status: MeetingStatus) => {
    mutate((s) => ({
      ...s,
      meetingRequests: s.meetingRequests.map((r) => r.id === id ? { ...r, status } : r),
    }));
    addToast("Meeting updated");
  }, [mutate]);

  // ── Leadership ────────────────────────────────────────────────────────────

  const updateLeadershipMember = useCallback((id: string, data: LeaderData) => {
    mutate((s) => ({
      ...s,
      leadership: s.leadership.map((l) => l.id === id ? { ...l, ...data } : l),
    }));
    addToast("Leadership updated");
  }, [mutate]);

  const reorderLeadership = useCallback((orderedIds: string[]) => {
    mutate((s) => ({
      ...s,
      leadership: s.leadership.map((l) => {
        const idx = orderedIds.indexOf(l.id);
        return idx >= 0 ? { ...l, order: idx + 1 } : l;
      }),
    }));
  }, [mutate]);

  // ── Announcements ─────────────────────────────────────────────────────────

  const createAnnouncement = useCallback((data: AnnouncementData, createdBy: string) => {
    const ann: import("@/types").Announcement = {
      id: "ann_" + generateId(), ...data, createdBy, createdAt: new Date().toISOString(),
    };
    mutate((s) => ({ ...s, announcements: [ann, ...s.announcements] }));
    addToast("Announcement posted");
  }, [mutate]);

  const deleteAnnouncement = useCallback((id: string) => {
    mutate((s) => ({ ...s, announcements: s.announcements.filter((a) => a.id !== id) }));
    addToast("Announcement deleted", "info");
  }, [mutate]);

  // ── Notifications ─────────────────────────────────────────────────────────

  const markNotificationRead = useCallback((id: string) => {
    mutate((s) => ({
      ...s,
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    }));
  }, [mutate]);

  return {
    store,
    currentUser,
    isHydrated,
    toast,
    setToast,
    // auth
    seedDemoData,
    resetStore,
    login,
    logout,
    applyForAccess,
    // admin
    approveUser,
    rejectUser,
    promoteUser,
    deleteUser,
    // profile
    updateProfile,
    // events
    createEvent,
    updateEvent,
    deleteEvent,
    toggleRsvp,
    // referrals
    createReferral,
    respondToReferral,
    markReferralFulfilled,
    deleteReferral,
    // resources
    createResource,
    deleteResource,
    trackDownload,
    // feed
    createPost,
    deletePost,
    togglePostLike,
    hidePost,
    unhidePost,
    // messages
    sendMessage,
    // meetings
    createMeetingRequest,
    updateMeetingRequestStatus,
    // leadership
    updateLeadershipMember,
    reorderLeadership,
    // announcements
    createAnnouncement,
    deleteAnnouncement,
    // notifications
    markNotificationRead,
  };
}

export type AppStoreContext = ReturnType<typeof useAppStore>;
