import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Contributions des visiteurs (texte court, envoyé par le formulaire).
//
// Sur un hébergement serverless comme Vercel, il n'y a pas de base de données
// persistante par défaut. Deux modes :
//   1. CONTRIBUTIONS_WEBHOOK_URL est défini (ex. endpoint Formspree) :
//      le serveur transmet le formulaire à ce service → mode "webhook".
//   2. Sinon : le serveur répond 501 et le site bascule automatiquement sur
//      un e-mail prérempli vers l'adresse de contact (voir src/content/site.ts).
// ---------------------------------------------------------------------------

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function GET() {
  // Pas de stockage local : la liste des contributions récentes est vide
  // tant qu'un service externe n'est pas configuré.
  return NextResponse.json({ contributions: [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }
  const name = clean(body.name, 80);
  const message = clean(body.message, 4000);
  if (!name || !message) {
    return NextResponse.json(
      { error: "Le nom et le message sont obligatoires." },
      { status: 400 }
    );
  }
  const language = clean(body.language, 40) || "autre";
  const region = clean(body.region, 80) || null;
  const emailRaw = clean(body.email, 120);
  const email =
    emailRaw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) ? emailRaw : null;

  const webhook = process.env.CONTRIBUTIONS_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        error: "Aucune destination configurée",
        fallback: "mailto",
      },
      { status: 501 }
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, language, region, message }),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("POST /api/contributions:", e);
    return NextResponse.json(
      { error: "Enregistrement impossible" },
      { status: 502 }
    );
  }
}
