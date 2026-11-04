"use client";

// Carte interactive du Burkina Faso : les 17 régions du découpage de 2025.
// Vue 2D ou 3D (la carte s'incline comme un relief), zoom et déplacement,
// feux de veillée posés sur les villes des récits, filtres par genre.

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Locate } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StoryArt from "./StoryArt";
import mapData from "@/data/burkina-map.json";
import { StoryRecord, REGION_INFO, TYPE_LABELS, TYPE_COLORS, regionTone, MapData } from "@/lib/kuma-data";
import { balla } from "./balla";

interface Props {
  stories: StoryRecord[];
  onOpenStory: (slug: string) => void;
}

const map = mapData as unknown as MapData;
const [VX, VY, VW, VH] = map.viewBox;

/** « Fada N’Gourma » et « Fada N'Gourma » désignent la même ville */
const cityKey = (c: string) => c.replace(/[’`]/g, "'").trim();
const CITY_POS: Record<string, [number, number]> = Object.fromEntries(
  Object.entries(map.cities).map(([k, v]) => [cityKey(k), v])
);

/** Étiquettes placées à gauche pour éviter qu'elles se chevauchent */
const LABEL_LEFT = new Set(["Sindou", "Bomborokuy"]);
const LABEL_BELOW = new Set(["Bazoulé"]);
const LABEL_RIGHT = new Set(["Dori"]);

interface Fire {
  city: string;
  region: string;
  x: number;
  y: number;
  stories: StoryRecord[];
}

export default function MapView({ stories, onOpenStory }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("tous");
  const [is3d, setIs3d] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number; moved: boolean } | null>(null);
  const movedRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const regions = map.regions;
  const regionNames = useMemo(() => new Set(regions.map((r) => r.name)), [regions]);

  const byRegion = useMemo(() => {
    const m: Record<string, StoryRecord[]> = {};
    for (const s of stories) (m[s.region] ??= []).push(s);
    return m;
  }, [stories]);

  const matches = (s: StoryRecord) => filter === "tous" || s.type === filter;

  // Un feu par ville ; un récit sans ville connue se place au centre de sa région
  const fires = useMemo<Fire[]>(() => {
    const m = new Map<string, Fire>();
    for (const s of stories) {
      if (!regionNames.has(s.region)) continue;
      const key = s.city ? cityKey(s.city) : "";
      const pos = CITY_POS[key] ?? regions.find((r) => r.name === s.region)?.centroid;
      if (!pos) continue;
      const id = CITY_POS[key] ? key : `centre-${s.region}`;
      const f = m.get(id) ?? { city: CITY_POS[key] ? key : s.region, region: s.region, x: pos[0], y: pos[1], stories: [] };
      f.stories.push(s);
      m.set(id, f);
    }
    return [...m.values()];
  }, [stories, regions, regionNames]);

  const voyageurs = useMemo(
    () => stories.filter((s) => !regionNames.has(s.region) && matches(s)),
    [stories, regionNames, filter]
  );

  const visibleCount = stories.filter((s) => regionNames.has(s.region) && matches(s)).length;

  const regionStories = selected ? byRegion[selected] ?? [] : [];
  const shownRegionStories = regionStories
    .filter(matches)
    .filter((s) => !selectedCity || (s.city && cityKey(s.city) === selectedCity));

  const onSelect = (name: string) => {
    balla("small");
    setSelectedCity(null);
    setSelected(name === selected ? null : name);
  };

  const onFire = (f: Fire) => {
    if (movedRef.current) return;
    balla("small");
    setSelected(f.region);
    setSelectedCity(CITY_POS[f.city] ? f.city : null);
  };

  // Déplacement de la carte (quand elle est agrandie)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    movedRef.current = false;
    if (zoom === 1) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 6) {
      if (!d.moved) setDragging(true);
      d.moved = true;
      movedRef.current = true;
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) setPan({ x: d.px + dx, y: d.py + dy });
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const setZoomTo = (z: number) => {
    const nz = Math.min(3, Math.max(1, Math.round(z * 100) / 100));
    setZoom(nz);
    if (nz === 1) setPan({ x: 0, y: 0 });
  };

  const stageTransform = is3d
    ? `translate(${pan.x}px, ${pan.y}px) rotateX(52deg) rotateZ(-8deg) scale(${0.92 * zoom}) translateY(-3%)`
    : `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

  // Nom de chaque région : au centre, ou décalé s'il tombe sur un feu de veillée
  const labelPos = useMemo(() => {
    const out: Record<string, [number, number]> = {};
    for (const r of regions) {
      const [cx, cy] = r.centroid;
      const candidates: [number, number][] = [
        [cx, cy + 6],
        [cx, cy + 30],
        [cx, cy - 26],
        [cx + 40, cy + 10],
        [cx - 40, cy + 10],
        [cx, cy + 46],
        [cx + 30, cy + 34],
        [cx - 30, cy + 34],
      ];
      // gêne entre le nom (≈ 90 × 14) et un feu avec son étiquette (≈ 80 × 44 au-dessus du point)
      const overlap = (p: [number, number]) =>
        fires.reduce((acc, f) => {
          const right = LABEL_RIGHT.has(f.city);
          const dx = right ? (p[0] < f.x - 50 || p[0] > f.x + 130 ? 1 : 0) : Math.max(0, Math.abs(p[0] - f.x) - 85);
          const below = LABEL_BELOW.has(f.city);
          const top = below ? f.y - 12 : f.y - 36;
          const bottom = below ? f.y + 36 : f.y + 12;
          const dy = p[1] < top ? top - p[1] : p[1] - 12 > bottom ? p[1] - 12 - bottom : 0;
          return acc + (dx === 0 && dy === 0 ? 1 : 0);
        }, 0);
      let best = candidates[0];
      for (const c of candidates) {
        if (overlap(c) < overlap(best)) best = c;
        if (overlap(best) === 0) break;
      }
      out[r.name] = best;
    }
    return out;
  }, [regions, fires]);

  // Chefs-lieux à afficher en petit (ceux qui n'ont pas déjà un feu tout près)
  const capitals = useMemo(() => {
    return Object.entries(REGION_INFO)
      .map(([region, info]) => ({ region, city: info.city, pos: CITY_POS[cityKey(info.city)] }))
      .filter(
        (c) =>
          c.pos &&
          !fires.some((f) => Math.hypot(f.x - c.pos[0], f.y - c.pos[1]) < 22) &&
          !Object.values(labelPos).some((l) => Math.abs(l[0] - c.pos[0]) < 60 && Math.abs(l[1] - 5 - c.pos[1]) < 12)
      );
  }, [fires, labelPos]);


  // Position à l'écran de chaque feu : on mesure les points d'ancrage (transformés avec la
  // carte) pendant toute la durée de l'animation 2D/3D, du zoom ou du déplacement.
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [pinPos, setPinPos] = useState<Record<string, [number, number]>>({});
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const measure = () => {
      const box = scene.getBoundingClientRect();
      const next: Record<string, [number, number]> = {};
      scene.querySelectorAll<HTMLElement>("[data-anchor]").forEach((a) => {
        const r = a.getBoundingClientRect();
        next[a.dataset.anchor as string] = [r.left - box.left, r.top - box.top];
      });
      setPinPos(next);
    };
    let raf = 0;
    const until = performance.now() + 1100;
    const loop = () => {
      measure();
      if (performance.now() < until) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(scene);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [is3d, zoom, pan, fires]);

  return (
    <div className="grid lg:grid-cols-[1fr_370px] gap-5 items-start">
      {/* ---------- Carte ---------- */}
      <div className="rounded-2xl border bg-card paper-card overflow-hidden">
        {/* barre d'outils */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrer par genre">
            <button
              onClick={() => setFilter("tous")}
              aria-pressed={filter === "tous"}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${filter === "tous" ? "bg-[var(--nuit)] text-white border-[var(--nuit)]" : "hover:border-[var(--terre)]"}`}
            >
              Tous
            </button>
            {Object.entries(TYPE_LABELS).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(filter === k ? "tous" : k)}
                aria-pressed={filter === k}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${filter === k ? "bg-[var(--terre)] text-white border-[var(--terre)]" : "hover:border-[var(--terre)]"}`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[k] }} aria-hidden />
                {label}s
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {visibleCount} récit{visibleCount > 1 ? "s" : ""} · 17 régions
            </span>
            <div className="inline-flex rounded-full border overflow-hidden text-xs font-medium" role="group" aria-label="Vue de la carte">
              {([false, true] as const).map((v) => (
                <button
                  key={String(v)}
                  onClick={() => {
                    balla("small");
                    setIs3d(v);
                  }}
                  aria-pressed={is3d === v}
                  className={`px-3.5 py-1 transition-colors ${is3d === v ? "bg-[var(--nuit)] text-white" : "hover:bg-muted"}`}
                >
                  {v ? "3D" : "2D"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* scène */}
        <div
          ref={sceneRef}
          className={`relative overflow-hidden px-2 sm:px-4 py-4 select-none ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
          style={{ perspective: "1300px", touchAction: zoom > 1 ? "none" : "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="kmap-stage relative mx-auto w-full max-w-[860px]"
            style={{
              aspectRatio: `${VW} / ${VH}`,
              transform: stageTransform,
              transformStyle: "preserve-3d",
              transition: dragging ? "none" : "transform 0.9s cubic-bezier(.2,.7,.2,1)",
            }}
          >
            <svg
              viewBox={`${VX} ${VY} ${VW} ${VH}`}
              className={`absolute inset-0 h-full w-full overflow-visible ${is3d ? "kmap-relief" : ""}`}
              role="group"
              aria-label="Carte interactive des 17 régions du Burkina Faso"
            >
              {/* socle du pays */}
              <path d={map.outline} fill="none" stroke="#5A4526" strokeWidth={3} strokeLinejoin="round" opacity={0.5} />
              {regions.map((r) => {
                const isSel = selected === r.name;
                const isHover = hovered === r.name;
                const n = (byRegion[r.name] ?? []).filter(matches).length;
                return (
                  <path
                    key={r.name}
                    d={r.path}
                    fill={regionTone(r.name)}
                    fillOpacity={isSel ? 1 : isHover ? 0.9 : selected ? 0.55 : 0.78}
                    stroke={isSel ? "#FFF7E8" : "#5A4526"}
                    strokeWidth={isSel ? 3 : 1.1}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-[fill-opacity] duration-200 outline-none focus-visible:stroke-[#FFF7E8]"
                    onClick={() => {
                      if (!movedRef.current) onSelect(r.name);
                    }}
                    onMouseEnter={() => setHovered(r.name)}
                    onMouseLeave={() => setHovered((h) => (h === r.name ? null : h))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(r.name);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSel}
                    aria-label={`Région ${r.name}, chef-lieu ${REGION_INFO[r.name]?.city ?? ""} : ${n} récit${n > 1 ? "s" : ""}`}
                  />
                );
              })}
              {/* le contour sélectionné repasse au-dessus de ses voisins */}
              {selected && (
                <path
                  d={regions.find((r) => r.name === selected)?.path}
                  fill="none"
                  stroke="#FFF7E8"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
              )}
              {/* chefs-lieux */}
              {capitals.map((c) => (
                <g key={c.city} className="pointer-events-none">
                  <circle cx={c.pos[0]} cy={c.pos[1]} r={2.6} fill="#3B2A1A" />
                  <text x={c.pos[0] + 5} y={c.pos[1] + 3.5} fontSize={10} fill="#3B2A1A" opacity={0.8}>
                    {c.city}
                  </text>
                </g>
              ))}
              {/* noms des régions */}
              {regions.map((r) => {
                const isSel = selected === r.name || hovered === r.name;
                return (
                  <text
                    key={`l-${r.name}`}
                    x={labelPos[r.name][0]}
                    y={labelPos[r.name][1]}
                    textAnchor="middle"
                    fontSize={r.name === "Kadiogo" ? 11 : 13.5}
                    fontWeight={isSel ? 700 : 600}
                    fill="#2E2014"
                    stroke="#FFF3DE"
                    strokeWidth={3}
                    paintOrder="stroke"
                    opacity={isSel ? 1 : 0.82}
                    letterSpacing={0.4}
                    className="pointer-events-none uppercase"
                  >
                    {r.name}
                  </text>
                );
              })}
            </svg>

            {/* points d'ancrage des feux : ils suivent l'inclinaison de la carte */}
            {fires.map((f) => (
              <span
                key={f.city}
                data-anchor={f.city}
                className="absolute h-px w-px pointer-events-none"
                style={{ left: `${((f.x - VX) / VW) * 100}%`, top: `${((f.y - VY) / VH) * 100}%` }}
              />
            ))}
          </div>

          {/* feux de veillée : posés à plat sur l'écran, toujours debout et lisibles, même en 3D */}
          <div className="pointer-events-none absolute inset-0 z-10">
            {fires.map((f) => {
              const pos = pinPos[f.city];
              if (!pos) return null;
              const shown = f.stories.filter(matches);
              const dim = shown.length === 0;
              const active = selected === f.region && (!selectedCity || selectedCity === f.city);
              const left = LABEL_LEFT.has(f.city);
              return (
                <button
                  key={f.city}
                  type="button"
                  onClick={() => onFire(f)}
                  disabled={dim}
                  className={`kmap-pin pointer-events-auto absolute ${dim ? "opacity-25" : ""} ${active ? "kmap-pin-active" : ""}`}
                  style={{ left: pos[0], top: pos[1], transform: "translate(-50%, -50%)" }}
                  aria-label={`${f.city} : ${shown.length} récit${shown.length > 1 ? "s" : ""}`}
                >
                  <span className="kmap-fire" aria-hidden>
                    {shown.length > 1 ? shown.length : ""}
                  </span>
                  <span className={`kmap-tag ${left ? "kmap-tag-left" : LABEL_RIGHT.has(f.city) ? "kmap-tag-right" : LABEL_BELOW.has(f.city) ? "kmap-tag-below" : "kmap-tag-top"}`} aria-hidden>
                    {f.city}
                  </span>
                </button>
              );
            })}
          </div>

          {/* zoom */}
          <div className="absolute right-3 bottom-3 z-20 flex flex-col gap-1.5">
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-lg shadow" onClick={() => setZoomTo(zoom + 0.4)} aria-label="Agrandir la carte">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-lg shadow" onClick={() => setZoomTo(zoom - 0.4)} aria-label="Réduire la carte">
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-lg shadow"
              onClick={() => {
                setZoomTo(1);
                setSelected(null);
                setSelectedCity(null);
              }}
              aria-label="Revenir à la vue d'ensemble"
            >
              <Locate className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* légende */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t px-4 py-2.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="kmap-fire kmap-fire-sm" aria-hidden /> Feu de veillée : les récits d'une ville
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B2A1A] dark:bg-[#e8d9c0]" aria-hidden /> Chef-lieu de région
          </span>
          <span className="hidden sm:inline">Cliquez une région ou un feu. En 3D, la carte s'incline comme un relief.</span>
        </div>
      </div>

      {/* ---------- Panneau régional ---------- */}
      <motion.div
        key={`${selected ?? "none"}-${selectedCity ?? ""}`}
        initial={{ opacity: 0.6, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border bg-card paper-card p-5 lg:sticky lg:top-20"
      >
        {selected && REGION_INFO[selected] ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Région</p>
                <h3 className="font-display text-2xl font-semibold leading-tight">{selected}</h3>
                <p className="text-sm text-muted-foreground">
                  Chef-lieu : {REGION_INFO[selected].city} · ancienne région : {REGION_INFO[selected].former}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelected(null);
                  setSelectedCity(null);
                }}
                aria-label="Fermer la fiche région"
              >
                ✕
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{REGION_INFO[selected].blurb}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {shownRegionStories.length} récit{shownRegionStories.length > 1 ? "s" : ""}
                  {selectedCity ? ` à ${selectedCity}` : " dans cette région"}
                </p>
                {selectedCity && (
                  <button className="text-xs text-[var(--terre)] hover:underline" onClick={() => setSelectedCity(null)}>
                    Toute la région
                  </button>
                )}
              </div>
              {shownRegionStories.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => {
                    balla("big");
                    onOpenStory(s.slug);
                  }}
                  className="w-full text-left rounded-xl border overflow-hidden hover:border-[var(--terre)] hover:shadow-md transition-all group"
                >
                  <div className="h-20 relative">
                    <StoryArt theme={s.artTheme} className="absolute inset-0 w-full h-full" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: TYPE_COLORS[s.type] }} aria-hidden />
                      <span className="font-medium text-sm leading-snug group-hover:text-[var(--terre)] transition-colors">{s.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {s.city ? `${s.city} · ` : ""}
                      {s.summary}
                    </p>
                  </div>
                </button>
              ))}
              {shownRegionStories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Pas encore de récit ici{filter !== "tous" ? " pour ce genre" : ""}. Vous en connaissez un ? Proposez-le depuis « Contribuer ».
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <h3 className="font-display text-xl font-semibold">Explorez le Faso, région par région</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Depuis 2025, le Burkina Faso compte 17 régions aux noms tirés des langues nationales, des rivières
              et de l'histoire. Cliquez sur une région ou sur un feu de veillée pour écouter ce que l'on y raconte.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[...regions]
                .sort((a, b) => a.name.localeCompare(b.name, "fr"))
                .map((r) => {
                  const n = (byRegion[r.name] ?? []).filter(matches).length;
                  return (
                    <button key={r.name} onClick={() => onSelect(r.name)}>
                      <Badge variant="secondary" className="cursor-pointer gap-1.5 hover:bg-[var(--terre)] hover:text-white transition-colors">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: regionTone(r.name) }} aria-hidden />
                        {r.name}
                        {n > 0 && <span className="tabular-nums opacity-70">{n}</span>}
                      </Badge>
                    </button>
                  );
                })}
            </div>
            {voyageurs.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contes voyageurs, partout au Faso</p>
                {voyageurs.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      balla("big");
                      onOpenStory(s.slug);
                    }}
                    className="w-full text-left rounded-xl border px-3 py-2 hover:border-[var(--terre)] transition-colors text-sm"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-5 text-[11px] text-muted-foreground">
              Limites des régions : {map.source}. Tracé simplifié, à valeur d'illustration.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
