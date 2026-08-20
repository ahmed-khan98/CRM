"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSocket } from "@/app/_Components/Socket/SocketProvider";
import { useGetIceServersQuery } from "@/app/_Services/chat/chatApi";
import { getCurrentUser, getMyId } from "./chatUtils";

const CallContext = createContext(null);
// Split out from CallContext on purpose: `elapsed` ticks every second while
// a call is active, and most consumers (ChatApp, CallContext's other
// fields) don't care about the live timer. Isolating it means only
// components that actually render the ticking clock (CallOverlay) re-render
// once a second — everyone else keeps using the stable main context value.
const CallTimerContext = createContext(0);

function toSdp(desc) {
  if (!desc) return null;
  if (typeof desc === "string") {
    try {
      return JSON.parse(desc);
    } catch {
      return null;
    }
  }
  return { type: desc.type, sdp: desc.sdp };
}

function toIce(candidate) {
  if (!candidate) return null;
  if (typeof candidate.toJSON === "function") return candidate.toJSON();
  return candidate;
}

function selfProfile() {
  const u = getCurrentUser();
  return {
    userId: String(u?._id || u?.id || ""),
    fullName: u?.fullName || "You",
    image: u?.image || "",
    isLocal: true,
  };
}

function normUser(user, userId) {
  const id = String(user?._id || user?.userId || userId || "");
  return {
    userId: id,
    fullName: user?.fullName || "Member",
    image: user?.image || "",
    isLocal: false,
  };
}

