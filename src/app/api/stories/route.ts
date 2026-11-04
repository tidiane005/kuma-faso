import { NextResponse } from "next/server";
import { STORIES } from "@/content/stories";

// Liste des récits (ordre de lecture) — servis depuis src/content/stories.ts.
// Aucune base de données : le site fonctionne en déploiement statique (Vercel).
export async function GET() {
  return NextResponse.json({
    stories: STORIES.map((s) => ({
      slug: s.slug,
      title: s.title,
      region: s.region,
      city: s.city,
      type: s.type,
      summary: s.summary,
      era: s.era,
      peoples: s.peoples,
    })),
  });
}
