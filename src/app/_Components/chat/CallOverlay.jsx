"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Maximize2,
  Minimize2,
  X,
  Expand,
  Volume2,
  Volume1,
} from "lucide-react";
import { useCall, useCallElapsed } from "./CallContext";

function clampPanelPos(left, top, el) {
  const w = el?.offsetWidth || 320;
  const h = el?.offsetHeight || 240;
  const maxL = Math.max(8, window.innerWidth - w - 8);
  const maxT = Math.max(8, window.innerHeight - h - 8);
  return {
    left: Math.min(Math.max(8, left), maxL),
    top: Math.min(Math.max(8, top), maxT),
  };
}

function useDraggablePosition() {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);
  const drag = useRef(null);
  const moved = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current || drag.current.pointerId !== e.pointerId) return;
      if (
        Math.abs(e.clientX - drag.current.sx) > 4 ||
        Math.abs(e.clientY - drag.current.sy) > 4
      ) {
        moved.current = true;
      }
      setPos(
        clampPanelPos(
          e.clientX - drag.current.ox,
          e.clientY - drag.current.oy,
          ref.current
        )
      );
    };
    const onUp = (e) => {
      if (!drag.current || drag.current.pointerId !== e.pointerId) return;
      drag.current = null;
    };
    const onResize = () => {
      setPos((prev) =>
        prev && ref.current ? clampPanelPos(prev.left, prev.top, ref.current) : prev
      );
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.target.closest?.("[data-no-drag]")) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    moved.current = false;
    drag.current = {
      pointerId: e.pointerId,
      ox: e.clientX - rect.left,
      oy: e.clientY - rect.top,
      sx: e.clientX,
      sy: e.clientY,
    };
    setPos(clampPanelPos(rect.left, rect.top, el));
  };

  return { ref, pos, didDrag: () => moved.current, onPointerDown };
}

function formatElapsed(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function VideoEl({ stream, muted, mirror, className = "", fit = "cover" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={muted}
      className={`h-full w-full ${fit === "contain" ? "object-contain bg-black" : "object-cover"} ${
        mirror ? "scale-x-[-1]" : ""
      } ${className}`}
    />
  );
}

// Best-effort earpiece/speaker output selection via the Audio Output Devices
// API. IMPORTANT platform caveat (2026): setSinkId() is NOT supported on
// Android Chrome — WebRTC audio there plays through the loudspeaker
// regardless of what we try, unless the user has a Bluetooth/wired headset
// connected. It IS supported on desktop Chrome/Edge. iOS has no setSinkId
// either, but WebKit's own audio-session handling already defaults calls to
// the earpiece correctly, so no web-side fix is needed there. We still run
// this (it's a harmless no-op where unsupported) for the platforms it does
// help, and gate the manual toggle button in the UI on actual support so we
// don't show users a control that can't do anything on their device.
const supportsSinkId =
  typeof window !== "undefined" &&
  typeof HTMLMediaElement !== "undefined" &&
  typeof HTMLMediaElement.prototype.setSinkId === "function";

async function pickSinkDeviceId(preferSpeaker) {
  if (!navigator.mediaDevices?.enumerateDevices) return null;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const outputs = devices.filter((d) => d.kind === "audiooutput");
    if (!outputs.length) return null;
    const match = outputs.find((d) =>
      preferSpeaker
        ? /speaker/i.test(d.label)
        : /earpiece|receiver|handset/i.test(d.label)
    );
    return match?.deviceId || null;
  } catch {
    return null;
  }
}

function RemoteAudio({ stream, preferSpeaker = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
      ref.current.play?.().catch(() => {});
    }
  }, [stream]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !stream || typeof el.setSinkId !== "function") return;
    let cancelled = false;
    (async () => {
      const deviceId = await pickSinkDeviceId(preferSpeaker);
      if (cancelled || !deviceId) return;
      try {
        await el.setSinkId(deviceId);
      } catch {
        /* unsupported/denied — keep default output route */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stream, preferSpeaker]);

  if (!stream) return null;
  return <audio ref={ref} autoPlay playsInline className="hidden" />;
}

function statusLabel(call, isVideo) {
  if (call.status === "incoming") {
    if (call.groupCall && call.peer?.fullName) {
      return `${call.peer.fullName} is calling…`;
    }
    return isVideo ? "Incoming video call…" : "Incoming voice call…";
  }
  if (call.status === "outgoing") {
    return call.groupCall ? "Calling group…" : "Calling…";
  }
  if (call.status === "connecting") return "Connecting…";
  return "";
}

