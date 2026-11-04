"use client";

// Lecture à voix haute du texte français d'un récit (synthèse vocale du navigateur).
//
// Pourquoi ce composant est découpé ainsi :
// - Chrome coupe une phrase lue au-delà d'environ 15 secondes : le texte est donc
//   découpé en petits morceaux (phrases) lus l'un après l'autre.
// - Les voix se chargent parfois après l'ouverture de la page : on écoute
//   l'événement « voiceschanged » avant de choisir une voix française.
// - pause()/resume() ne fonctionnent pas sur Android : la pause arrête la lecture
//   et la reprise repart du morceau en cours.
// - Chrome peut « oublier » un énoncé en cours (ramasse-miettes) : on garde une
//   référence vers l'énoncé courant.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";

interface Chunk {
  text: string;
  para: number; // index du paragraphe (-1 = morale)
}

/** Découpe le texte en morceaux d'au plus ~180 caractères, en respectant les phrases. */
function toChunks(paragraphs: string[], moral?: string | null): Chunk[] {
  const out: Chunk[] = [];
  const push = (txt: string, para: number) => {
    const sentences = txt
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?…»]+[.!?…»]*\s*/g) ?? [txt];
    let buf = "";
    for (const s of sentences) {
      if ((buf + s).length > 180 && buf) {
        out.push({ text: buf.trim(), para });
        buf = "";
      }
      if (s.length > 180) {
        // phrase très longue : on coupe aux virgules
        const parts = s.split(/(?<=[,;:])\s+/);
        for (const p of parts) {
          if ((buf + p).length > 180 && buf) {
            out.push({ text: buf.trim(), para });
            buf = "";
          }
          buf += p + " ";
        }
      } else {
        buf += s;
      }
    }
    if (buf.trim()) out.push({ text: buf.trim(), para });
  };
  paragraphs.forEach((p, i) => p.trim() && push(p, i));
  if (moral) push(`La sagesse du récit : ${moral}`, -1);
  return out;
}

function pickFrenchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith("fr"));
  if (!voices.length) return null;
  const score = (v: SpeechSynthesisVoice) =>
    (v.lang.toLowerCase() === "fr-fr" ? 4 : 0) +
    (/google|microsoft|natural|online|amélie|thomas|audrey/i.test(v.name) ? 2 : 0) +
    (v.localService ? 1 : 0);
  return [...voices].sort((a, b) => score(b) - score(a))[0];
}

interface Props {
  paragraphs: string[];
  moral?: string | null;
  /** Indique au lecteur quel paragraphe est en cours de lecture (null = aucun). */
  onParagraph?: (index: number | null) => void;
  /** Le texte français est-il celui affiché au centre ? */
  textShown?: boolean;
  /** Affiche le texte français au centre. */
  onShowText?: () => void;
}

const RATES = [
  { v: 0.8, label: "Lent" },
  { v: 0.95, label: "Normal" },
  { v: 1.15, label: "Rapide" },
];

