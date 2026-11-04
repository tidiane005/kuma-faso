// ===========================================================================
// RÉCIT INTERACTIF « LE MASQUE DU FLEUVE » — FICHIER DE CONTENU (modifiable)
// ===========================================================================
// Une histoire dont le lecteur choisit les chemins : chaque nœud (NarrNode)
// porte un texte, des choix (Choice) et éventuellement des "drapeaux"
// (set = posés, cond/condAny/condNot = conditions) qui orientent vers l'une
// des trois fins (ending: "bonne" | "mitigee" | "lecon").
// Guide complet : voir PERSONNALISATION.md à la racine.
// ===========================================================================

export interface Choice {
  label: string;
  to: string;
  set?: string[]; // drapeaux posés
  cond?: string[]; // drapeaux requis (tous)
  condAny?: string[]; // au moins un requis
  condNot?: string[]; // drapeaux interdits (tous absents)
}
export interface NarrNode {
  id: string;
  title?: string;
  text: string;
  choices: Choice[];
  ending?: "bonne" | "mitigee" | "lecon";
}

export const NARR_TITLE = "Le masque du fleuve";
export const NARR_INTRO =
  "Un récit interactif original, inspiré des codes du conte burkinabè : à vous de choisir les chemins. Trois fins possibles — la parole du conte appartient à celui qui l'écoute.";

const FLAGS_POSITIVES = [
  "genereux",
  "partage",
  "alliee",
  "raccourci",
  "rituel",
  "pousse",
  "poli",
  "boussole",
  "partage-source",
  "malin",
];
const FLAGS_NEGATIVES = ["mepris", "fatigue", "impatient", "vite", "vol", "secret"];

