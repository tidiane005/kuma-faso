"use client";

// Langues nationales : lexique, statut des enregistrements, mission de numérisation sonore.

import { motion } from "framer-motion";
import { Mic, CheckCircle2, CircleDashed, BookA } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LANGUES, AUDIO_STATUT } from "@/lib/kuma-data";

interface Props {
  onNavigate: (v: string) => void;
}

export default function LanguagesView({ onNavigate }: Props) {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <Badge className="border-0 bg-[var(--karite)] text-white mb-3">Langues nationales</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">
          Le conte vit dans sa langue
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
          Un conte traduit est déjà un peu un voyage. Le Burkina Faso compte plus de soixante
          langues ; les trois langues nationales les plus parlées — <strong>mooré</strong>,
          <strong> dioula</strong> et <strong>fulfulde</strong> — accompagnent ici le français.
          Cette plateforme prépare l'archive sonore de demain : les narrations françaises servent
          d'aperçu, et chaque enregistrement communautaire en langue nationale viendra prendre sa
          place dans le lecteur.
        </p>
      </header>

      {/* Statut des bandes sonores */}
      <section className="rounded-2xl border bg-card paper-card p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Mic className="h-5 w-5 text-[var(--terre)]" aria-hidden /> État des bandes sonores
        </h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { code: "fr", nom: "Français" },
            ...LANGUES.map((l) => ({ code: l.code, nom: l.nom })),
          ].map(({ code, nom }) => {
            const st = AUDIO_STATUT[code];
            return (
              <div key={code} className="rounded-xl border p-4 bg-background/50">
                <div className="flex items-center gap-2">
                  {st.dispo ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-[var(--karite)]" aria-hidden />
                  ) : (
                    <CircleDashed className="h-4.5 w-4.5 text-[var(--terre)]" aria-hidden />
                  )}
                  <span className="font-semibold text-sm">{nom}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{st.note}</p>
              </div>
            );
          })}
        </div>
        <Button className="mt-5 rounded-full" onClick={() => onNavigate("contribuer")}>
          Proposer un enregistrement
        </Button>
      </section>

      {/* Lexiques */}
      <section>
        <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
          <BookA className="h-5 w-5 text-[var(--terre)]" aria-hidden /> Premier lexique du voyageur
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Quelques mots pour entrer dans les récits. Les orthographes varient selon les régions et
          les transcriptions : ce lexique est une invitation, pas une grammaire.
        </p>
        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {LANGUES.map((l, idx) => (
            <motion.div
              key={l.code}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="rounded-2xl border bg-card paper-card overflow-hidden"
            >
              <div className="tiebele-band" aria-hidden />
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold">{l.nom}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{l.famille}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Parlée : {l.parlée}</p>
                <table className="mt-4 w-full text-sm">
                  <tbody>
                    {l.entries.map((e) => (
                      <tr key={e.mot} className="border-t first:border-t-0">
                        <td className="py-2 pr-3 font-medium text-[var(--terre)] whitespace-nowrap align-top">
                          {e.mot}
                        </td>
                        <td className="py-2 text-muted-foreground">{e.sens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comment nous enregistrons */}
      <section className="rounded-3xl bg-[var(--nuit)] text-[var(--sable)] p-7 sm:p-9">
        <h2 className="font-display text-2xl font-semibold text-white">
          La méthode de numérisation sonore
        </h2>
        <ol className="mt-4 space-y-3 text-[15px] leading-relaxed opacity-90 list-none">
          <li>
            <strong className="text-[var(--or)]">1. Recueillir.</strong> Un conteur, un smartphone,
            un lieu calme : chaque voix compte, du griot au grand-père du quartier.
          </li>
          <li>
            <strong className="text-[var(--or)]">2. Documenter.</strong> Nom du conteur, langue,
            village, contexte : une histoire sans sa source perd la moitié de son poids.
          </li>
          <li>
            <strong className="text-[var(--or)]">3. Transcrire & traduire.</strong> Le texte
            original et sa version française marchent côte à côte sur la page du récit.
          </li>
          <li>
            <strong className="text-[var(--or)]">4. Publier avec permission.</strong> Le conteur
            valide la publication ; sa voix reste la sienne, crédité à chaque écoute.
          </li>
        </ol>
      </section>
    </div>
  );
}
