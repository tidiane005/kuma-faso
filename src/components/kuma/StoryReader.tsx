"use client";

// Lecteur immersif d'un récit.
// Ordinateur : lecture en français à gauche, texte au centre, langue nationale à droite.
// Téléphone : les deux lecteurs côte à côte en haut, le texte en dessous.

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin, Clock, Users, Sparkles, Languages, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StoryScene from "./scene/StoryScene";
import { buildPlan } from "./scene/plan";
import LocalVoice from "./LocalVoice";
import FrenchVoice from "./FrenchVoice";
import { TYPE_LABELS, TYPE_COLORS, StoryRecord } from "@/lib/kuma-data";
import { balla } from "./balla";

interface Props {
  story: StoryRecord | null;
  stories: StoryRecord[];
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

export default function StoryReader({ story, stories, onClose, onNavigate }: Props) {
  const [view, setView] = useState<"fr" | "loc">("fr");
  useEffect(() => {
    setView("fr");
  }, [story?.slug]);
  const hasLoc = !!story?.localContent;
  const showLoc = hasLoc && (view === "loc" || !story?.hasFrench);
  const [reading, setReading] = useState<number | null>(null);
  // Taille du texte (0 = normal, 1 = grand, 2 = très grand), mémorisée sur l'appareil
  const [size, setSize] = useState<number>(() => {
    try {
      const v = Number(window.localStorage.getItem("kuma-text-size"));
      return v >= 0 && v <= 2 ? v : 0;
    } catch {
      return 0;
    }
  });
  const changeSize = (d: number) => {
    const v = Math.min(2, Math.max(0, size + d));
    setSize(v);
    try {
      window.localStorage.setItem("kuma-text-size", String(v));
    } catch {
      /* stockage indisponible : la taille vaut pour cette visite */
    }
  };
  const textClass = ["text-[16.5px] leading-[1.75]", "text-[18.5px] leading-[1.8]", "text-[21px] leading-[1.8]"][size];
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const frParagraphs = useMemo(
    () => (story?.content ?? "").split("\n\n").filter((p) => p.trim()),
    [story?.content]
  );
  const shownParagraphs = useMemo(
    () => (showLoc ? (story?.localContent ?? "") : (story?.content ?? "")).split("\n\n").filter((p) => p.trim()),
    [showLoc, story?.localContent, story?.content]
  );

  // ---- Scène animée : découpage du récit en tableaux ----
  const plan = useMemo(() => {
    if (!story) return [];
    const paragraphs = story.hasFrench
      ? (story.content ?? "").split("\n\n").filter((p) => p.trim())
      : (story.localContent ?? story.content ?? "").split("\n\n").filter((p) => p.trim());
    return buildPlan({
      slug: story.slug,
      title: story.title,
      summary: story.summary,
      artTheme: story.artTheme,
      paragraphs,
      localOnly: !story.hasFrench,
    });
  }, [story]);
  const [localProg, setLocalProg] = useState<{ f: number; playing: boolean; slug: string }>({ f: 0, playing: false, slug: "" });
  const [scrollProg, setScrollProg] = useState(0);
  const scrollRaf = useRef(0);
  const onBodyScroll = () => {
    if (scrollRaf.current) return;
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0;
      const el = bodyRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setScrollProg(max > 0 ? el.scrollTop / max : 0);
    });
  };
  const T = plan.length || 1;
  const P = story?.hasFrench ? frParagraphs.length : plan.length ? plan[plan.length - 1].to + 1 : 1;
  let sceneIndex: number;
  let sceneSource: string;
  if (reading !== null) {
    // lecture en français : le tableau qui contient le paragraphe lu (la morale = dernier tableau)
    const para = reading < 0 ? P - 1 : reading;
    const found = plan.findIndex((tb) => para >= tb.from && para <= tb.to);
    sceneIndex = found >= 0 ? found : T - 1;
    sceneSource = "Suit la lecture en français";
  } else if (localProg.playing && localProg.slug === story?.slug) {
    sceneIndex = Math.min(T - 1, Math.floor(localProg.f * T));
    sceneSource = `Suit l'enregistrement en ${story?.localLang ?? "langue locale"}`;
  } else {
    sceneIndex = Math.min(T - 1, Math.floor(scrollProg * T));
    sceneSource = "Suit votre lecture";
  }

  // Revient en haut du texte à chaque nouveau récit
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [story?.slug]);

  // Fait défiler jusqu'au paragraphe lu à voix haute
  useEffect(() => {
    if (reading === null || showLoc) return;
    const el = bodyRef.current?.querySelector<HTMLElement>(`[data-para="${reading}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [reading, showLoc]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (story) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      balla("big");
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [story, onClose]);

  const idx = useMemo(
    () => (story ? stories.findIndex((s) => s.slug === story.slug) : -1),
    [story, stories]
  );
  const prev = idx > 0 ? stories[idx - 1] : null;
  const next = idx >= 0 && idx < stories.length - 1 ? stories[idx + 1] : null;

  return (
    <AnimatePresence>
      {story && (
        <motion.div
          key="reader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 bg-[var(--nuit)]/70 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Récit : ${story.title}`}
        >
          <motion.article
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="absolute inset-0 sm:inset-3 lg:inset-4 2xl:inset-x-auto 2xl:left-1/2 2xl:-translate-x-1/2 2xl:w-[1440px] sm:rounded-2xl overflow-hidden bg-background shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bandeau : scène animée qui suit le récit, titre, informations */}
            <header className="relative h-40 sm:h-48 lg:h-56 shrink-0 bg-[#1d120c] overflow-hidden">
              <StoryScene key={story.slug} tableaux={plan} index={sceneIndex} className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />
              <Button
                size="icon"
                variant="secondary"
                onClick={onClose}
                aria-label="Fermer le récit"
                className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute top-3 left-4 right-16 sm:left-6 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge className="border-0 text-white" style={{ backgroundColor: TYPE_COLORS[story.type] ?? "#8A5A2B" }}>
                    {TYPE_LABELS[story.type] ?? story.type}
                  </Badge>
                  <Badge className="border-0 bg-white/90 text-foreground">
                    <MapPin className="h-3 w-3 mr-1" aria-hidden /> {story.region}
                    {story.city ? `, ${story.city}` : ""}
                  </Badge>
                </div>
                <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight [text-wrap:balance] [text-shadow:0_1px_8px_rgba(0,0,0,.55)]">
                  {story.title}
                </h2>
              </div>
              {/* Progression dans les tableaux */}
              <div className="absolute bottom-2.5 right-3 flex items-center gap-2 rounded-full bg-black/45 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur-sm">
                <span className="hidden sm:inline">{sceneSource}</span>
                <span className="flex gap-1" aria-label={`Tableau ${sceneIndex + 1} sur ${T}`}>
                  {plan.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === sceneIndex ? "w-4 bg-[var(--or)]" : "w-1.5 bg-white/50"}`} />
                  ))}
                </span>
              </div>
            </header>

            {/* Trois zones : français | texte | langue nationale */}
            <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-[auto_minmax(0,1fr)] gap-2 p-2 sm:gap-3 sm:p-3 lg:grid-cols-[minmax(230px,270px)_minmax(0,1fr)_minmax(230px,270px)] lg:grid-rows-[minmax(0,1fr)] lg:gap-4 lg:p-4 bg-muted/50">
              {/* Gauche : lecture en français */}
              <div className="order-1 min-w-0 lg:min-h-0 lg:overflow-y-auto k-scroll">
                {story.hasFrench ? (
                  <FrenchVoice
                    key={story.slug}
                    paragraphs={frParagraphs}
                    moral={story.moral}
                    onParagraph={setReading}
                    textShown={!showLoc}
                    onShowText={() => setView("fr")}
                  />
                ) : (
                  <section className="h-full rounded-2xl border bg-card p-3 lg:p-5 flex flex-col gap-3">
                    <header className="flex items-center gap-2.5">
                      <span className="grid place-items-center h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-muted text-muted-foreground text-xs lg:text-sm font-semibold shrink-0">FR</span>
                      <div className="min-w-0">
                        <p className="text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground leading-none">Écouter</p>
                        <h3 className="font-display text-[15px] lg:text-lg font-semibold leading-tight">En français</h3>
                      </div>
                    </header>
                    <p className="text-[11.5px] lg:text-xs text-muted-foreground leading-relaxed">
                      Traduction française pas encore disponible pour ce conte.
                    </p>
                  </section>
                )}
              </div>

              {/* Droite : langue nationale */}
              <div className="order-2 lg:order-3 min-w-0 lg:min-h-0 lg:overflow-y-auto k-scroll">
                <LocalVoice
                  key={`loc-${story.slug}`}
                  slug={story.slug}
                  lang={story.localLang}
                  hasLocalText={hasLoc}
                  textShown={showLoc}
                  onShowText={() => setView("loc")}
                  onProgress={(f, playing) => setLocalProg({ f, playing, slug: story.slug })}
                />
              </div>

              {/* Centre : le texte */}
              {/* min-h-0 : sans lui, la zone ne rétrécit pas et la fin du texte est coupée */}
              <div
                ref={bodyRef}
                onScroll={onBodyScroll}
                className="order-3 lg:order-2 col-span-2 lg:col-span-1 min-h-0 overflow-y-auto overscroll-contain k-scroll rounded-2xl border bg-background"
              >
                {/* Barre d'outils du texte */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-2">
                  {hasLoc && story.hasFrench ? (
                    <div className="inline-flex rounded-full border border-border p-0.5 text-sm" role="group" aria-label="Langue du texte">
                      {([["fr", "Français"], ["loc", story.localLang ?? "Langue locale"]] as const).map(([k, label]) => (
                        <button
                          key={k}
                          onClick={() => {
                            balla("small");
                            setView(k);
                          }}
                          aria-pressed={view === k}
                          className={`rounded-full px-3.5 py-1 transition-colors ${view === k ? "bg-[var(--terre)] text-white" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground truncate">
                      Texte en {showLoc ? story.localLang : "français"}
                    </p>
                  )}
                  <div className="flex items-center gap-1 shrink-0" role="group" aria-label="Taille du texte">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeSize(-1)} disabled={size === 0} aria-label="Réduire le texte">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground w-6 text-center select-none" aria-hidden>Aa</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeSize(1)} disabled={size === 2} aria-label="Agrandir le texte">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mx-auto max-w-[68ch] px-5 sm:px-8 py-6 lg:py-8">
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-muted-foreground">
                    {story.era && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden /> {story.era}
                      </span>
                    )}
                    {story.peoples && (
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" aria-hidden /> {story.peoples}
                      </span>
                    )}
                    {story.moment && (
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden /> {story.moment}
                      </span>
                    )}
                  </div>

                  {hasLoc && !story.hasFrench && (
                    <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                      La traduction française de ce conte n'est pas encore disponible : le texte est présenté en {story.localLang}.
                    </p>
                  )}

                  <div className={`mt-5 space-y-5 text-foreground/90 ${textClass}`}>
                    {shownParagraphs.map((para, i) => (
                      <p
                        key={i}
                        data-para={i}
                        className={`rounded-lg transition-colors duration-300 ${!showLoc && reading === i ? "bg-[var(--or)]/25 -mx-3 px-3 py-1" : ""} ${i === 0 ? "first-letter:font-display first-letter:text-5xl first-letter:font-semibold first-letter:text-[var(--terre)] first-letter:mr-1.5 first-letter:float-left first-letter:leading-[0.9]" : ""}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {story.moral && (
                    <div className={`mt-8 rounded-xl border-l-4 border-[var(--terre)] px-5 py-4 transition-colors ${reading === -1 && !showLoc ? "bg-[var(--or)]/35" : "bg-[var(--or)]/15"}`} data-para={-1}>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">La sagesse du récit</p>
                      <p className="font-display text-lg leading-snug">{story.moral}</p>
                    </div>
                  )}

                  {story.source && <p className="mt-4 text-xs text-muted-foreground">Source : {story.source}</p>}

                  {/* Navigation entre récits */}
                  <nav className="mt-8 pt-5 border-t flex items-center justify-between gap-3" aria-label="Autres récits">
                    {prev ? (
                      <Button variant="outline" size="sm" onClick={() => onNavigate(prev.slug)} className="max-w-[46%]">
                        <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="truncate">{prev.title}</span>
                      </Button>
                    ) : (
                      <span />
                    )}
                    {next ? (
                      <Button variant="outline" size="sm" onClick={() => onNavigate(next.slug)} className="max-w-[46%]">
                        <span className="truncate">{next.title}</span>
                        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
                      </Button>
                    ) : (
                      <span />
                    )}
                  </nav>

                  <p className="mt-5 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Languages className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    Vous avez un enregistrement de ce conte dans une autre langue nationale ? Proposez-le depuis « Contribuer ».
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
