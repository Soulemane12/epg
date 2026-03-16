"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { can } from "@/lib/permissions";
import { formatDate, getInitials } from "@/lib/utils";
import { FeedPost } from "@/types";

export default function FeedPage() {
  const { store, currentUser, createPost, deletePost, togglePostLike, hidePost } = useApp();
  const [showForm, setShowForm] = useState(false);

  const canModerate = can(currentUser, "moderateFeed");

  const visible = store.feedPosts.filter((p) => !p.hidden || canModerate);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Compose */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6">
        {showForm ? (
          <PostForm
            onSave={(data) => {
              createPost(data, currentUser!.id);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full text-left text-sm text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded-lg px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            Share an update with the network…
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">No posts yet. Be the first to share!</div>
      ) : (
        <div className="space-y-4">
          {visible.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => togglePostLike(post.id, currentUser!.id)}
              onDelete={
                (currentUser?.id === post.authorId || can(currentUser, "deleteAnyPost"))
                  ? () => deletePost(post.id)
                  : undefined
              }
              onHide={
                canModerate && !post.hidden
                  ? (reason: string) => hidePost(post.id, currentUser!.id, reason)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, onDelete, onHide }: {
  post: FeedPost;
  onLike: () => void;
  onDelete?: () => void;
  onHide?: (reason: string) => void;
}) {
  const { store, currentUser } = useApp();
  const author = store.users.find((u) => u.id === post.authorId);
  const liked = post.likedBy.includes(currentUser!.id);
  const [showHideForm, setShowHideForm] = useState(false);
  const [hideReason, setHideReason] = useState("");

  return (
    <div className={`bg-white dark:bg-neutral-900 border rounded-xl p-5 ${post.hidden ? "border-red-200 dark:border-red-900 opacity-60" : "border-neutral-200 dark:border-neutral-800"}`}>
      {post.hidden && (
        <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs px-3 py-1.5 rounded-lg mb-3">
          Hidden from members — {post.hiddenReason && `Reason: ${post.hiddenReason}`}
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
          {getInitials(author?.fullName ?? "?")}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{author?.fullName}</p>
          <p className="text-xs text-neutral-400">{formatDate(post.createdAt)}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {onDelete && <button onClick={onDelete} className="text-xs text-neutral-400 hover:text-red-600">Delete</button>}
          {onHide && !showHideForm && <button onClick={() => setShowHideForm(true)} className="text-xs text-neutral-400 hover:text-orange-600">Hide</button>}
        </div>
      </div>

      {post.title && (
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{post.title}</h3>
      )}
      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">{post.body}</p>

      {post.imageUrl && (
        <div className="mb-3 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img src={post.imageUrl} alt="" className="w-full max-h-64 object-cover" />
        </div>
      )}

      {/* Hide form */}
      {showHideForm && (
        <div className="flex gap-2 mb-3">
          <input
            value={hideReason}
            onChange={(e) => setHideReason(e.target.value)}
            placeholder="Reason (optional)"
            className="flex-1 text-xs px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
          />
          <button onClick={() => { onHide!(hideReason); setShowHideForm(false); }} className="bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg">Hide</button>
          <button onClick={() => setShowHideForm(false)} className="text-xs text-neutral-400">Cancel</button>
        </div>
      )}

      {/* Like */}
      <div className="flex items-center gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-blue-600 dark:text-blue-400 font-medium" : "text-neutral-500 hover:text-blue-600"}`}
        >
          <span>{liked ? "👍" : "👍"}</span>
          <span>{post.likedBy.length > 0 ? post.likedBy.length : ""} {liked ? "Liked" : "Like"}</span>
        </button>
      </div>
    </div>
  );
}

function PostForm({ onSave, onCancel }: {
  onSave: (data: { title?: string; body: string; imageUrl?: string; videoUrl?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ title: "", body: "", imageUrl: "", videoUrl: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.body.trim()) return;
    onSave({
      body: form.body,
      title: form.title || undefined,
      imageUrl: form.imageUrl || undefined,
      videoUrl: form.videoUrl || undefined,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={form.title} onChange={set("title")} placeholder="Title (optional)" className={inputCls} />
      <textarea value={form.body} onChange={set("body")} placeholder="What's on your mind? *" className={inputCls + " resize-none"} rows={4} autoFocus />
      <input value={form.imageUrl} onChange={set("imageUrl")} placeholder="Image URL (optional)" className={inputCls} />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium">Post</button>
        <button type="button" onClick={onCancel} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-5 py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
