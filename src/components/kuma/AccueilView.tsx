"use client";

// Vue d'accueil : héros animé, chiffres clés, points forts, récits vedettes.

import { motion } from "framer-motion";
import { Map, Headphones, Wand2, ArrowRight, BookOpen, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StoryArt from "./StoryArt";
import { StoryRecord, TYPE_COLORS, TYPE_LABELS, REGION_INFO } from "@/lib/kuma-data";
import { SITE } from "@/content/site";
import { balla } from "./balla";

interface Props {
  stories: StoryRecord[];
  onNavigate: (v: string) => void;
  onOpenStory: (slug: string) => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

export default function AccueilView({ stories, onNavigate, onOpenStory }: Props) {
  const vedettes = stories.slice(0, 3);
  const regionsCouvertes = new Set(
    stories.map((s) => s.region).filter((r) => REGION_INFO[r])
  ).size;

  return (
    <div className="space-y-14">
      {/* ---------- Héros ---------- */}
      <section className="relative overflow-hidden rounded-3xl border paper-card">
        <div className="absolute inset-0">
          <StoryArt theme="baobab" className="w-full h-full object-cover opacity-95" ariaLabel="Paysage animé : baobab au lever du soleil" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--sable)]/95 via-[var(--sable)]/75 to-transparent" />
        </div>
        <div className="relative px-6 sm:px-10 lg:px-14 py-12 sm:py-16 lg:py-20 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Badge className="mb-4 border-0 bg-[var(--terre)] text-white">
              {SITE.heroBadge}
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              {SITE.name}
            </h1>
            <p className="font-display text-lg sm:text-xl mt-2 text-[var(--terre)]">
              {SITE.tagline}
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-foreground/85">
              {SITE.heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full" onClick={() => { balla("big"); onNavigate("carte"); }}>
                <Map className="mr-2 h-4 w-4" aria-hidden /> Explorer la carte
              </Button>
              <Button size="lg" variant="outline" className="rounded-full bg-white/60" onClick={() => onNavigate("contes")}>
                <BookOpen className="mr-2 h-4 w-4" aria-hidden /> Lire les récits
              </Button>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {[
                { n: "17", l: "régions cartographiées" },
                { n: String(stories.length), l: "récits illustrés & sonorisés" },
                { n: "3+1", l: "langues nationales + français" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-white/55 backdrop-blur px-3 py-2.5 border">
                  <dt className="sr-only">{s.l}</dt>
                  <dd className="font-display text-2xl font-bold text-[var(--terre)]">{s.n}</dd>
                  <dd className="text-[11.5px] leading-tight text-muted-foreground">{s.l}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* bande décorative */}
      <div className="tiebele-band mx-auto max-w-3xl" aria-hidden />

      {/* ---------- La brousse vous raconte ---------- */}
      <motion.section {...fadeUp} className="max-w-2xl mx-auto text-center space-y-4">
        <Headphones className="mx-auto h-8 w-8 text-[var(--terre)]" aria-hidden />
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">
          La brousse vous raconte…
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Ouvrez un récit, appuyez sur « Écouter », fermez les yeux et laissez la voix transporter
          le village. Chaque conte se lit en français, et beaucoup s'écoutent aussi en mooré, en
          dioula ou en fulfulde, enregistrés par des conteurs.
        </p>
      </motion.section>

      {/* ---------- Trois façons de découvrir ---------- */}
      <motion.section {...fadeUp} className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Map,
            t: "Carte interactive 2D/3D",
            d: "Les 17 régions du nouveau découpage, en 2D ou en relief 3D : chaque ville allume son feu de veillée.",
            v: "carte",
          },
          {
            icon: Headphones,
            t: "Récits sonorisés",
            d: "Illustrations animées, narration française et place réservée aux voix des aînés.",
            v: "contes",
          },
          {
            icon: Wand2,
            t: "Récit interactif",
            d: "Choisissez vos chemins dans « Le masque du fleuve » : trois fins possibles, une sagesse.",
            v: "recit",
          },
        ].map(({ icon: Icon, t, d, v }) => (
          <button
            key={t}
            onClick={() => { balla("small"); onNavigate(v); }}
            className="text-left rounded-2xl border bg-card paper-card p-5 hover:border-[var(--terre)] hover:-translate-y-0.5 transition-all"
          >
            <Icon className="h-6 w-6 text-[var(--terre)]" aria-hidden />
            <h3 className="mt-3 font-display text-lg font-semibold">{t}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{d}</p>
          </button>
        ))}
      </motion.section>

      {/* ---------- Récits vedettes ---------- */}
      <motion.section {...fadeUp}>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Récits à découvrir</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {regionsCouvertes} régions racontées sur 17 — le voyage continue.
            </p>
          </div>
          <Button variant="ghost" onClick={() => onNavigate("contes")} className="hidden sm:inline-flex">
            Tout voir <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vedettes.map((s) => (
            <button
              key={s.slug}
              onClick={() => { balla("big"); onOpenStory(s.slug); }}
              className="text-left rounded-2xl border overflow-hidden bg-card hover:border-[var(--terre)] hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="h-36 relative">
                <StoryArt theme={s.artTheme} className="absolute inset-0 w-full h-full" />
                <span className="absolute top-2.5 left-2.5">
                  <Badge className="border-0 text-white" style={{ backgroundColor: TYPE_COLORS[s.type] }}>
                    {TYPE_LABELS[s.type]}
                  </Badge>
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{s.region}</p>
                <h3 className="mt-1 font-display text-lg font-semibold leading-snug group-hover:text-[var(--terre)] transition-colors">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-muted-foreground line-clamp-3 leading-relaxed">
                  {s.summary}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      {/* ---------- Mission ---------- */}
      <motion.section {...fadeUp} className="rounded-3xl border bg-[var(--nuit)] text-[var(--sable)] p-7 sm:p-10">
        <Globe2 className="h-8 w-8 text-[var(--or)]" aria-hidden />
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white">
          {SITE.missionTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed opacity-85">
          {SITE.missionText}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button className="rounded-full bg-[var(--or)] text-[var(--nuit)] hover:bg-[var(--or)]/85" onClick={() => { balla("small"); onNavigate("contribuer"); }}>
            Contribuer une histoire ou une voix
          </Button>
          <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10" onClick={() => { balla("small"); onNavigate("apropos"); }}>
            Notre mission
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