function isScreenTrack(track) {
  if (!track || track.kind !== "video") return false;
  const settings = track.getSettings?.() || {};
  if (settings.displaySurface) return true;
  return /screen|display|window|tab/i.test(track.label || "");
}

function ParticipantTile({
  participant,
  speaking,
  isVideoCall,
  cameraOff,
  isLocal,
  compact,
  onOpenScreen,
  isScreen,
}) {
  const name = participant.isLocal
    ? "You"
    : participant.fullName?.split(" ")[0] || "Member";
  const letter = (participant.fullName || "?").charAt(0).toUpperCase();
  const stream = participant.stream;
  const hasVideo =
    stream &&
    stream.getVideoTracks?.().some((t) => t.enabled && t.readyState === "live");
  const showVideo =
    hasVideo && (isLocal ? isVideoCall && !cameraOff : true);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-zinc-900 transition-[box-shadow,ring] duration-150 ${
        speaking
          ? "ring-2 ring-emerald-400"
          : "ring-1 ring-white/10"
      } ${compact ? "min-h-[72px]" : "min-h-[96px]"}`}
    >
      {showVideo ? (
        <VideoEl
          stream={stream}
          muted={isLocal}
          mirror={isLocal && !isScreen}
          fit={isScreen ? "contain" : "cover"}
          className={compact ? "min-h-[72px]" : "min-h-[96px]"}
        />
      ) : (
        <div
          className={`flex flex-col items-center justify-center gap-1 ${
            compact ? "min-h-[72px]" : "min-h-[96px]"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-sm font-semibold ring-1 ring-white/10">
            {participant.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={participant.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              letter
            )}
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1 pt-4">
        <p className="truncate text-[10px] font-medium text-white">
          {name}
          {isScreen ? (
            <span className="ml-1 text-sky-300">· screen</span>
          ) : speaking ? (
            <span className="ml-1 text-emerald-300">· speaking</span>
          ) : null}
        </p>
      </div>
      {isScreen && onOpenScreen ? (
        <button
          type="button"
          aria-label="View screen full"
          onClick={onOpenScreen}
          className="absolute right-1.5 top-1.5 rounded-md bg-black/55 p-1 text-white hover:bg-black/75"
        >
          <Expand className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export default function CallOverlay() {
  const {
    call,
    remoteStream,
    participants,
    speakingId,
    muted,
    cameraOff,
    sharing,
    remoteScreenShare,
    acceptIncoming,
    rejectIncoming,
    endCall,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
  } = useCall();
  const elapsed = useCallElapsed();

  const [minimized, setMinimized] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [screenFullscreen, setScreenFullscreen] = useState(false);
  // Voice calls default to earpiece (like a phone call); video calls default
  // to loudspeaker since you're already looking at the screen. User can flip
  // it manually with the speaker button below.
  const [preferSpeaker, setPreferSpeaker] = useState(false);
  const panelDrag = useDraggablePosition();
  const chipDrag = useDraggablePosition();

  // New call → always show full panel (don't stay minimized from previous)
  useEffect(() => {
    setMinimized(false);
    setPanelExpanded(false);
    setScreenFullscreen(false);
    setPreferSpeaker(call?.callType === "video");
  }, [call?.callId, call?.callType]);

  const screenSharer = useMemo(() => {
    if (!participants?.length) return null;
    if (sharing) {
      return participants.find((p) => p.isLocal) || null;
    }
    if (remoteScreenShare?.userId) {
      return (
        participants.find(
          (p) => String(p.userId) === String(remoteScreenShare.userId)
        ) || null
      );
    }
    return (
      participants.find((p) =>
        p.stream?.getVideoTracks?.().some(isScreenTrack)
      ) || null
    );
  }, [participants, sharing, remoteScreenShare]);

  const screenStream = screenSharer?.stream || null;

  useEffect(() => {
    if (!screenStream && screenFullscreen) setScreenFullscreen(false);
  }, [screenStream, screenFullscreen]);

  if (!call) return null;

  const isVideo = call.callType === "video";
  const name = call.groupCall
    ? call.groupName || "Group call"
    : call.peer?.fullName || "Contact";
  const avatarLetter = (name || "?").charAt(0).toUpperCase();
  const status = statusLabel(call, isVideo);
  const inCallUi = ["outgoing", "connecting", "active"].includes(call.status);
  const joinedCount = participants.filter((p) => !p.isLocal).length;
  const subtitle =
    call.status === "active"
      ? formatElapsed(elapsed)
      : status ||
        (joinedCount > 0
          ? `${joinedCount + 1} in call`
          : call.groupCall
            ? "Waiting…"
            : "Connecting…");

  const gridParticipants = participants.length
    ? participants
    : [{ userId: "self", fullName: "You", isLocal: true, stream: null }];

  // Minimized floating chip — CRM fully usable (incoming + in-call)
  if (minimized) {
    const isIncoming = call.status === "incoming";
    return (
      <>
        <RemoteAudio stream={remoteStream} preferSpeaker={preferSpeaker} />
        <div
          ref={chipDrag.ref}
          onPointerDown={chipDrag.onPointerDown}
          style={
            chipDrag.pos
              ? { left: chipDrag.pos.left, top: chipDrag.pos.top, right: "auto", bottom: "auto" }
              : undefined
          }
          className={`fixed z-[100] flex max-w-[min(100vw-2rem,320px)] cursor-grab items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-white shadow-xl touch-none active:cursor-grabbing ${
            chipDrag.pos ? "" : "bottom-4 right-4 sm:bottom-6 sm:right-6"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (chipDrag.didDrag()) return;
              setMinimized(false);
            }}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            aria-label="Expand call"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isIncoming
                  ? "animate-pulse bg-emerald-500/25 text-emerald-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {avatarLetter}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold">{name}</span>
              <span className="block text-[10px] text-zinc-400">
                {isIncoming
                  ? status || "Incoming call…"
                  : call.status === "active"
                    ? formatElapsed(elapsed)
                    : subtitle}
              </span>
            </span>
          </button>
          {isIncoming ? (
            <>
              <button
                type="button"
                data-no-drag
                aria-label="Decline"
                onClick={(e) => {
                  e.stopPropagation();
                  rejectIncoming();
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                data-no-drag
                aria-label="Accept"
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(false);
                  acceptIncoming();
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600"
              >
                <PhoneCall className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              data-no-drag
              aria-label="End call"
              onClick={(e) => {
                e.stopPropagation();
                endCall();
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 hover:bg-red-600"
            >
              <PhoneOff className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </>
    );
  }

  const panelWidth = panelExpanded
    ? "sm:w-[420px] md:w-[480px]"
    : "sm:w-[320px] md:w-[360px]";

  return (
    <>
      <RemoteAudio stream={remoteStream} preferSpeaker={preferSpeaker} />

      {/* Screen share fullscreen viewer — only shared content */}
      {screenFullscreen && screenStream ? (
        <div className="fixed inset-0 z-[110] flex flex-col bg-black/95">
          <div className="flex items-center justify-between gap-2 px-3 py-2 text-white sm:px-4">
            <p className="truncate text-sm font-medium">
              {screenSharer?.isLocal
                ? "Your screen"
                : `${screenSharer?.fullName || "Member"}'s screen`}
            </p>
            <button
              type="button"
              aria-label="Exit fullscreen"
              onClick={() => setScreenFullscreen(false)}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"
            >
              Exit full screen
            </button>
          </div>
          <div className="min-h-0 flex-1 p-2 sm:p-4">
            <VideoEl stream={screenStream} fit="contain" className="rounded-lg" />
          </div>
        </div>
      ) : null}

      {/* Right-docked panel (desktop) / bottom sheet (mobile) — CRM stays visible */}
      <div
        ref={panelDrag.ref}
        style={
          panelDrag.pos
            ? {
                left: panelDrag.pos.left,
                top: panelDrag.pos.top,
                right: "auto",
                bottom: "auto",
                width: panelExpanded
                  ? "min(480px, calc(100vw - 16px))"
                  : "min(360px, calc(100vw - 16px))",
                height: "min(78vh, calc(100dvh - 24px))",
                maxHeight: "min(78vh, calc(100dvh - 24px))",
              }
            : undefined
        }
        className={`fixed z-[100] flex flex-col overflow-hidden border border-zinc-700/80 bg-zinc-950 text-white shadow-2xl
          ${
            panelDrag.pos
              ? "rounded-2xl"
              : `inset-x-3 bottom-3 max-h-[min(78vh,640px)] rounded-2xl
          sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-20 sm:max-h-none sm:rounded-2xl
          ${panelWidth}
          w-auto`
          }`}
        role="dialog"
        aria-label="Call"
      >
        {/* Header — press and drag to move anywhere on screen */}
        <div
          onPointerDown={panelDrag.onPointerDown}
          className="flex shrink-0 cursor-grab items-center gap-2 border-b border-white/10 px-3 py-2.5 active:cursor-grabbing select-none touch-none"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-[11px] text-zinc-400">{subtitle}</p>
          </div>
          {inCallUi ? (
            <button
              type="button"
              data-no-drag
              aria-label={panelExpanded ? "Compact panel" : "Widen panel"}
              className="hidden rounded-lg p-1.5 text-zinc-300 hover:bg-white/10 sm:inline-flex"
              onClick={() => setPanelExpanded((v) => !v)}
            >
              {panelExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          ) : null}
          <button
            type="button"
            data-no-drag
            aria-label="Minimize call"
            className="rounded-lg p-1.5 text-zinc-300 hover:bg-white/10"
            onClick={() => setMinimized(true)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {call.status === "incoming" ? (
            <div className="flex flex-col items-center gap-3 px-4 py-6">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-3xl font-bold ring-2 ring-white/10">
                {call.groupImage || call.peer?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={call.groupImage || call.peer?.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarLetter
                )}
              </div>
              <div className="text-center">
                <p className="text-base font-semibold">{name}</p>
                <p className="mt-1 text-xs text-zinc-400">{status}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2.5">
              {screenStream ? (
                <div className="relative overflow-hidden rounded-xl bg-black ring-1 ring-sky-500/40">
                  <div className="aspect-video w-full">
                    <VideoEl stream={screenStream} fit="contain" />
                  </div>
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent p-2">
                    <p className="truncate text-[11px] font-medium text-sky-200">
                      {screenSharer?.isLocal
                        ? "You are sharing"
                        : `${screenSharer?.fullName?.split(" ")[0] || "Member"} sharing`}
                    </p>
                    <button
                      type="button"
                      onClick={() => setScreenFullscreen(true)}
                      className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-[10px] font-medium hover:bg-white/25"
                    >
                      <Expand className="h-3 w-3" />
                      Full screen
                    </button>
                  </div>
                </div>
              ) : null}

              <div
                className={`grid gap-1.5 ${
                  gridParticipants.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-2"
                }`}
              >
                {gridParticipants.map((p) => {
                  const isScreen =
                    screenSharer &&
                    String(screenSharer.userId) === String(p.userId);
                  return (
                    <ParticipantTile
                      key={p.userId}
                      participant={p}
                      speaking={String(speakingId) === String(p.userId)}
                      isVideoCall={isVideo}
                      cameraOff={cameraOff}
                      isLocal={Boolean(p.isLocal)}
                      compact
                      isScreen={Boolean(isScreen)}
                      onOpenScreen={
                        isScreen ? () => setScreenFullscreen(true) : undefined
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {!isVideo && !supportsSinkId && inCallUi ? (
          <p className="shrink-0 px-3 pb-1 text-center text-[10px] text-zinc-500">
            Audio playing on loudspeaker · connect a headset for earpiece/privacy
          </p>
        ) : null}

        {/* Controls */}
        <div className="flex shrink-0 items-center justify-center gap-3 border-t border-white/10 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {call.status === "incoming" ? (
            <>
              <button
                type="button"
                aria-label="Decline"
                onClick={rejectIncoming}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-95"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Accept"
                onClick={acceptIncoming}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95"
              >
                <PhoneCall className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={toggleMute}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                  muted ? "bg-zinc-600" : "bg-zinc-800"
                }`}
              >
                {muted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>
              {isVideo ? (
                <button
                  type="button"
                  aria-label={cameraOff ? "Camera on" : "Camera off"}
                  onClick={toggleCamera}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                    cameraOff ? "bg-zinc-600" : "bg-zinc-800"
                  }`}
                >
                  {cameraOff ? (
                    <VideoOff className="h-4 w-4" />
                  ) : (
                    <Video className="h-4 w-4" />
                  )}
                </button>
              ) : supportsSinkId ? (
                <button
                  type="button"
                  aria-label={
                    preferSpeaker ? "Switch to earpiece" : "Switch to speaker"
                  }
                  onClick={() => setPreferSpeaker((v) => !v)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                    preferSpeaker ? "bg-sky-500" : "bg-zinc-800"
                  }`}
                >
                  {preferSpeaker ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <Volume1 className="h-4 w-4" />
                  )}
                </button>
              ) : null}
              <button
                type="button"
                aria-label="Screen share"
                onClick={toggleScreenShare}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  sharing
                    ? "bg-sky-500 text-white"
                    : "bg-zinc-800 text-white"
                }`}
              >
                <MonitorUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="End call"
                onClick={endCall}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-95"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
