"use client";

import { useCallback, useEffect, useState } from "react";

export default function useChatPresence({
  conversations,
  peerId,
  myId,
  connected,
  emit,
  fetchPresence,
  isUserOnline,
  getPresence,
}) {
  const [presenceOverlay, setPresenceOverlay] = useState({});

  useEffect(() => {
    if (!connected) return;
    emit("chat:presence:request");
  }, [connected, emit]);

  useEffect(() => {
    const ids = new Set();
    conversations.forEach((c) => {
      (c.participants || []).forEach((p) => {
        const id = p.userId?._id || p.userId;
        if (id && String(id) !== String(myId)) ids.add(String(id));
      });
    });
    if (peerId) ids.add(peerId);
    if (!ids.size) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetchPresence([...ids]).unwrap();
        const list = res?.data || [];
        if (cancelled) return;
        setPresenceOverlay((prev) => {
          const next = { ...prev };
          list.forEach((u) => {
            const id = String(u.userId);
            next[id] = {
              userId: id,
              status: u.status,
              lastSeen: u.lastSeen,
              isOnline: Boolean(u.isOnline),
            };
          });
          return next;
        });
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversations, peerId, myId, fetchPresence]);

  const onlineOf = useCallback(
    (userId) => {
      if (!userId) return false;
      const id = String(userId);
      if (isUserOnline(id)) return true;
      const o = presenceOverlay[id];
      return Boolean(o?.isOnline || o?.status === "online");
    },
    [isUserOnline, presenceOverlay]
  );

  const presenceOf = useCallback(
    (userId) => {
      if (!userId) return null;
      const id = String(userId);
      return getPresence(id) || presenceOverlay[id] || null;
    },
    [getPresence, presenceOverlay]
  );

  return {
    onlineOf,
    presenceOf,
    peerOnline: peerId ? onlineOf(peerId) : false,
    peerPresence: peerId ? presenceOf(peerId) : null,
  };
}
