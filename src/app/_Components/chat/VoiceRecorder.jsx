"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Send, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSocket } from "@/app/_Components/Socket/SocketProvider";
import { useUploadChatFileMutation } from "@/app/_Services/chat/chatApi";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";

function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

function extForMime(mime) {
  if (!mime) return "webm";
  if (mime.includes("mp4")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

export default function VoiceRecorder({ conversationId, onSend, onCancel }) {
  const { emit } = useSocket();
  const [uploadFile] = useUploadChatFileMutation();
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sending, setSending] = useState(false);
  const mediaRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const mimeRef = useRef("");
  const stoppedRef = useRef(false);

  useEffect(() => {
    start();
    return () => {
      stoppedRef.current = true;
      cleanupTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanupTracks = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.stop();
      }
    } catch {
      /* ignore */
    }
    streamRef.current?.getTracks?.()?.forEach((t) => t.stop());
    streamRef.current = null;
    emit("chat:recording", { conversationId, isRecording: false });
  };

  const start = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast.error("Microphone not supported in this browser");
        onCancel?.();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stoppedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const mime = pickMimeType();
      mimeRef.current = mime;
      const mr = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRef.current = mr;
      mr.start(250);
      setRecording(true);
      emit("chat:recording", { conversationId, isRecording: true });
      secondsRef.current = 0;
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
    } catch (err) {
      console.error("[voice] mic error", err);
      toast.error("Microphone permission denied");
      onCancel?.();
    }
  };

  const pause = () => {
    const mr = mediaRef.current;
    if (!mr) return;
    try {
      if (paused) {
        if (mr.state === "paused") mr.resume();
        timerRef.current = setInterval(() => {
          secondsRef.current += 1;
          setSeconds(secondsRef.current);
        }, 1000);
        setPaused(false);
      } else {
        if (mr.state === "recording") mr.pause();
        if (timerRef.current) clearInterval(timerRef.current);
        setPaused(true);
      }
    } catch {
      toast.error("Pause not supported — tap send when done");
    }
  };

  const stopToBlob = () =>
    new Promise((resolve, reject) => {
      const mr = mediaRef.current;
      if (!mr) {
        reject(new Error("Recorder not ready"));
        return;
      }
      if (mr.state === "inactive") {
        const mime = mimeRef.current || "audio/webm";
        resolve(new Blob(chunksRef.current, { type: mime }));
        return;
      }
      mr.onstop = () => {
        const mime = mimeRef.current || mr.mimeType || "audio/webm";
        resolve(new Blob(chunksRef.current, { type: mime.split(";")[0] }));
      };
      try {
        if (mr.state === "paused") mr.resume();
        mr.requestData?.();
        mr.stop();
      } catch (err) {
        reject(err);
      }
    });

  const cancel = () => {
    cleanupTracks();
    onCancel?.();
  };

  const finishAndSend = async () => {
    if (sending) return;
    if (secondsRef.current < 1 && chunksRef.current.length === 0) {
      toast.error("Hold a bit longer before sending");
      return;
    }
    setSending(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      const blob = await stopToBlob();
      streamRef.current?.getTracks?.()?.forEach((t) => t.stop());
      streamRef.current = null;
      emit("chat:recording", { conversationId, isRecording: false });
      setRecording(false);

      if (!blob || blob.size < 100) {
        toast.error("Recording too short");
        onCancel?.();
        return;
      }

      const mime = (blob.type || mimeRef.current || "audio/webm").split(";")[0];
      const ext = extForMime(mime);
      const file = new File([blob], `voice-${Date.now()}.${ext}`, {
        type: mime,
      });

      const fd = new FormData();
      fd.append("file", file);

      const res = await uploadFile(fd).unwrap();
      const attachment = res?.data?.attachment;
      if (!attachment?.url) {
        throw new Error(res?.message || "Upload failed");
      }

      onSend?.({
        type: "voice",
        body: "",
        attachments: [
          {
            ...attachment,
            mimeType: attachment.mimeType || mime,
            duration: secondsRef.current,
          },
        ],
      });
    } catch (err) {
      console.error("[voice] send failed", err);
      toast.error(err?.data?.message || err?.message || "Voice send failed");
      onCancel?.();
    } finally {
      setSending(false);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 rounded-3xl bg-white px-3 py-2 shadow-sm">
      <ChatTooltip label="Cancel" side="top">
        <button
          type="button"
          onClick={cancel}
          disabled={sending}
          className="rounded-full p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </ChatTooltip>
      <div className="flex flex-1 items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            paused ? "bg-zinc-400" : "bg-red-500 animate-pulse"
          }`}
        />
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full bg-zinc-900 transition-all"
            style={{ width: `${Math.min(100, (seconds / 120) * 100)}%` }}
          />
        </div>
        <span className="tabular-nums text-sm font-medium text-zinc-600">
          {mm}:{ss}
        </span>
      </div>
      {recording && !sending && (
        <ChatTooltip label={paused ? "Resume" : "Pause"} side="top">
          <button
            type="button"
            onClick={pause}
            className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </ChatTooltip>
      )}
      <ChatTooltip label="Send voice" side="top">
        <button
          type="button"
          disabled={sending}
          onClick={finishAndSend}
          className="rounded-full bg-zinc-950 p-2.5 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </ChatTooltip>
    </div>
  );
}