export default function FrenchVoice({ paragraphs, moral, onParagraph, textShown = true, onShowText }: Props) {
  const chunks = useMemo(() => toChunks(paragraphs, moral), [paragraphs, moral]);
  // Le lecteur de récit ne s'affiche qu'après un clic : window existe toujours ici.
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [pos, setPos] = useState(0);
  const posRef = useRef(0);
  const runId = useRef(0);
  const current = useRef<SpeechSynthesisUtterance | null>(null);
  const [rate, setRate] = useState(0.95);
  const rateRef = useRef(0.95);

  // Détection du support et chargement des voix
  useEffect(() => {
    if (!supported) return;
    const load = () => setVoice(pickFrenchVoice());
    const t = window.setTimeout(load, 0);
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.clearTimeout(t);
      window.speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, [supported]);

  const stopSpeech = useCallback(() => {
    runId.current++;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    current.current = null;
  }, []);

  // Arrêt propre quand on change de récit ou qu'on ferme le lecteur
  // (le composant est remonté à chaque récit grâce à sa prop key)
  useEffect(() => {
    return () => {
      stopSpeech();
      onParagraph?.(null);
    };
  }, [chunks, stopSpeech]);

  const speakFrom = useCallback(
    (start: number) => {
      const synth = window.speechSynthesis;
      stopSpeech();
      const id = runId.current;
      const v = pickFrenchVoice() ?? voice;

      const speakOne = (i: number) => {
        if (id !== runId.current) return; // une autre lecture a pris le relais
        if (i >= chunks.length) {
          posRef.current = 0;
          setPos(0);
          setState("idle");
          onParagraph?.(null);
          return;
        }
        posRef.current = i;
        setPos(i);
        onParagraph?.(chunks[i].para);
        const u = new SpeechSynthesisUtterance(chunks[i].text);
        u.lang = v?.lang ?? "fr-FR";
        if (v) u.voice = v;
        u.rate = rateRef.current;
        u.pitch = 1;
        u.onend = () => speakOne(i + 1);
        u.onerror = (e) => {
          // « interrupted » / « canceled » = arrêt volontaire, pas une erreur
          if (e.error === "interrupted" || e.error === "canceled") return;
          speakOne(i + 1);
        };
        current.current = u;
        synth.speak(u);
      };

      // coupe un enregistrement audio en cours
      document.querySelectorAll("audio").forEach((a) => a.pause());
      setState("playing");
      // Petit délai : Chrome ignore parfois un speak() juste après cancel()
      window.setTimeout(() => {
        synth.resume();
        speakOne(start);
      }, 120);
    },
    [chunks, voice, stopSpeech, onParagraph]
  );

  const onPlay = () => {
    onShowText?.();
    speakFrom(state === "paused" ? posRef.current : 0);
  };
  const changeRate = (v: number) => {
    rateRef.current = v;
    setRate(v);
    // relance le passage en cours à la nouvelle vitesse
    if (state === "playing") speakFrom(posRef.current);
  };
  const onPause = () => {
    stopSpeech();
    setState("paused");
  };
  const onStop = () => {
    stopSpeech();
    posRef.current = 0;
    setPos(0);
    setState("idle");
    onParagraph?.(null);
  };

  const progress = chunks.length ? Math.round(((state === "idle" ? 0 : pos + 1) / chunks.length) * 100) : 0;
  const status =
    state === "playing" ? `Passage ${pos + 1} sur ${chunks.length}` : state === "paused" ? "En pause" : `${chunks.length} passages`;

  return (
    <section
      aria-label="Lecture en français"
      className="h-full rounded-2xl border bg-card p-3 lg:p-5 flex flex-col gap-3 lg:gap-4"
    >
      <header className="flex items-center gap-2.5">
        <span className="grid place-items-center h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-[var(--terre)]/12 text-[var(--terre)] text-xs lg:text-sm font-semibold shrink-0">
          FR
        </span>
        <div className="min-w-0">
          <p className="text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground leading-none">Écouter</p>
          <h3 className="font-display text-[15px] lg:text-lg font-semibold leading-tight truncate">En français</h3>
        </div>
      </header>

      {!supported ? (
        <p className="text-xs text-muted-foreground">
          La lecture vocale n'est pas disponible dans ce navigateur. Essayez Chrome, Edge ou Safari.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2.5 lg:flex-col lg:items-stretch">
            <Button
              onClick={state === "playing" ? onPause : onPlay}
              aria-label={state === "playing" ? "Mettre en pause" : state === "paused" ? "Reprendre la lecture" : "Lire le récit en français"}
              className="shrink-0 rounded-full h-11 w-11 p-0 lg:w-full lg:h-12 lg:rounded-xl lg:gap-2 bg-[var(--terre)] hover:bg-[var(--terre)]/90 text-white"
            >
              {state === "playing" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span className="hidden lg:inline text-[15px]">
                {state === "playing" ? "Pause" : state === "paused" ? "Reprendre" : "Écouter le récit"}
              </span>
            </Button>
            <div className="flex-1 min-w-0">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-[var(--terre)] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1.5 text-[11.5px] lg:text-xs text-muted-foreground tabular-nums truncate">
                <span className="lg:hidden">{state === "idle" ? "Prêt" : state === "paused" ? "En pause" : `${pos + 1} / ${chunks.length}`}</span>
                <span className="hidden lg:inline">{status}</span>
              </p>
            </div>
            {state !== "idle" && (
              <Button size="icon" variant="ghost" onClick={onStop} aria-label="Arrêter la lecture" className="shrink-0 h-9 w-9 lg:hidden">
                <Square className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="hidden lg:flex flex-col gap-2">
            <p className="text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground">Vitesse</p>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Vitesse de lecture">
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
            {state !== "idle" && (
              <Button variant="outline" size="sm" onClick={onStop} className="mt-1">
                <Square className="h-3.5 w-3.5" /> Arrêter
              </Button>
            )}
          </div>

          {onShowText && (
            <Button
              variant={textShown ? "secondary" : "outline"}
              size="sm"
              onClick={onShowText}
              disabled={textShown}
              className="hidden lg:inline-flex"
            >
              {textShown ? "Texte français affiché" : "Afficher le texte français"}
            </Button>
          )}

          {!voice && (
            <p className="hidden lg:block text-xs text-muted-foreground">
              Aucune voix française trouvée sur cet appareil : la voix par défaut sera utilisée.
            </p>
          )}
          <p className="hidden lg:block mt-auto text-xs text-muted-foreground leading-relaxed">
            Le passage lu est surligné dans le texte, qui défile tout seul.
          </p>
        </>
      )}
    </section>
  );
}
