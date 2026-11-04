"use client";

// Bibliothèque complète des récits : recherche + filtres par type et par région.

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import StoryArt from "./StoryArt";
import {
  StoryRecord,
  TYPE_COLORS,
  TYPE_LABELS,
  REGION_INFO,
} from "@/lib/kuma-data";
import { balla } from "./balla";

interface Props {
  stories: StoryRecord[];
  onOpenStory: (slug: string) => void;
}

export default function ContesView({ stories, onOpenStory }: Props) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("tous");
  const [region, setRegion] = useState("toutes");

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const s of stories) set.add(s.region);
    return Array.from(set).sort((a, b) => (a === "Partout au Faso" ? 1 : b === "Partout au Faso" ? -1 : a.localeCompare(b)));
  }, [stories]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return stories.filter((s) => {
      if (type !== "tous" && s.type !== type) return false;
      if (region !== "toutes" && s.region !== region) return false;
      if (
        needle &&
        !`${s.title} ${s.summary} ${s.region} ${s.peoples ?? ""}`.toLowerCase().includes(needle)
      )
        return false;
      return true;
    });
  }, [stories, q, type, region]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">La bibliothèque des récits</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
          {stories.length} récits : contes, légendes, mythes et pages d'histoire, dont quinze contes à lire et à
          écouter en dioula, en mooré et en fulfulde — rangés région par région.
        </p>
      </header>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un récit, un peuple, un lieu…"
            className="pl-9 bg-card"
            aria-label="Rechercher un récit"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrer par type">
          {["tous", ...Object.keys(TYPE_LABELS)].map((t) => (
            <button
              key={t}
              onClick={() => { balla("small"); setType(t); }}
              aria-pressed={type === t}
              className={`rounded-full px-3.5 py-1.5 text-[13px] border transition-colors ${
                type === t
                  ? "bg-[var(--terre)] text-white border-[var(--terre)]"
                  : "bg-card hover:border-[var(--terre)]"
              }`}
            >
              {t === "tous" ? "Tous les types" : `${TYPE_LABELS[t]}s`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrer par région">
          <button
            onClick={() => setRegion("toutes")}
            aria-pressed={region === "toutes"}
            className={`rounded-full px-3.5 py-1.5 text-[13px] border transition-colors ${
              region === "toutes" ? "bg-[var(--nuit)] text-white border-[var(--nuit)]" : "bg-card hover:border-[var(--terre)]"
            }`}
          >
            Toutes régions
          </button>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => { balla("small"); setRegion(region === r ? "toutes" : r); }}
              aria-pressed={region === r}
              className={`rounded-full px-3.5 py-1.5 text-[13px] border transition-colors ${
                region === r ? "bg-[var(--nuit)] text-white border-[var(--nuit)]" : "bg-card hover:border-[var(--terre)]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats */}
      {list.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
          Aucun récit ne correspond à cette recherche… mais chaque village en cache cent autres.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((s) => (
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
                {REGION_INFO[s.region] && (
                  <span className="absolute bottom-2.5 right-2.5">
                    <Badge className="border-0 bg-white/85 text-foreground">{s.region}</Badge>
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-[var(--terre)] transition-colors">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-muted-foreground line-clamp-3 leading-relaxed">
                  {s.summary}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {s.era}
                  {s.peoples ? ` · ${s.peoples}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
