"use client";

// Formulaire de contribution : une histoire à préserver, une voix à enregistrer.

import { useEffect, useState } from "react";
import { Send, Loader2, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { balla } from "./balla";
import { LANGUES } from "@/lib/kuma-data";
import { SITE } from "@/content/site";

interface Contribution {
  id: string;
  name: string;
  region: string | null;
  language: string;
  message: string;
  createdAt: string;
}

export default function ContributeView() {
  const [form, setForm] = useState({ name: "", email: "", language: "moore", region: "", message: "" });
  const [sending, setSending] = useState(false);
  const [recent, setRecent] = useState<Contribution[]>([]);

  const load = () => {
    fetch("/api/contributions")
      .then((r) => r.json())
      .then((d) => setRecent(d.contributions ?? []))
      .catch(() => undefined);
  };

  useEffect(load, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast({ title: "Il manque une pièce", description: "Votre nom et votre message sont nécessaires.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 501) {
        // Aucun service externe configuré : envoi par e-mail prérempli.
        const sujet = `Contribution ${SITE.name} — ${form.name}`;
        const corps = [
          `Nom : ${form.name}`,
          form.email ? `Courriel : ${form.email}` : null,
          `Langue : ${form.language}`,
          form.region ? `Lieu : ${form.region}` : null,
          "",
          form.message,
        ]
          .filter((l) => l !== null)
          .join("\n");
        window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
        toast({
          title: "Votre messagerie s'ouvre…",
          description: `Votre contribution sera envoyée à ${SITE.contactEmail}.`,
        });
        balla("big");
        setForm({ name: "", email: "", language: "moore", region: "", message: "" });
        return;
      }
      if (!res.ok) throw new Error("échec");
      toast({
        title: "Merci, la parole est enregistrée !",
        description: "Votre contribution rejoint le grenier à histoires de Kuma Faso.",
      });
      balla("big");
      setForm({ name: "", email: "", language: "moore", region: "", message: "" });
      load();
    } catch {
      toast({ title: "Le tambour n'a pas répondu", description: "Réessayez dans un instant.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const inputCls = "bg-card";

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <Badge className="border-0 bg-[var(--terre)] text-white mb-3">Contribuer</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">
          Donnez une histoire. Prêtez une voix.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
          Vous connaissez un conte de votre village, une légende de grand-mère, une histoire vraie
          que personne n'a écrite ? Vous parlez mooré, dioula, fulfulde ou toute autre langue du
          Faso et souhaitez enregistrer une narration ? Ce formulaire est le début du chemin.
          L'équipe vous contactera pour la suite (enregistrement, transcription, publication).
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Formulaire */}
        <form onSubmit={submit} className="rounded-2xl border bg-card paper-card p-5 sm:p-7 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Votre nom *</Label>
              <Input id="c-name" className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex. Sawadogo Awa" required maxLength={80} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Courriel (pour vous recontacter)</Label>
              <Input id="c-email" type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="vous@exemple.bf" maxLength={120} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-lang">Langue du récit / de l'enregistrement</Label>
              <select
                id="c-lang"
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
              >
                {LANGUES.map((l) => (
                  <option key={l.code} value={l.code}>{l.nom}</option>
                ))}
                <option value="autre">Autre langue du Faso</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-region">Ville / village / région</Label>
              <Input id="c-region" className={inputCls} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Ex. Sabou, Centre-Ouest" maxLength={80} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-msg">Votre récit ou votre proposition *</Label>
            <Textarea
              id="c-msg"
              className={`min-h-[140px] ${inputCls}`}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Racontez en quelques lignes l'histoire que vous souhaitez préserver, ou indiquez que vous voulez enregistrer la narration d'un récit existant…"
              required
              maxLength={4000}
            />
            <p className="text-xs text-muted-foreground">{form.message.length} / 4000 caractères</p>
          </div>
          <Button type="submit" disabled={sending} className="rounded-full">
            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : <Send className="mr-2 h-4 w-4" aria-hidden />}
            {sending ? "Envoi…" : "Envoyer ma contribution"}
          </Button>
        </form>

        {/* Contributions récentes */}
        <aside className="rounded-2xl border bg-card paper-card p-5 lg:sticky lg:top-20">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-[var(--terre)]" aria-hidden /> Le grenier des voix
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Par défaut, chaque contribution est transmise par e-mail à l'équipe du projet.
            Configurez un service externe (ex. Formspree) pour les recevoir et les afficher ici —
            voir PERSONNALISATION.md.
          </p>
          <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto k-scroll pr-1">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Le grenier attend sa première contribution — peut-être la vôtre.
              </p>
            ) : (
              recent.map((c) => (
                <div key={c.id} className="rounded-xl border bg-background/50 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">{c.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{c.language}</Badge>
                  </div>
                  {c.region && <p className="text-xs text-muted-foreground mt-0.5">{c.region}</p>}
                  <p className="mt-1.5 text-[13px] text-foreground/85 line-clamp-4 leading-relaxed">{c.message}</p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
