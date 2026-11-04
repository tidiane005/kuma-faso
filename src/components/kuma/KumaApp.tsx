"use client";

// Coquille de l'application : navigation, vues, lecteur global, effets sonores.

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Map, BookOpen, Wand2, Languages, Send, Info, Home, Volume2, VolumeX } from "lucide-react";
import StoryReader from "./StoryReader";
import AccueilView from "./AccueilView";
import MapView from "./MapView";
import ContesView from "./ContesView";
import NarrativeView from "./NarrativeView";
import LanguagesView from "./LanguagesView";
import ContributeView from "./ContributeView";
import AboutView from "./AboutView";
import { StoryRecord } from "@/lib/kuma-data";
import { SITE } from "@/content/site";
import { balla, setBallaEnabled } from "./balla";

const VIEWS = [
  { id: "accueil", label: "Accueil", icon: Home },
  { id: "carte", label: "Carte", icon: Map },
  { id: "contes", label: "Contes", icon: BookOpen },
  { id: "recit", label: "Récit interactif", icon: Wand2 },
  { id: "langues", label: "Langues", icon: Languages },
  { id: "contribuer", label: "Contribuer", icon: Send },
  { id: "apropos", label: "À propos", icon: Info },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

function viewFromHash(): ViewId {
  const h = (typeof window !== "undefined" ? window.location.hash : "").replace(/^#\/?/, "").split("?")[0];
  return (VIEWS.find((v) => v.id === h)?.id ?? "accueil") as ViewId;
}

// Logo : masque stylisé
function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="19" fill="var(--terre)" />
      <path d="M12 13 q8 -6 16 0 q2 12 -8 17 q-10 -5 -8 -17 Z" fill="#F5E6CE" />
      <path d="M15.5 17 l4 -2 l-0.5 5 Z M24.5 17 l-4 -2 l0.5 5 Z" fill="var(--terre)" />
      <path d="M16 25 l4 3 l4 -3" stroke="var(--terre)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function KumaApp({
  stories,
}: {
  stories: StoryRecord[];
}) {
  const [view, setView] = useState<ViewId>("accueil");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [sfx, setSfx] = useState(true);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((v: string) => {
    window.location.hash = `/${v}`;
    setView(v as ViewId);
    // remonter en haut de page au changement de vue
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }, []);

  const story = useMemo(() => stories.find((s) => s.slug === openSlug) ?? null, [openSlug, stories]);

  const openStory = useCallback((slug: string) => setOpenSlug(slug), []);

  const navigateStory = useCallback(
    (slug: string) => setOpenSlug(slug),
    []
  );

  const toggleSfx = () => {
    const v = !sfx;
    setSfx(v);
    setBallaEnabled(v);
    if (v) balla("small");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ---------- En-tête ---------- */}
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button onClick={() => navigate("accueil")} className="flex items-center gap-2.5 shrink-0" aria-label={`${SITE.name} — accueil`}>
            <LogoMark className="h-9 w-9" />
            <span className="font-display text-xl font-bold tracking-tight">
              {SITE.name.split(" ")[0]}
              <span className="text-[var(--terre)]"> {SITE.name.split(" ").slice(1).join(" ")}</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-0.5" aria-label="Navigation principale">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  balla("small");
                  navigate(id);
                }}
                aria-current={view === id ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                  view === id
                    ? "bg-[var(--terre)] text-white"
                    : "text-foreground/75 hover:bg-[var(--or)]/25 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
              </button>
            ))}
          </nav>

          <button
            onClick={toggleSfx}
            aria-label={sfx ? "Couper les sons d'ambiance" : "Activer les sons d'ambiance"}
            className="rounded-full p-2 hover:bg-[var(--or)]/25 transition-colors shrink-0"
          >
            {sfx ? <Volume2 className="h-4.5 w-4.5" aria-hidden /> : <VolumeX className="h-4.5 w-4.5" aria-hidden />}
          </button>
        </div>
        {/* navigation mobile */}
        <nav className="md:hidden border-t overflow-x-auto" aria-label="Navigation mobile">
          <div className="flex gap-1 px-3 py-2 w-max">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  balla("small");
                  navigate(id);
                }}
                aria-current={view === id ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors ${
                  view === id ? "bg-[var(--terre)] text-white" : "text-foreground/75 bg-[var(--or)]/15"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* ---------- Contenu ---------- */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-7 sm:py-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {view === "accueil" && (
              <AccueilView stories={stories} onNavigate={navigate} onOpenStory={openStory} />
            )}
            {view === "carte" && <MapView stories={stories} onOpenStory={openStory} />}
            {view === "contes" && <ContesView stories={stories} onOpenStory={openStory} />}
            {view === "recit" && <NarrativeView />}
            {view === "langues" && <LanguagesView onNavigate={navigate} />}
            {view === "contribuer" && <ContributeView />}
            {view === "apropos" && <AboutView onNavigate={navigate} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ---------- Pied de page (collant) ---------- */}
      <footer className="mt-auto border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <div className="text-center sm:text-left">
              <p className="font-display font-semibold text-sm">{SITE.baseline}</p>
              <p className="text-xs text-muted-foreground">{SITE.mission}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            {stories.length} récits · 17 régions · mooré, dioula, fulfulde & français
            <br />
           
          </p>
        </div>
      </footer>

      {/* Lecteur de récit global */}
      <StoryReader
        story={story}
        stories={stories}
        onClose={() => setOpenSlug(null)}
        onNavigate={navigateStory}
      />
    </div>
  );
}
