"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Mic, Pause, Play } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import Ticks from "@/app/_Components/chat/ChatTicks";
import { formatDuration } from "@/app/_Components/chat/chatUtils";

/** WhatsApp-style voice note — CRM zinc colors + consecutive auto-play */
function VoicePlayer({
  messageId,
  url,
  duration,
  mine = false,
  avatarSrc,
  avatarName,
  timeLabel = "",
  receiptStatus = null,
  activeVoiceId = null,
  onRequestPlay,
  onStopChain,
  onEnded,
}) {
  const audioRef = useRef(null);
  const barRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(Number(duration) || 0);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const bars = useMemo(() => {
    const seed = String(url || "voice")
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return Array.from({ length: 36 }, (_, i) => {
      const n = Math.sin(seed * 0.7 + i * 1.55) * 0.5 + 0.5;
      return 0.28 + n * 0.72;
    });
  }, [url]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return undefined;

    const sync = () => {
      const dur =
        a.duration && !Number.isNaN(a.duration) && Number.isFinite(a.duration)
          ? a.duration
          : Number(duration) || 0;
      setTotal(dur);
      setCurrent(a.currentTime || 0);
    };

    const handleEnded = () => {
      setPlaying(false);
      setCurrent(0);
      a.currentTime = 0;
      onEndedRef.current?.(messageId);
    };

    a.addEventListener("timeupdate", sync);
    a.addEventListener("loadedmetadata", sync);
    a.addEventListener("durationchange", sync);
    a.addEventListener("ended", handleEnded);
    a.addEventListener("play", () => setPlaying(true));
    a.addEventListener("pause", () => setPlaying(false));
    sync();

    return () => {
      a.removeEventListener("timeupdate", sync);
      a.removeEventListener("loadedmetadata", sync);
      a.removeEventListener("durationchange", sync);
      a.removeEventListener("ended", handleEnded);
    };
  }, [url, duration, messageId]);

  // Active voice control: play me / pause others (WhatsApp consecutive chain)
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !messageId) return undefined;

    if (activeVoiceId === messageId) {
      a.playbackRate = speed;
      if (a.paused) {
        a.play().catch((err) => {
          console.error("[voice] auto-play failed", err);
        });
      }
    } else if (!a.paused) {
      a.pause();
    }
    return undefined;
  }, [activeVoiceId, messageId, speed]);

  const progress = total > 0 ? Math.min(1, current / total) : 0;
  const label =
    playing || current > 0.12
      ? formatDuration(current)
      : formatDuration(total || duration);

  const seekFromEvent = (clientX) => {
    const a = audioRef.current;
    const el = barRef.current;
    if (!a || !el || !total) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    a.currentTime = ratio * total;
    setCurrent(ratio * total);
  };

  const toggle = async () => {
    const a = audioRef.current;
    if (!a || !url) return;
    try {
      if (a.paused || activeVoiceId !== messageId) {
        onRequestPlay?.(messageId);
        a.playbackRate = speed;
        await a.play();
      } else {
        a.pause();
        onStopChain?.();
      }
    } catch (err) {
      console.error("[voice] play failed", err);
      toast.error("Could not play voice note");
      onStopChain?.();
    }
  };

  // mine = dark zinc bubble → light wave; received = white → dark wave
  const playBtn = mine
    ? "bg-white text-zinc-900"
    : "bg-zinc-900 text-white";
  const barOn = mine ? "bg-white" : "bg-zinc-800";
  const barOff = mine ? "bg-white/35" : "bg-zinc-300";
  const thumb = mine ? "bg-white" : "bg-zinc-900";
  const meta = mine ? "text-zinc-300" : "text-zinc-500";
  const micBadge = mine
    ? "bg-zinc-950 text-white ring-2 ring-zinc-700"
    : "bg-zinc-800 text-white ring-2 ring-white";

  return (
    <div className="flex items-center gap-2 py-1 pr-1 min-w-[220px] max-w-[280px]">
      <audio ref={audioRef} src={url} preload="metadata" />

      <ChatTooltip label={playing ? "Pause" : "Play"} side="top">
        <button
          type="button"
          onClick={toggle}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${playBtn}`}
        >
          {playing ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current ml-0.5" />
          )}
        </button>
      </ChatTooltip>

      <div className="min-w-0 flex-1">
        <div
          ref={barRef}
          role="slider"
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
          className="relative flex h-7 cursor-pointer items-center gap-px"
          onClick={(e) => seekFromEvent(e.clientX)}
          onKeyDown={(e) => {
            const a = audioRef.current;
            if (!a || !total) return;
            if (e.key === "ArrowRight") {
              a.currentTime = Math.min(total, a.currentTime + 1);
              setCurrent(a.currentTime);
            }
            if (e.key === "ArrowLeft") {
              a.currentTime = Math.max(0, a.currentTime - 1);
              setCurrent(a.currentTime);
            }
          }}
        >
          {bars.map((h, i) => {
            const filled = i / bars.length <= progress;
            return (
              <span
                key={i}
                className={`w-[2.5px] flex-1 max-w-[3px] rounded-full ${
                  filled ? barOn : barOff
                }`}
                style={{ height: `${Math.round(h * 100)}%` }}
              />
            );
          })}
          <span
            className={`pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full shadow ${thumb} ${
              playing || current > 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{ left: `${progress * 100}%` }}
          />
        </div>
        <div
          className={`mt-0.5 grid grid-cols-[auto_auto_1fr_auto] items-center gap-x-1.5 ${meta}`}
        >
          <span className="text-[11px] tabular-nums leading-none">{label}</span>
          <ChatTooltip label={`Speed ${speed}x`} side="top">
            <button
              type="button"
              className={`text-[11px] font-semibold leading-none px-0.5 rounded ${meta}`}
              onClick={(e) => {
                e.stopPropagation();
                const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
                setSpeed(next);
                if (audioRef.current) audioRef.current.playbackRate = next;
              }}
            >
              {speed}x
            </button>
          </ChatTooltip>
          <span />
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] tabular-nums leading-none">
            {timeLabel}
            {receiptStatus ? <Ticks status={receiptStatus} soft /> : null}
          </span>
        </div>
      </div>

      <div className="relative shrink-0">
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            {(avatarName || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ${micBadge}`}
        >
          <Mic className="h-2 w-2" strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}

export default memo(VoicePlayer);
