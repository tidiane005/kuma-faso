"use client";

// À propos : mission, méthode, limites honnêtes, contact.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Layers, Volume2, HeartHandshake } from "lucide-react";
import { SITE } from "@/content/site";

interface Props {
  onNavigate: (v: string) => void;
}

export default function AboutView({ onNavigate }: Props) {
  return (
    <div className="space-y-10 max-w-3xl">
      <header>
        <Badge className="border-0 bg-[var(--nuit)] text-white mb-3">À propos</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">
          Kuma Faso, la parole du Burkina
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
          <em>Kuma</em> signifie « la parole » en dioula ; <em>Faso</em>, « la terre des
          hommes intègres », est le nom que se donne le Burkina Faso. Kuma Faso est une plateforme
          web immersive dédiée à la préservation, la numérisation et la transmission du patrimoine
          oral burkinabè.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: MapPin,
            t: "Une carte, dix-sept régions",
            d: "La carte interactive des 17 régions administratives (découpage de 2025) sert de porte d'entrée : chaque territoire garde ses récits.",
          },
          {
            icon: Layers,
            t: "Illustrations animées",
            d: "Chaque récit possède sa scène animée dessinée en SVG, inspirée des fresques kassena, des masques et des paysages du pays.",
          },
          {
            icon: Volume2,
            t: "Bandes sonores",
            d: "Narration française intégrée à chaque récit, avec une architecture prête pour les voix en langues nationales.",
          },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl border bg-card paper-card p-5">
            <Icon className="h-6 w-6 text-[var(--terre)]" aria-hidden />
            <h2 className="mt-3 font-display text-lg font-semibold">{t}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
        <h2 className="font-display text-2xl font-semibold text-foreground">Ce que contient la plateforme</h2>
        <p>
          45 récits (contes, légendes, mythes et récits historiques) couvrent 11 régions
          du Burkina Faso. Quinze contes sont proposés en dioula, en mooré et en fulfulde, avec le
          texte dans la langue d'origine et l'enregistrement audio ; les contes dioula ont aussi
          leur version française. Les autres récits sont présentés en français.
        </p>
        <p>
          Un récit interactif original, <strong>« Le masque du fleuve »</strong>, prolonge la
          expérience : le lecteur choisit ses chemins et découvre l'une des trois fins — comme à la
          veillée, quand les enfants réclament « raconte encore autrement ! ».
        </p>
      </section>

      <section className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
        <h2 className="font-display text-2xl font-semibold text-foreground">Sources et honnêteté</h2>
        <p>
          Les récits historiques s'appuient sur des sources publiques : notice UNESCO des ruines de
          Loropéni (inscription 2009), documentation du royaume du Yatenga, du FESPACO et du film
          Wênd-Kuuni de Gaston Kaboré (1982), presse burkinabè pour le FESTIMA et le site
          archéologique d'Oursi hu-beero. Les légendes et contes sont présentés comme tels : la
          tradition orale a plusieurs versions, et la plateforme assume cette pluralité. Les
          narrations audio actuelles sont des <strong>narrations synthétiques françaises</strong>
          (aperçus de démonstration) : la vraie vie du projet, ce sont les enregistrements
          communautaires en mooré, dioula, fulfulde et autres langues du Faso.
        </p>
      </section>

      <section className="rounded-3xl bg-[var(--nuit)] text-[var(--sable)] p-7 sm:p-9">
        <HeartHandshake className="h-7 w-7 text-[var(--or)]" aria-hidden />
        <h2 className="mt-3 font-display text-2xl font-semibold text-white">Contact du projet</h2>
        <p className="mt-2 text-[15px] leading-relaxed opacity-85">
          Projet réalisé dans le cadre de l'appel « Plateforme Web Multimédia et Carte Interactive
          des Contes et Légendes du Burkina Faso ». Pour toute contribution, partenariat ou
          suggestion :
        </p>
        <a
          href={`mailto:${SITE.contactEmail}`}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
        >
          <Mail className="h-4 w-4" aria-hidden /> {SITE.contactEmail}
        </a>
        <div className="mt-6">
          <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10" onClick={() => onNavigate("contribuer")}>
            Contribuer maintenant
          </Button>
        </div>
      </section>
    </div>
  );
}
