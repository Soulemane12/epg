"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { canonicalThreadId, formatDate, getInitials } from "@/lib/utils";

export default function MessagesPage() {
  const { store, currentUser, sendMessage } = useApp();
  const searchParams = useSearchParams();
  const initialThread = searchParams.get("thread");

  const myThreads = store.threads.filter((t) => t.participantIds.includes(currentUser!.id));
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    initialThread ?? (myThreads[0]?.id ?? null)
  );
  const [showNewModal, setShowNewModal] = useState(false);

  const activeThread = store.threads.find((t) => t.id === activeThreadId) ?? null;
  const otherUserId = activeThread?.participantIds.find((id) => id !== currentUser!.id);
  const otherUser = store.users.find((u) => u.id === otherUserId) ?? null;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      {/* Thread list */}
      <div className="w-72 border-r border-neutral-200 dark:border-neutral-800 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Messages</span>
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
          >
            + New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {myThreads.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-sm px-4">No conversations yet. Start one!</div>
          ) : (
            myThreads.map((t) => {
              const otherId = t.participantIds.find((id) => id !== currentUser!.id);
              const other = store.users.find((u) => u.id === otherId);
              const lastMsg = t.messages[t.messages.length - 1];
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`w-full text-left p-4 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
                    activeThreadId === t.id ? "bg-blue-50 dark:bg-blue-950" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {getInitials(other?.fullName ?? "?")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{other?.fullName ?? "Unknown"}</p>
                    {lastMsg && (
                      <p className="text-xs text-neutral-500 truncate">
                        {lastMsg.senderId === currentUser!.id ? "You: " : ""}{lastMsg.body}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat panel */}
      {activeThread && otherUser ? (
        <ChatPanel
          threadId={activeThread.id}
          otherUser={otherUser}
          messages={activeThread.messages}
          onSend={(body) => sendMessage(currentUser!.id, otherUser.id, body)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
          Select a conversation or start a new one.
        </div>
      )}

      {/* New message modal */}
      {showNewModal && (
        <NewMessageModal
          onClose={() => setShowNewModal(false)}
          onStart={(userId) => {
            const tid = canonicalThreadId(currentUser!.id, userId);
            setActiveThreadId(tid);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}

function ChatPanel({ threadId, otherUser, messages, onSend }: {
  threadId: string;
  otherUser: { id: string; fullName: string };
  messages: { id: string; senderId: string; body: string; createdAt: string }[];
  onSend: (body: string) => void;
}) {
  const { currentUser } = useApp();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          {getInitials(otherUser.fullName)}
        </div>
        <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{otherUser.fullName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-neutral-400 text-sm py-8">No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUser!.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-sm rounded-2xl px-4 py-2.5 text-sm ${
                isMine
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-sm"
              }`}>
                <p>{msg.body}</p>
                <p className={`text-xs mt-1 ${isMine ? "text-blue-200" : "text-neutral-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={submit} className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium">Send</button>
      </form>
    </div>
  );
}

function NewMessageModal({ onClose, onStart }: {
  onClose: () => void;
  onStart: (userId: string) => void;
}) {
  const { store, currentUser } = useApp();
  const [search, setSearch] = useState("");

  const candidates = store.users.filter(
    (u) => u.id !== currentUser!.id && u.approvalStatus === "approved" &&
      (search === "" || u.fullName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-sm w-full p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">New Message</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none">×</button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members…"
          className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          autoFocus
        />
        <div className="max-h-60 overflow-y-auto space-y-1">
          {candidates.map((u) => (
            <button
              key={u.id}
              onClick={() => onStart(u.id)}
              className="w-full text-left flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {getInitials(u.fullName)}
              </div>
              <span className="text-sm text-neutral-900 dark:text-neutral-100">{u.fullName}</span>
            </button>
          ))}
          {candidates.length === 0 && <p className="text-sm text-neutral-400 text-center py-4">No members found.</p>}
        </div>
      </div>
    </div>
  );
}