export const NARRATIVE: NarrNode[] = [
  {
    id: "debut",
    title: "La saison de la craie",
    text: `La grande saison sèche a duré trop longtemps. Le marigot de Kuma-Village n'est plus qu'une craie fissurée, et les greniers commencent à parler bas. Un matin, on découvre au bord de l'eau un masque que personne ne connaît : bois sombre, yeux fermés, face tournée vers le village.\n\nLe chef réunit les jeunes : « Celui qui ira parler à l'esprit du fleuve emportera la première pluie, ou une histoire. » Le village vous regarde.`,
    choices: [
      { label: "Partir à l'aube, sans attendre", to: "route" },
      {
        label: "Consulter d'abord la vieille sage-femme",
        to: "vieille",
      },
      { label: "Suivre les traces fines du lièvre", to: "lievre" },
    ],
  },
  {
    id: "route",
    title: "La route de la craie",
    text: `Vous partez à l'aube avec une gourde, une calebasse et le silence. Sur le chemin fissuré, une silhouette boiteuse : la hyène, la langue pendante, les yeux blancs de soif.\n\n« Une goutte, dit-elle, et je te dois ma vie. » Derrière elle, le soleil grimpe comme un grenier qui brûle.`,
    choices: [
      {
        label: "Lui donner toute l'eau de la gourde",
        to: "hyene-donnee",
        set: ["genereux"],
      },
      {
        label: "Lui donner la moitié, garder la moitié",
        to: "hyene-partage",
        set: ["partage"],
      },
      {
        label: "Passer sans un mot — l'eau est pour l'esprit",
        to: "hyene-mepris",
        set: ["mepris"],
      },
    ],
  },
  {
    id: "hyene-donnee",
    title: "La dette de la hyène",
    text: `La hyène boit, se redresse, redevient presque belle. « On dit que l'esprit du fleuve ne répond qu'à ceux qui savent encore donner », dit-elle. Puis elle gratte la craie de ses pattes, longtemps, au pied d'un fromager mort.\n\nSous ses griffes, le sable change de couleur : une source cachée, emprisonnée sous la sécheresse.`,
    choices: [
      {
        label: "Continuer vers le masque avec cet indice",
        to: "masque",
        set: ["alliee"],
      },
    ],
  },
  {
    id: "hyene-partage",
    title: "La moitié donnée",
    text: `La hyène boit la moitié, vous observe boire l'autre, et hoche la tête : « Moitié par moitié : voilà un pacte honnête. » Elle vous suit de loin, sans promettre rien.\n\nPlus loin, elle aboie soudain : un banc de sable durci, où marches et empreintes descendent vers le lit asséché — le raccourci des piroguiers d'autrefois.`,
    choices: [
      {
        label: "Prendre le raccourci du banc de sable",
        to: "masque",
        set: ["raccourci"],
      },
    ],
  },
  {
    id: "hyene-mepris",
    title: "Seul sur la craie",
    text: `La hyène se retire sans un cri, mais son regard reste collé à votre dos. Le soleil monte, la gourde devient légère, la route devient longue.\n\nVous arriverez au masque plus fatigué que prévu — et la brousse, parfois, se souvient des silences.`,
    choices: [
      { label: "Affronter les épreuves seul", to: "masque", set: ["fatigue"] },
    ],
  },
  {
    id: "vieille",
    title: "La case de la vieille",
    text: `La vieille sage-femme écoute, tamise du sable entre ses doigts, puis sourit : « L'esprit du fleuve ne répond qu'à trois vérités : une parole vraie, une main qui donne, un rythme que les ancêtres reconnaissent. »\n\nElle vous remet une calebasse vide — « ne la remplis pas, offrons-la » — et une graine de sésame — « plante-la au bord de l'eau, là où tu t'arrêteras de courir ». Acceptez-vous de suivre son rituel, mot pour mot ?`,
    choices: [
      {
        label: "Suivre le rituel à la lettre",
        to: "rituel",
        set: ["rituel"],
      },
      {
        label: "Remercier, mais courir sans détour au masque",
        to: "impatient",
        set: ["impatient"],
      },
    ],
  },
  {
    id: "rituel",
    title: "La graine de sésame",
    text: `Vous marchez calmement, vous plantez la graine là où votre souffle revient. La calebasse reste vide sur votre bras.\n\nPersonne ne voit la pousse qui perce la craie pendant que vous continuez — mais la terre, elle, voit. « Le rituel n'a pas besoin de témoins », dit la vieille à ceux qui restent.`,
    choices: [{ label: "Arriver au masque, préparé", to: "masque", set: ["pousse"] }],
  },
  {
    id: "impatient",
    title: "Le coureur",
    text: `Vous courez. La calebasse vide s'entrechoque, le sable avale vos pas. Vous arrivez avant la graine, avant le souffle, avant le rythme.\n\nLe masque, devant vous, garde les yeux fermés un peu plus longtemps que prévu.`,
    choices: [{ label: "Se tenir devant le masque", to: "masque", set: ["vite"] }],
  },
  {
    id: "lievre",
    title: "Le marché du lièvre",
    text: `Les traces fines mènent à un buisson où le lièvre se lèche les moustaches. « Le passage secret ? Je le vends, dit-il, contre ta part de la première pluie. »\n\nLe lièvre, au village, a la réputation de bien creuser les puits… pour les vider ensuite.`,
    choices: [
      {
        label: "Accepter le marché",
        to: "marche-accepte",
        set: ["marche"],
      },
      {
        label: "Refuser poliment et continuer",
        to: "refus-poli",
        set: ["poli"],
      },
      {
        label: "Demander à voir le passage avant de payer",
        to: "piege-lievre",
        set: ["malin"],
      },
    ],
  },
  {
    id: "marche-accepte",
    title: "Le detour du lièvre",
    text: `Le lièvre vous conduit... vers le puits du village, en grande cérémonie. « Le passage secret, c'est de boire », rit-il en s'éloignant avec votre promesse.\n\nVous avez perdu du temps, mais compris une chose : le lièvre sait exactement où l'eau dormait avant la sécheresse.`,
    choices: [{ label: "Continuer vers le masque", to: "masque", set: ["vol"] }],
  },
  {
    id: "refus-poli",
    title: "Le refus qui rime",
    text: `« Non, lièvre. Le fleuve ne se vend pas. » Le lièvre hausse les épaules, vexé, et s'éloigne en criant son grief à travers la brousse.\n\nSes cris, paradoxalement, vous servent de boussole : ils s'éteignent toujours près du lit asséché.`,
    choices: [{ label: "Suivre le silence du lièvre", to: "masque", set: ["boussole"] }],
  },
  {
    id: "piege-lievre",
    title: "Le gardien de la source",
    text: `Le lièvre, soupçonneux, vous mène à contrecœur vers un trou ombragé où l'air est humide — une source, presque sans eau, qu'il gardait pour lui depuis le début de la sécheresse.\n\n« Personne ne savait », murmure-t-il, soudain petit. Le savoir d'un seul, ici, meurt avec un seul.`,
    choices: [
      {
        label: "Lui proposer de révéler la source au village ensemble",
        to: "masque",
        set: ["partage-source"],
      },
      {
        label: "Payer le marché et garder le secret",
        to: "masque",
        set: ["secret"],
      },
    ],
  },
  {
    id: "masque",
    title: "Devant le masque",
    text: `Le voilà. Bois sombre, yeux fermés, face tournée vers vous. Autour, la craie craque doucement. Trois épreuves s'offrent à celui qui parle au fleuve — et vous n'en traverserez qu'une.\n\nLe vent attend. Le village, au loin, attend aussi.`,
    choices: [
      { label: "Dire une parole vraie, si difficile soit-elle", to: "epreuve-verite" },
      { label: "Tendre votre gourde d'eau au masque", to: "epreuve-eau" },
      { label: "Frapper le rythme des ancêtres sur la calebasse", to: "epreuve-rythme" },
    ],
  },
  {
    id: "epreuve-verite",
    title: "La parole vraie",
    text: `« J'ai peur, dites-vous. J'ai soif, et je viens quand même. » Le masque ouvre lentement les yeux — deux cailloux de pluie.\n\nLa parole vraie, c'est la première clé. Mais la brousse juge l'ensemble de la marche, pas seulement la fin.`,
    choices: [
      {
        label: "Le masque s'incline : la première pluie",
        to: "fin-bonne",
        set: ["verite"],
        condAny: FLAGS_POSITIVES,
      },
      {
        label: "Le masque reste entre deux mondes : la pluie patiente",
        to: "fin-mitigee",
        set: ["verite"],
        condAny: FLAGS_NEGATIVES,
      },
      {
        label: "Poser la calebasse et renoncer — garder la belle histoire",
        to: "fin-lecon",
        condAny: FLAGS_NEGATIVES,
      },
    ],
  },
  {
    id: "epreuve-eau",
    title: "La main qui donne",
    text: `Vous tendez la gourde au masque. Il incline sa face de bois pour boire, puis, avec le bout du nez, désigne le sol.\n\nLà où quelqu'un a su gratter, planter ou partager, l'humidité remonte déjà de la craie.`,
    choices: [
      {
        label: "Creuser là où l'humidité remonte",
        to: "fin-bonne",
        set: ["eau"],
        condAny: ["genereux", "partage", "alliee", "pousse", "partage-source", "malin"],
      },
      {
        label: "Creuser quand même — la gourde était presque vide",
        to: "fin-mitigee",
        set: ["eau"],
        condAny: FLAGS_NEGATIVES,
      },
      {
        label: "Ne pas creuser : un puits creusé seul ne nourrit personne",
        to: "fin-lecon",
      },
    ],
  },
  {
    id: "epreuve-rythme",
    title: "Le rythme des ancêtres",
    text: `Vos doigts frappent la calebasse. Si quelqu'un vous a appris le rythme — la vieille, la hyène, le lièvre — les frappes se posent sur le tam-tam du vent.\n\nSinon, le rythme reste un enfant perdu : joli, mais sans village.`,
    choices: [
      {
        label: "Les frappes trouvent le tam-tam du vent",
        to: "fin-bonne",
        set: ["rythme"],
        condAny: ["rituel", "pousse", "alliee", "raccourci", "boussole", "poli"],
      },
      {
        label: "Le rythme erre : le masque attend encore",
        to: "fin-mitigee",
        set: ["rythme"],
        condAny: FLAGS_NEGATIVES,
      },
      {
        label: "S'arrêter : un rythme sans mémoire ne commande pas la pluie",
        to: "fin-lecon",
      },
    ],
  },
  {
    id: "fin-bonne",
    ending: "bonne",
    title: "La première pluie",
    text: `Le masque ferme les yeux, s'incline une première fois vers le village, une deuxième vers la brousse, une troisième vers vous. Puis il s'enfonce doucement dans la craie.\n\nLe premier tonnerre roule sur les greniers. La pluie tombe, droite et reconnaissante. Au village, on raconte déjà votre marche — et dans la bouche des griots, l'eau et l'histoire ont la même couleur.`,
    choices: [
      { label: "Revenir au village en héros du récit", to: "debut" },
    ],
  },
  {
    id: "fin-mitigee",
    ending: "mitigee",
    title: "La pluie patiente",
    text: `Une pluie fine s'installe, assez pour mouiller la lèvre du marigot, pas assez pour le noyer. Le masque reste au bord de l'eau, entre deux mondes.\n\n« L'esprit a répondu à moitié, dira la vieille. Il attend le reste — la prochaine parole, la prochaine main, le prochain rythme. »`,
    choices: [
      { label: "Retourner apprendre ce qui manque", to: "debut" },
    ],
  },
  {
    id: "fin-lecon",
    ending: "lecon",
    title: "L'histoire qui a coulé à votre place",
    text: `Le masque ne bouge pas. Le soleil dîne seul. Vous rentrez au village les mains vides mais la voix pleine : vous savez désormais où dort l'eau, qui la garde, et ce que l'esprit attend.\n\nEt le soir, devant les enfants, votre récit fait ce que la pluie fait aux graines : il germe. Le conte, lui, a fini par couler.`,
    choices: [
      { label: "Repartir à l'aube, avec une meilleure histoire", to: "debut" },
    ],
  },
];
