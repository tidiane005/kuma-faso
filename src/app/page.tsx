import KumaApp from "@/components/kuma/KumaApp";
import { STORIES } from "@/content/stories";
import type { StoryRecord } from "@/lib/kuma-data";

// Les récits sont définis dans src/content/stories.ts : aucune base de
// données n'est nécessaire, ce qui permet un déploiement statique sur Vercel.
const stories: StoryRecord[] = STORIES;

export default function Page() {
  return <KumaApp stories={stories} />;
}
