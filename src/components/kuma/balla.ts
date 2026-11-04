"use client";

// Effets sonores « balafon » synthétisés (WebAudio) — notes pentatoniques douces
// Aucun fichier audio requis ; volume discret, activable/désactivable.

let ctx: AudioContext | null = null;
let enabled = true;

export function setBallaEnabled(v: boolean) {
  enabled = v;
}

export function isBallaEnabled() {
  return enabled;
}

// gamme pentatonique (fréquences Hz) — timbre lamelle de bois
const SCALE = [523.25, 587.33, 659.25, 783.99, 880.0];

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function pluck(freq: number, when: number, vol: number) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  const t = ac.currentTime + when;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.5);
}

export function balla(intensity: "small" | "big" = "small") {
  if (!enabled) return;
  if (intensity === "small") {
    pluck(SCALE[Math.floor(Math.random() * SCALE.length)], 0, 0.12);
  } else {
    // petite cascade descendante
    [0, 2, 4, 1].forEach((i, k) => pluck(SCALE[i], k * 0.09, 0.1));
  }
}