export function CallProvider({ children }) {
  const { emit, on, connected } = useSocket();
  const { data: iceData } = useGetIceServersQuery(undefined, {
    skip: !connected,
  });
  const [call, setCall] = useState(null);
  const callRef = useRef(null);
  const localStreamRef = useRef(null);
  /** @type {React.MutableRefObject<Map<string, { pc: RTCPeerConnection, pendingIce: any[], stream: MediaStream | null }>>} */
  const peersRef = useRef(new Map());
  const remoteStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  /** @type {[Array<{userId:string,fullName:string,image:string,isLocal?:boolean,stream?:MediaStream|null}>, Function]} */
  const [participants, setParticipants] = useState([]);
  const [speakingId, setSpeakingId] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [sharing, setSharing] = useState(false);
  /** @type {[null | { userId: string }, Function]} */
  const [remoteScreenShare, setRemoteScreenShare] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const speakRafRef = useRef(null);
  const audioCtxRef = useRef(null);
  const pendingMeshRef = useRef(new Set());
  /** Offers that arrive from other mesh peers before our own getUserMedia
   * resolves — call.remoteOffer only has room for one, but in a group call
   * several already-active members can each send us an offer at once. */
  const pendingOffersRef = useRef(new Map());
  const myId = getMyId();

  // Full-mesh calling: every participant connects directly to every other
  // participant (not just the caller). To avoid both sides offering at once
  // (glare), only the peer with the lexicographically smaller id initiates —
  // the other side just waits for the incoming offer.
  const shouldInitiateTo = useCallback(
    (otherId) => String(myId) < String(otherId),
    [myId]
  );

  const iceServers = iceData?.data?.iceServers || [
    { urls: "stun:stun.l.google.com:19302" },
  ];

  const patchCall = useCallback((patch) => {
    setCall((prev) => {
      if (!prev) return prev;
      const next =
        typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      callRef.current = next;
      return next;
    });
  }, []);

  const setCallState = useCallback((next) => {
    callRef.current = next;
    setCall(next);
  }, []);

  const startTimer = useCallback(() => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
  }, []);

  const upsertParticipant = useCallback((info, stream) => {
    if (!info?.userId) return;
    setParticipants((prev) => {
      const id = String(info.userId);
      const idx = prev.findIndex((p) => String(p.userId) === id);
      const next = {
        userId: id,
        fullName: info.fullName || prev[idx]?.fullName || "Member",
        image: info.image ?? prev[idx]?.image ?? "",
        isLocal: Boolean(info.isLocal),
        stream: stream !== undefined ? stream : prev[idx]?.stream || null,
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...next };
        return copy;
      }
      return [...prev, next];
    });
  }, []);

  const removeParticipant = useCallback((userId) => {
    const id = String(userId);
    setParticipants((prev) => prev.filter((p) => String(p.userId) !== id));
  }, []);

  const rebuildRemoteStream = useCallback(() => {
    const tracks = [];
    peersRef.current.forEach(({ pc, stream }, peerId) => {
      const peerTracks = [];
      pc.getReceivers().forEach((r) => {
        if (r.track && r.track.readyState !== "ended") {
          tracks.push(r.track);
          peerTracks.push(r.track);
        }
      });
      const peerStream =
        peerTracks.length > 0 ? new MediaStream(peerTracks) : null;
      const entry = peersRef.current.get(peerId);
      if (entry) entry.stream = peerStream;
      setParticipants((prev) => {
        const idx = prev.findIndex((p) => String(p.userId) === String(peerId));
        if (idx < 0) {
          if (!peerStream) return prev;
          return [
            ...prev,
            {
              userId: String(peerId),
              fullName: "Member",
              image: "",
              isLocal: false,
              stream: peerStream,
            },
          ];
        }
        const copy = [...prev];
        copy[idx] = { ...copy[idx], stream: peerStream };
        return copy;
      });
    });
    if (!tracks.length) {
      remoteStreamRef.current = null;
      setRemoteStream(null);
      return;
    }
    const stream = new MediaStream(tracks);
    remoteStreamRef.current = stream;
    setRemoteStream(stream);
  }, []);

  const closePeer = useCallback(
    (peerId) => {
      const key = String(peerId);
      const entry = peersRef.current.get(key);
      if (entry) {
        entry.pc.close();
        peersRef.current.delete(key);
      }
      rebuildRemoteStream();
    },
    [rebuildRemoteStream]
  );

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (speakRafRef.current) cancelAnimationFrame(speakRafRef.current);
    speakRafRef.current = null;
    try {
      audioCtxRef.current?.close?.();
    } catch {
      /* ignore */
    }
    audioCtxRef.current = null;
    setElapsed(0);
    pendingMeshRef.current.clear();
    pendingOffersRef.current.clear();
    peersRef.current.forEach(({ pc }) => pc.close());
    peersRef.current.clear();
    localStreamRef.current?.getTracks()?.forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    remoteStreamRef.current = null;
    setParticipants([]);
    setSpeakingId(null);
    setMuted(false);
    setCameraOff(false);
    setSharing(false);
    setRemoteScreenShare(null);
    setCallState(null);
  }, [setCallState]);

  const ensurePeer = useCallback(
    (peerUserId, callId) => {
      const key = String(peerUserId);
      let entry = peersRef.current.get(key);
      if (entry) return entry.pc;

      const pc = new RTCPeerConnection({ iceServers });
      entry = { pc, pendingIce: [], stream: null, iceRestartAttempted: false };
      peersRef.current.set(key, entry);

      pc.onicecandidate = (e) => {
        if (!e.candidate) return;
        emit("call:ice", {
          toUserId: key,
          candidate: toIce(e.candidate),
          callId: callRef.current?.callId || callId,
        });
      };

      pc.ontrack = () => {
        rebuildRemoteStream();
      };

      // Flaky mobile networks / NAT timeouts often show up as a transient
      // "failed" state that recovers with a fresh ICE negotiation — give it
      // one restart attempt (only from the deterministic initiator side, to
      // avoid both ends renegotiating at once) before tearing the call down.
      let recoveryTimer = null;
      const scheduleFailureCheck = () => {
        if (recoveryTimer) return;
        if (!entry.iceRestartAttempted && shouldInitiateTo(key)) {
          entry.iceRestartAttempted = true;
          (async () => {
            try {
              pc.restartIce();
              const offer = await pc.createOffer({ iceRestart: true });
              await pc.setLocalDescription(offer);
              emit("call:offer", {
                toUserId: key,
                sdp: toSdp(pc.localDescription),
                callId: callRef.current?.callId || callId,
              });
            } catch {
              /* handled by the grace-period check below */
            }
          })();
        }
        recoveryTimer = setTimeout(() => {
          recoveryTimer = null;
          if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
            closePeer(key);
            if (
              callRef.current?.status === "active" &&
              peersRef.current.size === 0 &&
              !callRef.current?.groupCall
            ) {
              cleanup();
            }
          }
        }, 8000);
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "failed") scheduleFailureCheck();
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          entry.iceRestartAttempted = false;
          return;
        }
        if (pc.connectionState === "closed") {
          closePeer(key);
          return;
        }
        if (pc.connectionState === "failed") scheduleFailureCheck();
      };

      const media = localStreamRef.current;
      if (media) {
        media.getTracks().forEach((track) => {
          if (!pc.getSenders().some((s) => s.track === track)) {
            pc.addTrack(track, media);
          }
        });
      }

      return pc;
    },
    [cleanup, closePeer, emit, iceServers, rebuildRemoteStream, shouldInitiateTo]
  );

  const flushIce = useCallback(async (peerUserId) => {
    const entry = peersRef.current.get(String(peerUserId));
    if (!entry?.pc?.remoteDescription) return;
    const queued = entry.pendingIce;
    entry.pendingIce = [];
    for (const c of queued) {
      try {
        await entry.pc.addIceCandidate(c);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const attachLocalTracksToPeers = useCallback(() => {
    const media = localStreamRef.current;
    if (!media) return;
    peersRef.current.forEach(({ pc }) => {
      media.getTracks().forEach((track) => {
        if (!pc.getSenders().some((s) => s.track === track)) {
          pc.addTrack(track, media);
        }
      });
    });
  }, []);

  // Explicit audio processing constraints (rather than just `audio: true`)
  // signal a "communication" style session to the OS on Android, which
  // helps it treat this as a real call rather than generic media playback.
  const AUDIO_CONSTRAINTS = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  };

  const getMedia = useCallback(async (video) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONSTRAINTS,
        video: video ? { facingMode: "user" } : false,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      upsertParticipant(selfProfile(), stream);
      return stream;
    } catch (err) {
      if (video) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: AUDIO_CONSTRAINTS,
          video: false,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        setCameraOff(true);
        upsertParticipant(selfProfile(), stream);
        return stream;
      }
      throw err;
    }
  }, [upsertParticipant]);

  const createAndSendOffer = useCallback(
    async (peerUserId, callId) => {
      if (!peerUserId || !callId) return;
      const key = String(peerUserId);
      try {
        const pc = ensurePeer(key, callId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        emit("call:offer", {
          toUserId: key,
          sdp: toSdp(pc.localDescription),
          callId,
        });
      } catch (err) {
        console.error("[call] create offer failed", err);
      }
    },
    [emit, ensurePeer]
  );

  const answerRemoteOffer = useCallback(
    async (sdp, fromUserId) => {
      const current = callRef.current;
      if (!current?.callId || !fromUserId) return;
      const key = String(fromUserId);
      const remote = toSdp(sdp);
      if (!remote) return;

      try {
        const pc = ensurePeer(key, current.callId);
        if (pc.signalingState !== "stable" || !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(remote);
          await flushIce(key);
        }

        if (pc.signalingState === "have-remote-offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          emit("call:answer", {
            toUserId: key,
            sdp: toSdp(pc.localDescription),
            callId: current.callId,
          });
        }

        patchCall({
          status: "active",
          peerUserId: current.groupCall
            ? current.peerUserId || key
            : key,
        });
        startTimer();
      } catch (err) {
        console.error("[call] answer failed", err);
      }
    },
    [emit, ensurePeer, flushIce, patchCall, startTimer]
  );

  const connectToPeer = useCallback(
    async (peerUserId) => {
      const current = callRef.current;
      if (!current?.callId || !peerUserId) return;
      const key = String(peerUserId);
      if (peersRef.current.has(key)) return;
      patchCall({
        status: "active",
        peerUserId: current.groupCall ? current.peerUserId || key : key,
      });
      startTimer();
      await createAndSendOffer(key, current.callId);
    },
    [createAndSendOffer, patchCall, startTimer]
  );

  // If local mic/camera isn't ready yet (still awaiting getUserMedia), queue
  // the peer and connect once media becomes available instead of silently
  // creating a track-less offer.
  const initiateOrQueue = useCallback(
    (peerUserId) => {
      if (localStreamRef.current) {
        connectToPeer(peerUserId);
      } else {
        pendingMeshRef.current.add(String(peerUserId));
      }
    },
    [connectToPeer]
  );

  const flushPendingMesh = useCallback(() => {
    if (!pendingMeshRef.current.size) return;
    const targets = [...pendingMeshRef.current];
    pendingMeshRef.current.clear();
    targets.forEach((id) => connectToPeer(id));
  }, [connectToPeer]);

  const startOutgoing = useCallback(
    async ({
      conversationId,
      peerUserId,
      callType = "voice",
      groupCall = false,
      groupName = null,
      groupImage = null,
      peer = null,
    }) => {
      const isGroup = Boolean(groupCall) || !peerUserId;
      await getMedia(callType === "video");
      setParticipants([
        { ...selfProfile(), stream: localStreamRef.current },
      ]);
      if (peerUserId && peer) {
        upsertParticipant(normUser(peer, peerUserId), null);
      }
      setCallState({
        status: "outgoing",
        callType,
        conversationId,
        peerUserId: peerUserId || null,
        peer: peer || null,
        groupCall: isGroup,
        groupName: isGroup ? groupName || "Group call" : null,
        groupImage: isGroup ? groupImage || "" : null,
        callId: null,
        isCaller: true,
      });

      const invite = { conversationId, callType };
      if (peerUserId) invite.calleeId = peerUserId;

      emit("call:invite", invite, async (ack) => {
        if (!ack?.ok) {
          cleanup();
          return;
        }
        const callId = ack.callId;
        if (callRef.current) {
          callRef.current = { ...callRef.current, callId };
        }
        patchCall({ callId });

        if (peerUserId && !isGroup) {
          await createAndSendOffer(peerUserId, callId);
        }
      });
    },
    [
      cleanup,
      createAndSendOffer,
      emit,
      getMedia,
      patchCall,
      setCallState,
      upsertParticipant,
    ]
  );

  const acceptIncoming = useCallback(async () => {
    const current = callRef.current;
    if (!current || current.status !== "incoming") return;

    const { callId, peerUserId, callType, peer } = current;

    patchCall({ status: "connecting" });
    emit("call:accept", { callId });

    try {
      await getMedia(callType === "video");
    } catch (err) {
      console.error("[call] getMedia failed on accept", err);
    }
    attachLocalTracksToPeers();
    flushPendingMesh();

    const queuedOffers = [...pendingOffersRef.current.entries()];
    pendingOffersRef.current.clear();
    for (const [fromId, sdp] of queuedOffers) {
      try {
        await answerRemoteOffer(sdp, fromId);
      } catch (err) {
        console.error("[call] queued offer failed", err);
      }
    }

    upsertParticipant(selfProfile(), localStreamRef.current);
    if (peerUserId) {
      upsertParticipant(normUser(peer, peerUserId), null);
    }

    const latest = callRef.current || current;
    const remoteOffer = latest.remoteOffer || current.remoteOffer;
    const peerId = latest.peerUserId || peerUserId;

    if (remoteOffer && peerId) {
      await answerRemoteOffer(remoteOffer, peerId);
    }
  }, [
    answerRemoteOffer,
    attachLocalTracksToPeers,
    emit,
    flushPendingMesh,
    getMedia,
    patchCall,
    upsertParticipant,
  ]);

  const rejectIncoming = useCallback(() => {
    if (callRef.current?.callId) {
      emit("call:reject", { callId: callRef.current.callId });
    }
    cleanup();
  }, [cleanup, emit]);

  const endCall = useCallback(() => {
    if (callRef.current?.callId) {
      emit("call:end", { callId: callRef.current.callId });
    }
    cleanup();
  }, [cleanup, emit]);

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks()?.forEach((t) => {
      t.enabled = !t.enabled;
    });
    setMuted((m) => !m);
  }, []);

  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks()?.forEach((t) => {
      t.enabled = !t.enabled;
    });
    setCameraOff((c) => !c);
  }, []);

  const notifyScreenShare = useCallback(
    (enabled) => {
      const current = callRef.current;
      if (!current?.callId) return;
      const targets = new Set([...peersRef.current.keys()]);
      if (current.peerUserId) targets.add(String(current.peerUserId));
      targets.forEach((toUserId) => {
        if (!toUserId || toUserId === String(myId)) return;
        emit("call:screen-share", {
          toUserId,
          enabled,
          callId: current.callId,
        });
      });
    },
    [emit, myId]
  );

  const toggleScreenShare = useCallback(async () => {
    const current = callRef.current;
    if (!current) return;

    if (!sharing) {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const track = screen.getVideoTracks()[0];
        peersRef.current.forEach(({ pc }) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(track);
          else pc.addTrack(track, new MediaStream([track]));
        });
        const mixed = new MediaStream([
          ...(localStreamRef.current?.getAudioTracks() || []),
          track,
        ]);
        upsertParticipant({ ...selfProfile(), isLocal: true }, mixed);
        track.onended = () => {
          setSharing(false);
          notifyScreenShare(false);
          const cam = localStreamRef.current?.getVideoTracks()?.[0];
          peersRef.current.forEach(({ pc }) => {
            const sender = pc
              .getSenders()
              .find((s) => s.track?.kind === "video");
            if (sender && cam) sender.replaceTrack(cam);
          });
          if (localStreamRef.current) {
            upsertParticipant(selfProfile(), localStreamRef.current);
          }
        };
        setSharing(true);
        notifyScreenShare(true);
      } catch {
        /* cancelled */
      }
    } else {
      const cam = localStreamRef.current?.getVideoTracks()?.[0];
      peersRef.current.forEach(({ pc }) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender && cam) sender.replaceTrack(cam);
      });
      if (localStreamRef.current) {
        upsertParticipant(selfProfile(), localStreamRef.current);
      }
      setSharing(false);
      notifyScreenShare(false);
    }
  }, [sharing, notifyScreenShare, upsertParticipant]);

  // Speaking detection (WhatsApp-style green border)
  useEffect(() => {
    if (!call || !["active", "connecting", "outgoing"].includes(call.status)) {
      setSpeakingId(null);
      return undefined;
    }

    let cancelled = false;
    const analysers = [];

    const setup = async () => {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = audioCtxRef.current || new Ctx();
        audioCtxRef.current = ctx;
        if (ctx.state === "suspended") await ctx.resume();

        const add = (userId, stream) => {
          if (!stream?.getAudioTracks?.().length) return;
          try {
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.4;
            source.connect(analyser);
            analysers.push({
              userId: String(userId),
              analyser,
              data: new Uint8Array(analyser.frequencyBinCount),
            });
          } catch {
            /* ignore */
          }
        };

        participants.forEach((p) => {
          if (p.stream) add(p.userId, p.stream);
        });

        const tick = () => {
          if (cancelled) return;
          let bestId = null;
          let bestAvg = 0;
          for (const a of analysers) {
            a.analyser.getByteFrequencyData(a.data);
            let sum = 0;
            for (let i = 0; i < a.data.length; i++) sum += a.data[i];
            const avg = sum / a.data.length;
            if (avg > bestAvg) {
              bestAvg = avg;
              bestId = a.userId;
            }
          }
          setSpeakingId(bestAvg > 18 ? bestId : null);
          speakRafRef.current = requestAnimationFrame(tick);
        };
        speakRafRef.current = requestAnimationFrame(tick);
      } catch {
        /* ignore */
      }
    };

    setup();
    return () => {
      cancelled = true;
      if (speakRafRef.current) cancelAnimationFrame(speakRafRef.current);
    };
  }, [call, participants]);

  useEffect(() => {
    const offs = [
      on("call:incoming", (payload) => {
        if (String(payload?.caller?._id) === String(myId)) return;
        const cur = callRef.current;
        if (
          cur &&
          String(cur.callId) === String(payload.callId) &&
          ["connecting", "active", "outgoing"].includes(cur.status)
        ) {
          return;
        }
        setParticipants([]);
        setCallState({
          status: "incoming",
          callId: payload.callId,
          callType: payload.callType,
          conversationId: payload.conversationId,
          peerUserId: payload.caller?._id,
          peer: payload.caller,
          groupCall: Boolean(payload.groupCall),
          groupName: payload.groupName || null,
          groupImage: payload.groupImage || null,
          remoteOffer: payload.sdpOffer || null,
          isCaller: false,
        });
      }),

      on("call:accepted", (payload) => {
        const current = callRef.current;
        if (!current) return;
        const accepterId = payload.userId;
        if (!accepterId) return;
        upsertParticipant(
          normUser(payload.user, accepterId),
          null
        );
        if (
          ["outgoing", "active", "connecting"].includes(current.status) &&
          shouldInitiateTo(accepterId)
        ) {
          initiateOrQueue(accepterId);
        }
      }),

      on("call:peer-joined", (payload) => {
        const current = callRef.current;
        if (!current) return;
        if (!payload.userId) return;
        upsertParticipant(normUser(payload.user, payload.userId), null);
        // Full mesh: every existing participant (caller or not) links up
        // directly with the new joiner — whoever has the smaller id offers.
        if (
          ["outgoing", "active", "connecting"].includes(current.status) &&
          shouldInitiateTo(payload.userId)
        ) {
          initiateOrQueue(payload.userId);
        }
      }),

      on("call:roster", (payload) => {
        const current = callRef.current;
        const list = payload?.participants || [];
        const me = String(myId);
        list.forEach((p) => {
          const id = String(p.userId);
          if (id === me) {
            upsertParticipant(
              { ...selfProfile(), ...normUser(p, id), isLocal: true },
              localStreamRef.current
            );
          } else {
            upsertParticipant(normUser(p, id), null);
            // Full mesh: connect straight to every other member already in
            // the call, not just the caller — mirrors the peer-joined check
            // above so exactly one side of each pair sends the offer.
            if (
              current &&
              ["connecting", "active"].includes(current.status) &&
              shouldInitiateTo(id)
            ) {
              initiateOrQueue(id);
            }
          }
        });
      }),

      on("call:rejected", () => {
        const current = callRef.current;
        if (!current) return;
        if (current.status === "outgoing" && peersRef.current.size === 0) {
          cleanup();
        }
      }),

      on("call:peer-rejected", () => {}),

      on("call:peer-left", (payload) => {
        const current = callRef.current;
        if (!current) return;
        const leftId = payload?.userId;
        if (!leftId) return;
        closePeer(String(leftId));
        removeParticipant(leftId);
      }),

      on("call:screen-share", (payload) => {
        const fromId = String(payload?.fromUserId || "");
        if (!fromId) return;
        if (payload?.enabled) {
          setRemoteScreenShare({ userId: fromId });
        } else {
          setRemoteScreenShare((prev) =>
            prev && String(prev.userId) === fromId ? null : prev
          );
        }
      }),

      on("call:ended", (payload) => {
        const current = callRef.current;
        if (!current) return;
        if (payload?.reason === "answered_elsewhere") {
          if (current.groupCall) return;
          if (current.status === "incoming") cleanup();
          return;
        }
        cleanup();
      }),

      on("call:offer", async (payload) => {
        const current = callRef.current;
        if (!current) return;
        const fromId = payload.fromUserId || current.peerUserId;

        if (current.status === "incoming") {
          patchCall({
            remoteOffer: payload.sdp,
            peerUserId: fromId || current.peerUserId,
          });
          return;
        }

        // Already accepted but our own mic/camera isn't ready yet — in a
        // mesh group call several members can offer to us at once, so queue
        // each by sender instead of overwriting a single remoteOffer slot.
        if (current.status === "connecting" && !localStreamRef.current) {
          if (fromId) pendingOffersRef.current.set(String(fromId), payload.sdp);
          return;
        }

        try {
          await answerRemoteOffer(payload.sdp, fromId);
        } catch (err) {
          console.error("[call] handle offer failed", err);
        }
      }),

      on("call:answer", async (payload) => {
        const key = String(payload.fromUserId || "");
        const entry = peersRef.current.get(key);
        const remote = toSdp(payload.sdp);
        if (!entry || !remote) return;
        try {
          if (entry.pc.signalingState === "have-local-offer") {
            await entry.pc.setRemoteDescription(remote);
            await flushIce(key);
          }
        } catch (err) {
          console.error("[call] set answer failed", err);
        }
      }),

      on("call:ice", async (payload) => {
        const key = String(payload.fromUserId || "");
        const candidate = payload.candidate;
        if (!candidate || !key) return;
        let entry = peersRef.current.get(key);
        if (!entry) {
          const callId = callRef.current?.callId || payload.callId;
          if (!callId || !callRef.current) return;
          ensurePeer(key, callId);
          entry = peersRef.current.get(key);
        }
        if (!entry) return;
        try {
          if (entry.pc.remoteDescription) {
            await entry.pc.addIceCandidate(candidate);
          } else {
            entry.pendingIce.push(candidate);
          }
        } catch {
          /* ignore */
        }
      }),
    ];
    return () => offs.forEach((off) => off?.());
  }, [
    on,
    cleanup,
    connectToPeer,
    initiateOrQueue,
    shouldInitiateTo,
    answerRemoteOffer,
    closePeer,
    ensurePeer,
    flushIce,
    myId,
    patchCall,
    setCallState,
    upsertParticipant,
    removeParticipant,
  ]);

  // `elapsed` deliberately excluded — see CallTimerContext above.
  const value = useMemo(
    () => ({
      call,
      localStream,
      remoteStream,
      participants,
      speakingId,
      muted,
      cameraOff,
      sharing,
      remoteScreenShare,
      startOutgoing,
      acceptIncoming,
      rejectIncoming,
      endCall,
      toggleMute,
      toggleCamera,
      toggleScreenShare,
    }),
    [
      call,
      localStream,
      remoteStream,
      participants,
      speakingId,
      muted,
      cameraOff,
      sharing,
      remoteScreenShare,
      startOutgoing,
      acceptIncoming,
      rejectIncoming,
      endCall,
      toggleMute,
      toggleCamera,
      toggleScreenShare,
    ]
  );

  return (
    <CallContext.Provider value={value}>
      <CallTimerContext.Provider value={elapsed}>
        {children}
      </CallTimerContext.Provider>
    </CallContext.Provider>
  );
}

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) {
    return {
      call: null,
      startOutgoing: async () => {},
      acceptIncoming: async () => {},
      rejectIncoming: () => {},
      endCall: () => {},
      toggleMute: () => {},
      toggleCamera: () => {},
      toggleScreenShare: async () => {},
      localStream: null,
      remoteStream: null,
      participants: [],
      speakingId: null,
      muted: false,
      cameraOff: false,
      sharing: false,
      remoteScreenShare: null,
    };
  }
  return ctx;
}

/** Isolated from useCall() on purpose — subscribe to this only in
 * components that render the live call-duration timer (e.g. CallOverlay),
 * so the ticking clock doesn't re-render everything else using useCall(). */
export function useCallElapsed() {
  return useContext(CallTimerContext);
}
