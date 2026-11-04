"use client";

// Récit interactif « Le masque du fleuve » : arbre à choix, drapeaux et trois fins.

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Footprints, Feather, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StoryArt from "./StoryArt";
import { NARRATIVE, NARR_TITLE, NARR_INTRO, NarrNode } from "@/lib/kuma-data";
import { balla } from "./balla";

const NODES: Record<string, NarrNode> = Object.fromEntries(NARRATIVE.map((n) => [n.id, n]));
const START = "debut";
const STORAGE_KEY = "kuma-narr-paths";

function choiceVisible(c: { cond?: string[]; condAny?: string[]; condNot?: string[] }, flags: Set<string>) {
  if (c.cond && !c.cond.every((f) => flags.has(f))) return false;
  if (c.condAny && !c.condAny.some((f) => flags.has(f))) return false;
  if (c.condNot && c.condNot.some((f) => flags.has(f))) return false;
  return true;
}

const ENDING_META: Record<string, { label: string; cls: string }> = {
  bonne: { label: "Fin heureuse — la première pluie", cls: "bg-[var(--karite)] text-white" },
  mitigee: { label: "Fin ouverte — la pluie patiente", cls: "bg-[var(--or)] text-[var(--nuit)]" },
  lecon: { label: "Fin de conte — l'histoire qui coule", cls: "bg-[var(--terre)] text-white" },
};

export default function NarrativeView() {
  const [nodeId, setNodeId] = useState(START);
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<string[]>([START]);
  const [explored, setExplored] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation avec un stockage externe (localStorage)
      if (raw) setExplored(JSON.parse(raw));
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const node = NODES[nodeId] ?? NODES[START];
  const isEnding = !!node.ending;

  const choose = (c: { label: string; to: string; set?: string[] }) => {
    balla("small");
    const next = new Set(flags);
    c.set?.forEach((f) => next.add(f));
    setFlags(next);
    setPath((p) => [...p, c.to]);
    setNodeId(c.to);
    if (NODES[c.to]?.ending) {
      const key = `${c.to}`;
      setExplored((prev) => {
        if (prev.includes(key)) return prev;
        const nx = [...prev, key];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nx));
        } catch {
          /* ignore */
        }
        return nx;
      });
    }
  };

  const restart = useCallback(() => {
    balla("big");
    setNodeId(START);
    setFlags(new Set());
    setPath([START]);
  }, []);

  const visibleChoices = useMemo(
    () => node.choices.filter((c) => choiceVisible(c, flags)),
    [node, flags]
  );

  // petit diagramme du chemin parcouru
  const trail = path.length > 1 ? ` étape ${path.length}` : "";

  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <Badge className="border-0 bg-[var(--terre)] text-white mb-3">Récit interactif</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">{NARR_TITLE}</h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">{NARR_INTRO}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Feather className="h-3.5 w-3.5" aria-hidden /> {explored.length} fin{explored.length > 1 ? "s" : ""} découverte{explored.length > 1 ? "s" : ""} sur 3
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Footprints className="h-3.5 w-3.5" aria-hidden />{trail}
          </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
        {/* Scène narrative */}
        <div className="rounded-2xl border overflow-hidden bg-card paper-card">
          <div className="h-40 sm:h-48 relative">
            <StoryArt
              theme={isEnding ? (node.ending === "bonne" ? "hippo" : node.ending === "lecon" ? "puits" : "dune") : "masque"}
              className="absolute inset-0 w-full h-full"
              ariaLabel="Illustration animée du récit interactif"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={nodeId}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
              >
                {node.title && (
                  <h2 className="font-display text-xl sm:text-2xl font-semibold">{node.title}</h2>
                )}
                {isEnding && node.ending && (
                  <Badge className={`mt-2 border-0 ${ENDING_META[node.ending].cls}`}>
                    <Award className="h-3.5 w-3.5 mr-1" aria-hidden />
                    {ENDING_META[node.ending].label}
                  </Badge>
                )}
                <div className="mt-3 space-y-3.5 text-[15.5px] leading-relaxed text-foreground/90">
                  {node.text.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="mt-6 space-y-2.5">
                  {visibleChoices.map((c, i) => (
                    <motion.button
                      key={c.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i }}
                      onClick={() => choose(c)}
                      className="w-full text-left rounded-xl border bg-background/60 px-4 py-3 text-[14.5px] font-medium hover:border-[var(--terre)] hover:bg-[var(--or)]/15 transition-all flex items-center justify-between gap-3"
                    >
                      <span>{c.label}</span>
                      <span aria-hidden className="text-[var(--terre)]">→</span>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={restart}>
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Recommencer le récit
                  </Button>
                  <p className="text-xs text-muted-foreground">Kuma Faso · conte original</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carnet de bord */}
        <aside className="rounded-2xl border bg-card paper-card p-5 lg:sticky lg:top-20">
          <h3 className="font-display text-lg font-semibold">Carnet de route</h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            Vos choix sculptent le récit : générosité, ruse, patience ou hâte — la brousse retient
            tout et le masque juge l'ensemble de votre marche.
          </p>
          <ol className="mt-4 space-y-2 text-sm">
            {path.map((id, i) => (
              <li key={`${id}-${i}`} className="flex items-start gap-2.5">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[var(--or)]/40 text-[10px] font-bold flex items-center justify-center text-[var(--nuit)]">
                  {i + 1}
                </span>
                <span className={i === path.length - 1 ? "font-medium" : "text-muted-foreground"}>
                  {NODES[id]?.title ?? "…"}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-5 pt-4 border-t">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Fins découvertes
            </p>
            <div className="flex gap-1.5">
              {["bonne", "mitigee", "lecon"].map((k) => (
                <span
                  key={k}
                  title={ENDING_META[k].label}
                  className={`h-2.5 flex-1 rounded-full ${explored.includes(`fin-${k === "bonne" ? "bonne" : k === "mitigee" ? "mitigee" : "lecon"}`) ? "bg-[var(--karite)]" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
