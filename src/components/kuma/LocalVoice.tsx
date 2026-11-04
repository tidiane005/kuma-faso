"use client";

// Panneau « langue nationale » du lecteur de récit :
// l'enregistrement audio du conte (public/audio/<slug>.mp3) et l'accès au texte
// dans la langue d'origine. Placé à droite sur ordinateur, en haut sur téléphone.

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2, RotateCcw } from "lucide-react";

function fmt(t: number): string {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const RATES = [
  { v: 0.85, label: "Lent" },
  { v: 1, label: "Normal" },
  { v: 1.2, label: "Rapide" },
];

/** Deux lettres affichées dans la pastille de la langue. */
function initials(lang: string | null): string {
  if (!lang) return "LN";
  const map: Record<string, string> = { Dioula: "DI", Mooré: "MO", Fulfulde: "FU" };
  return map[lang] ?? lang.slice(0, 2).toUpperCase();
}

interface Props {
  slug: string;
  lang: string | null;
  hasLocalText: boolean;
  textShown: boolean;
  onShowText: () => void;
  /** Position dans l'enregistrement (0 à 1) et état de lecture, pour animer la scène. */
  onProgress?: (fraction: number, playing: boolean) => void;
}

export default function LocalVoice({ slug, lang, hasLocalText, textShown, onShowText, onProgress }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);

  // Le composant est remonté à chaque récit (prop key) : une seule vérification.
  useEffect(() => {
    let cancelled = false;
    fetch(`/audio/${slug}.mp3`, { method: "HEAD" })
      .then((r) => !cancelled && setExists(r.ok))
      .catch(() => !cancelled && setExists(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      // coupe la lecture française si elle est en cours
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (hasLocalText) onShowText();
      el.playbackRate = rate;
      void el.play();
    } else {
      el.pause();
    }
  };

  const changeRate = (v: number) => {
    setRate(v);
    if (audioRef.current) audioRef.current.playbackRate = v;
  };

  const restart = () => {
    const el = audioRef.current;
    if (el) el.currentTime = 0;
  };

  const title = lang ? `En ${lang}` : "En langue nationale";

  return (
    <section
      aria-label={`Écouter ${title.toLowerCase()}`}
      className="h-full rounded-2xl border bg-card p-3 lg:p-5 flex flex-col gap-3 lg:gap-4"
    >
      <header className="flex items-center gap-2.5">
        <span className="grid place-items-center h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-[var(--or)]/30 text-[var(--nuit)] dark:text-[var(--or)] text-xs lg:text-sm font-semibold shrink-0">
          {initials(lang)}
        </span>
        <div className="min-w-0">
          <p className="text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground leading-none">Écouter</p>
          <h3 className="font-display text-[15px] lg:text-lg font-semibold leading-tight truncate">{title}</h3>
        </div>
      </header>

      {exists === null && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Recherche de l'enregistrement…
        </p>
      )}

      {exists === false && (
        <p className="text-[11.5px] lg:text-xs text-muted-foreground leading-relaxed">
          Pas encore d'enregistrement pour ce récit.
          <span className="hidden lg:inline"> Vous pouvez en proposer un depuis la page « Contribuer ».</span>
        </p>
      )}

      {exists && (
        <>
          <div className="flex items-center gap-2.5 lg:flex-col lg:items-stretch">
            <Button
              onClick={toggle}
              aria-label={playing ? "Mettre en pause l'enregistrement" : `Écouter le conte ${title.toLowerCase()}`}
              className="shrink-0 rounded-full h-11 w-11 p-0 lg:w-full lg:h-12 lg:rounded-xl lg:gap-2 bg-[var(--nuit)] hover:bg-[var(--nuit)]/90 text-white"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span className="hidden lg:inline text-[15px]">{playing ? "Pause" : "Écouter le conte"}</span>
            </Button>
            <div className="flex-1 min-w-0">
              <input
                id={`seek-${slug}`}
                type="range"
                min={0}
                max={dur || 1}
                step={0.1}
                value={time}
                onChange={(e) => {
                  const el = audioRef.current;
                  if (el && isFinite(el.duration)) el.currentTime = Number(e.target.value);
                }}
                aria-label="Position dans l'enregistrement"
                className="w-full h-1.5 accent-[var(--nuit)] dark:accent-[var(--or)]"
              />
              <p className="mt-1 text-[11.5px] lg:text-xs text-muted-foreground tabular-nums">
                {fmt(time)} / {fmt(dur)}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-2">
            <p className="text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground">Vitesse</p>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Vitesse de l'enregistrement">
              {RATES.map((r) => (
                <button
                  key={r.v}
                  onClick={() => changeRate(r.v)}
                  aria-pressed={rate === r.v}
                  className={`rounded-md py-1.5 text-xs transition-colors ${rate === r.v ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={restart} className="mt-1">
              <RotateCcw className="h-3.5 w-3.5" /> Reprendre au début
            </Button>
          </div>

          <audio
            ref={audioRef}
            src={`/audio/${slug}.mp3`}
            preload="metadata"
            onPlay={(e) => {
              setPlaying(true);
              const el = e.currentTarget;
              onProgress?.(el.duration ? el.currentTime / el.duration : 0, true);
            }}
            onPause={(e) => {
              setPlaying(false);
              const el = e.currentTarget;
              onProgress?.(el.duration ? el.currentTime / el.duration : 0, false);
            }}
            onEnded={() => {
              setPlaying(false);
              onProgress?.(1, false);
            }}
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              setTime(el.currentTime);
              if (el.duration) onProgress?.(el.currentTime / el.duration, !el.paused);
            }}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          />
        </>
      )}

      {hasLocalText && (
        <Button
          variant={textShown ? "secondary" : "outline"}
          size="sm"
          onClick={onShowText}
          disabled={textShown}
          className="hidden lg:inline-flex"
        >
          {textShown ? `Texte en ${lang ?? "langue locale"} affiché` : `Afficher le texte en ${lang ?? "langue locale"}`}
        </Button>
      )}

      <p className="hidden lg:block mt-auto text-xs text-muted-foreground leading-relaxed">
        Enregistrement communautaire, dans la langue d'origine du conte.
      </p>
    </section>
  );
}
