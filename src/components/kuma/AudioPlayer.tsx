"use client";

// Lecteur de l'enregistrement audio d'un récit (public/audio/<slug>.mp3).
// Si le fichier n'existe pas, rien n'est affiché. La lecture du texte français
// à voix haute est assurée par FrenchVoice.tsx.

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";

function fmt(t: number): string {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ slug, lang }: { slug: string; lang?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [exists, setExists] = useState<boolean | null>(null); // fichier mp3 dispo ?
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  // Vérifie l'existence du fichier de narration (le composant est remonté à chaque récit via key)
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
      // coupe la lecture vocale française si elle est en cours
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      void el.play();
    } else {
      el.pause();
    }
  };

  const seek = (v: number) => {
    const el = audioRef.current;
    if (el && isFinite(el.duration)) {
      el.currentTime = v;
    }
  };

  // Pas d'enregistrement pour ce récit : on n'affiche pas de lecteur vide.
  if (exists === false) return null;
  const active = exists === true;

  return (
    <div className="rounded-xl border bg-card/80 backdrop-blur px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          onClick={toggle}
          disabled={!active}
          aria-label={playing ? "Mettre en pause la narration" : "Écouter la narration"}
          className="shrink-0 rounded-full h-11 w-11"
        >
          {exists === null && exists !== false ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : playing ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="truncate font-medium text-foreground/80">
              {lang ? `Conte en ${lang}` : "Bande sonore"}
            </span>
            <span className="tabular-nums">
              {exists ? `${fmt(time)} / ${fmt(dur)}` : ""}
            </span>
          </div>
          {exists ? (
            <input
              type="range"
              min={0}
              max={dur || 1}
              step={0.1}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Position de lecture"
              className="w-full accent-[var(--terre)]"
            />
          ) : (
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-[var(--terre)]/70 transition-all"
                style={{ width: playing ? "100%" : "8%", animation: playing ? "k-glow 1.6s ease-in-out infinite" : undefined }}
              />
            </div>
          )}
        </div>
        <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
      </div>
      {exists && (
        <audio
          ref={audioRef}
          src={`/audio/${slug}.mp3`}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        />
      )}
    </div>
  );
}
