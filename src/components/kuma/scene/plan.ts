// ===========================================================================
// DÉCOUPAGE D'UN RÉCIT EN TABLEAUX ANIMÉS
// ===========================================================================
// Chaque récit est découpé en 1 à 6 tableaux (groupes de paragraphes).
// Pour chaque tableau, on repère dans le texte :
//   - le décor (village, brousse, eau, palais, arbre, rochers, veillée),
//   - le moment (jour, soir, nuit),
//   - les personnages (jusqu'à 3),
//   - le mouvement (immobiles, en marche, en fuite).
// Le repérage se fait par mots-clés, en français et pour quelques mots
// courants en dioula et en mooré (ceux des contes du site).
//
// Pour corriger un tableau à la main, ajoutez une entrée dans SCENE_OVERRIDES
// en bas de ce fichier.
// ===========================================================================

export type Setting = "village" | "brousse" | "eau" | "palais" | "arbre" | "rochers" | "veillee" | "sahel";
export type TimeOfDay = "jour" | "soir" | "nuit";
export type Motion = "pose" | "marche" | "fuite";
export type CharacterId =
  | "lievre" | "hyene" | "lion" | "chien" | "chat" | "poule" | "elephant" | "hippo"
  | "crocodile" | "cheval" | "cavaliere" | "singe" | "chevre" | "vache" | "antilope"
  | "oiseau" | "insecte" | "crapaud" | "poisson" | "serpent" | "rongeur"
  | "roi" | "reine" | "femme" | "homme" | "enfant" | "vieux" | "chasseur" | "esprit" | "masque" | "conteur";

export interface Tableau {
  setting: Setting;
  time: TimeOfDay;
  characters: CharacterId[];
  motion: Motion;
  rain: boolean;
  fire: boolean;
  /** premier et dernier paragraphe (inclus) couverts par ce tableau */
  from: number;
  to: number;
}

/** minuscules sans accents, pour comparer les mots */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ɛ/g, "e")
    .replace(/ɔ/g, "o")
    .replace(/ŋ/g, "n")
    .replace(/ɲ/g, "ny");
}

// Mots-clés → personnages. Un mot est cherché comme mot entier (début de mot).
const CHARACTER_WORDS: Record<CharacterId, string[]> = {
  lievre: ["lievre", "soamba", "soaamba", "soaamb", "sonzan"],
  hyene: ["hyene", "katre", "katr", "suruku"],
  lion: ["lion", "lionne", "lionceau", "jara"],
  chien: ["chien", "wulu"],
  chat: ["chat", "chats", "chatte", "jakuma"],
  poule: ["poule", "coq", "poussin", "sise"],
  elephant: ["elephant"],
  hippo: ["hippopotame", "hippopotames"],
  crocodile: ["crocodile", "crocodiles", "caiman", "varan"],
  cheval: ["cheval", "chevaux", "etalon", "jument", "monture", "galop"],
  cavaliere: ["cavaliere", "cavalier", "cavaliers"],
  singe: ["singe", "singes", "guenon", "sula"],
  chevre: ["chevre", "bouc", "mouton", "belier", "brebis", "agneau"],
  vache: ["vache", "vaches", "boeuf", "taureau", "troupeau", "zebu"],
  antilope: ["antilope", "gazelle", "biche", "cob"],
  oiseau: ["oiseau", "oiseaux", "calao", "vautour", "pintade", "tourterelle", "corbeau", "aigle", "perdrix", "hibou"],
  insecte: ["cafard", "abeille", "abeilles", "mouche", "fourmi", "termite", "termites", "araignee", "ɲenbere", "nyenbere"],
  crapaud: ["crapaud", "grenouille"],
  poisson: ["silure", "silures", "poisson", "poissons"],
  serpent: ["serpent", "python", "vipere", "boa"],
  rongeur: ["ecureuil", "souris", "rat", "rats", "lezard"],
  roi: ["roi", "rois", "naaba", "chef", "prince", "empereur", "moogho", "souverain"],
  reine: ["reine", "princesse"],
  femme: ["femme", "femmes", "epouse", "mere", "fille", "coepouse", "coepouses", "maman", "vendeuse", "jeune fille", "musow", "muso"],
  homme: ["homme", "hommes", "mari", "pere", "cultivateur", "frere", "griot", "paysan", "berger", "forgeron", "marchand", "villageois", "cee"],
  enfant: ["enfant", "enfants", "fils", "garcon", "bebe", "orphelin", "orphelins"],
  vieux: ["vieux", "vieille", "vieillard", "ancien", "anciens", "grand-mere", "grand-pere", "aieul"],
  chasseur: ["chasseur", "chasseurs", "chasse", "arc", "fleche", "fusil"],
  esprit: ["genie", "genies", "esprit", "esprits", "dieu", "fantome", "sorcier", "sorciere", "ala", "allah"],
  masque: ["masque", "masques"],
  conteur: [],
};

