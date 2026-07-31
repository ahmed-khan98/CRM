/**
 * Soft professional notification tone (Slack/Teams-like).
 * HTMLAudioElement + embedded WAV for reliable browser playback.
 */

let audioEl = null;
let unlocked = false;

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i += 1) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/** Soft ADSR-ish envelope 0..1 */
function envelope(t, attack, hold, release, total) {
  if (t < 0 || t > total) return 0;
  if (t < attack) return t / attack;
  if (t < attack + hold) return 1;
  const r = (t - attack - hold) / release;
  return Math.max(0, 1 - r);
}

/** Soft sine + quiet octave harmonic */
function softTone(freq, t) {
  return (
    Math.sin(2 * Math.PI * freq * t) * 0.72 +
    Math.sin(2 * Math.PI * freq * 2 * t) * 0.18 +
    Math.sin(2 * Math.PI * freq * 3 * t) * 0.06
  );
}

/** Build a short polished notification WAV as a data URI */
function buildChimeDataUri() {
  const sampleRate = 44100;
  const duration = 0.55;
  const numSamples = Math.floor(sampleRate * duration);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Soft ascending triad: G4 → C5 → E5 (warm, professional)
  const notes = [
    { freq: 392.0, start: 0.0, len: 0.28 },
    { freq: 523.25, start: 0.1, len: 0.3 },
    { freq: 659.25, start: 0.2, len: 0.32 },
  ];

  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate;
    let sample = 0;

    notes.forEach(({ freq, start, len }) => {
      const local = t - start;
      if (local < 0 || local > len) return;
      const env = envelope(local, 0.012, 0.08, len - 0.092, len);
      sample += softTone(freq, local) * env * 0.28;
    });

    // Gentle low-pass feel: slight attenuation of harsh peaks already via harmonics mix
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, clamped * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function getAudio() {
  if (typeof window === "undefined") return null;
  if (!audioEl) {
    audioEl = new Audio(buildChimeDataUri());
    audioEl.preload = "auto";
    audioEl.volume = 0.65;
  }
  return audioEl;
}

/** Must run after a user click/key so the browser allows playback */
export function unlockNotificationAudio() {
  const audio = getAudio();
  if (!audio) return;
  if (unlocked) return;

  audio.muted = true;
  audio.volume = 0.01;
  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
        audio.volume = 0.65;
        unlocked = true;
      })
      .catch(() => {
        audio.muted = false;
        audio.volume = 0.65;
      });
  } else {
    audio.muted = false;
    audio.volume = 0.65;
    unlocked = true;
  }
}

export function playNotificationSound() {
  if (typeof window === "undefined") return;

  try {
    if (audioEl && audioEl.dataset?.tone !== "pro-v2") {
      audioEl = null;
      unlocked = false;
    }

    const audio = getAudio();
    if (!audio) return;
    audio.dataset.tone = "pro-v2";

    audio.muted = false;
    audio.volume = 0.65;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        unlocked = false;
        unlockNotificationAudio();
        setTimeout(() => {
          try {
            audio.muted = false;
            audio.currentTime = 0;
            audio.play().catch(() => {});
          } catch {
            /* ignore */
          }
        }, 100);
      });
    }
  } catch {
    /* ignore */
  }
}