const SETTING_WORDS: Record<Exclude<Setting, "veillee" | "sahel">, string[]> = {
  eau: ["mare", "riviere", "fleuve", "eau", "puits", "lac", "marigot", "source", "bain", "pirogue", "jii", "ji"],
  village: ["village", "case", "cases", "maison", "cour", "concession", "marche", "grenier", "cuisine", "soo", "dugu"],
  brousse: ["brousse", "foret", "champ", "champs", "savane", "chemin", "route", "colline", "kongo", "buisson"],
  palais: ["palais", "royaume", "trone", "cour royale", "dignitaires", "ministres", "sujets"],
  arbre: ["arbre", "arbres", "baobab", "karite", "tamarinier", "fromager", "branche", "branches", "yiri", "manguier", "nere"],
  rochers: ["rocher", "rochers", "pic", "pics", "pierre", "pierres", "falaise", "grotte", "ruine", "ruines", "muraille", "murs", "colline rocheuse"],
};

const NIGHT = ["nuit", "soir", "lune", "etoile", "etoiles", "veillee", "obscurite", "tenebres", "minuit", "dormir", "dort"];
const DUSK = ["coucher du soleil", "crepuscule", "aube", "matin", "aurore", "levant"];
const RAIN = ["pluie", "pluies", "orage", "pleuvoir", "pleut", "saison des pluies", "sanji"];
const FIRE = ["feu", "flamme", "flammes", "incendie", "braises"];
const WALK = ["partir", "part", "partit", "parti", "partirent", "chemin", "route", "voyage", "quitte", "quitta", "marche", "marcha", "marchent", "s'en va", "s'en alla", "en route", "taara", "taa"];
const CHASE = ["fuite", "fuit", "fuir", "enfuit", "enfuie", "court", "courir", "courut", "poursui", "poursuivi", "galop", "galope", "galopait", "boli", "chasse"];

/** décor par défaut, selon l'illustration choisie pour le récit */
const THEME_SETTING: Record<string, Setting> = {
  crocodile: "eau", hippo: "eau", puits: "village", mosquee: "village", pierre: "rochers",
  baobab: "arbre", cheval: "brousse", tamtam: "village", masque: "village", balafon: "village",
  enfant: "village", fresque: "village", elephant: "brousse", dune: "sahel",
};

function countWords(text: string, words: string[]): number {
  let n = 0;
  for (const w of words) {
    if (!w) continue;
    const re = new RegExp(`(^|[^a-z])${w.replace(/[-]/g, "\\-")}(?=[^a-z]|$)`, "g");
    const m = text.match(re);
    if (m) n += m.length;
  }
  return n;
}

function partialCount(text: string, stems: string[]): number {
  let n = 0;
  for (const s of stems) {
    const re = new RegExp(`(^|[^a-z])${s}`, "g");
    const m = text.match(re);
    if (m) n += m.length;
  }
  return n;
}

function topCharacters(text: string, max = 3): CharacterId[] {
  const scored = (Object.keys(CHARACTER_WORDS) as CharacterId[])
    .map((id) => ({ id, n: countWords(text, CHARACTER_WORDS[id]) }))
    .filter((c) => c.n > 0)
    .sort((a, b) => b.n - a.n);
  let ids = scored.map((c) => c.id);
  // Cavalière : la cavalière remplace « femme » + « cheval »
  if (ids.includes("cavaliere")) ids = ids.filter((i) => i !== "cheval" && i !== "femme");
  // la princesse remplace la femme si les deux sont là
  if (ids.includes("reine") && ids.includes("femme")) ids = ids.filter((i) => i !== "femme");
  return ids.slice(0, max);
}

export interface PlanInput {
  slug: string;
  title: string;
  summary: string;
  artTheme: string;
  /** paragraphes servant au découpage (français si disponible, sinon langue locale) */
  paragraphs: string[];
  /** true si le texte n'existe qu'en langue locale : seuls le titre et le résumé
   *  servent à choisir les personnages (le repérage dans le texte local serait trop incertain). */
  localOnly?: boolean;
}

export function buildPlan(story: PlanInput): Tableau[] {
  const override = SCENE_OVERRIDES[story.slug];
  const paras = story.paragraphs.length ? story.paragraphs : [story.summary];
  const P = paras.length;
  const T = Math.max(1, Math.min(6, P));
  const whole = norm(`${story.title} ${story.summary} ${paras.join(" ")}`);
  const storyChars = topCharacters(norm(`${story.title} ${story.summary}`), 3);
  const wholeChars = story.localOnly ? storyChars : topCharacters(whole, 3);
  const baseSetting = THEME_SETTING[story.artTheme] ?? "village";

  const tableaux: Tableau[] = [];
  let prevChars: CharacterId[] = storyChars.length ? storyChars : wholeChars;

  for (let t = 0; t < T; t++) {
    const from = Math.floor((t * P) / T);
    const to = Math.floor(((t + 1) * P) / T) - 1;
    const text = norm(paras.slice(from, to + 1).join(" "));

    // décor : le plus cité, sinon celui du récit
    let setting: Setting = baseSetting;
    let best = 0;
    for (const [k, words] of Object.entries(story.localOnly ? {} : SETTING_WORDS)) {
      const n = countWords(text, words);
      if (n > best) {
        best = n;
        setting = k as Setting;
      }
    }
    if (best === 0 && t > 0) setting = tableaux[t - 1].setting;
    if (setting === "brousse" && baseSetting === "sahel") setting = "sahel";

    const time: TimeOfDay = story.localOnly ? "jour" : countWords(text, NIGHT) > 0 ? "nuit" : countWords(text, DUSK) > 0 ? "soir" : "jour";

    let characters = story.localOnly ? [] : topCharacters(text, 3);
    if (!characters.length) characters = prevChars;
    // un personnage principal du récit reste présent s'il y a de la place
    const lead = storyChars[0];
    if (lead && !characters.includes(lead) && characters.length < 3 && countWords(text, CHARACTER_WORDS[lead]) === 0) {
      // on ne l'ajoute que s'il n'y a qu'un seul autre personnage
      if (characters.length === 1) characters = [lead, ...characters];
    }
    prevChars = characters;

    const chase = story.localOnly ? 0 : partialCount(text, CHASE);
    const walk = story.localOnly ? 0 : countWords(text, WALK);
    const motion: Motion = chase >= 2 ? "fuite" : walk + chase >= 2 ? "marche" : "pose";

    tableaux.push({
      setting,
      time,
      characters,
      motion,
      rain: !story.localOnly && countWords(text, RAIN) > 0,
      fire: (!story.localOnly && countWords(text, FIRE) > 0) || time === "nuit",
      from,
      to,
    });
  }

  // Récit sans personnage reconnu : une veillée, le conteur et les enfants autour du feu
  if (!wholeChars.length && !storyChars.length) {
    tableaux.forEach((tb) => {
      tb.setting = "veillee";
      tb.time = "nuit";
      tb.fire = true;
      tb.characters = ["conteur", "enfant", "enfant"];
      tb.motion = "pose";
    });
  }

  if (override) {
    return tableaux.map((tb, i) => ({ ...tb, ...(override[Math.min(i, override.length - 1)] ?? {}) }));
  }
  return tableaux;
}

// ---------------------------------------------------------------------------
// Corrections manuelles, tableau par tableau (facultatif).
// Exemple :
//   "la-princesse-yennenga": [
//     { setting: "palais", characters: ["roi", "reine"] },
//     { setting: "brousse", characters: ["cavaliere"], motion: "fuite" },
//   ],
// ---------------------------------------------------------------------------
export const SCENE_OVERRIDES: Record<string, Partial<Tableau>[]> = {
  "la-princesse-yennenga": [
    { setting: "palais", characters: ["roi", "cavaliere"], motion: "pose" },
    { setting: "brousse", characters: ["cavaliere", "chasseur"], motion: "pose" },
  ],
};
