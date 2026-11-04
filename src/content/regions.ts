// ===========================================================================
// RÉGIONS DU BURKINA FASO — FICHIER DE CONTENU (modifiable librement)
// ===========================================================================
// REGION_INFO complète la carte : ville principale, description courte et
// couleur d'accent de chaque région. Le nom (la clé) doit rester identique à
// celui des formes de la carte (src/data/burkina-map.json).
// Guide complet : voir PERSONNALISATION.md à la racine.
// ===========================================================================

export interface MapRegion {
  name: string;
  path: string;
  centroid: [number, number];
  area: number;
}

export interface MapData {
  regions: MapRegion[];
  viewBox: [number, number, number, number];
  /** contour du pays (pour l'ombre et le relief en 3D) */
  outline: string;
  /** position des villes sur la carte, en unités du viewBox */
  cities: Record<string, [number, number]>;
  source: string;
}

// Les 17 régions du découpage administratif de 2025 (13 régions auparavant).
// city : chef-lieu · former : ancienne région · blurb : sens du nom et repères.
export const REGION_INFO: Record<
  string,
  { city: string; former: string; blurb: string; palette: string }
> = {
  Kadiogo: {
    city: "Ouagadougou",
    former: "Centre",
    blurb: "Kaadyoogo désignait une rivière qui coulait près du palais du Moogho Naaba. C'est le cœur du pays, autour de la capitale.",
    palette: "#C97C4A",
  },
  Bankui: {
    city: "Dédougou",
    former: "Boucle du Mouhoun",
    blurb: "« Ban » veut dire les forêts et « kui » le village : le pays des villages de la forêt, des masques et du fleuve Mouhoun.",
    palette: "#8F9E6B",
  },
  Sourou: {
    city: "Tougan",
    former: "Boucle du Mouhoun",
    blurb: "Le nom d'une rivière, bras du Mouhoun, qui arrose de vastes plaines. Nouvelle région née du découpage de 2025.",
    palette: "#6F8F7A",
  },
  "Djôrô": {
    city: "Gaoua",
    former: "Sud-Ouest",
    blurb: "Le djôrô est l'initiation pratiquée dans toute la région : le pays lobi et les ruines de Loropéni.",
    palette: "#8A5A2B",
  },
  Goulmou: {
    city: "Fada N'Gourma",
    former: "Est",
    blurb: "Le nom historique du peuple fidèle au roi de Fada N'Gourma, le Gulmu des Gourmantché.",
    palette: "#7E8E4F",
  },
  Sirba: {
    city: "Bogandé",
    former: "Est",
    blurb: "Le nom d'une rivière qui naît dans le Ganzourgou et traverse les deux provinces de la région. Nouvelle région.",
    palette: "#A9895A",
  },
  Tapoa: {
    city: "Diapaga",
    former: "Est",
    blurb: "Le nom de la principale rivière de la région, aux portes du parc du W. Nouvelle région.",
    palette: "#5F7D55",
  },
  Guiriko: {
    city: "Bobo-Dioulasso",
    former: "Hauts-Bassins",
    blurb: "Le nom de l'ancien royaume fondé au XVIIIe siècle, dont la capitale était Sya, l'actuelle Bobo-Dioulasso.",
    palette: "#B07A3F",
  },
  "Kuilsé": {
    city: "Kaya",
    former: "Centre-Nord",
    blurb: "En mooré, kuilsé veut dire les cours d'eau : la région des rivières et des lacs.",
    palette: "#A67B5B",
  },
  Liptako: {
    city: "Dori",
    former: "Sahel",
    blurb: "En fulfulde, de « liba », terrasser, et « ta-a-ko », on ne peut pas : la terre qu'on ne peut pas soumettre. Dunes d'Oursi et marchés de Gorom-Gorom.",
    palette: "#D9B26E",
  },
  Soum: {
    city: "Djibo",
    former: "Sahel",
    blurb: "Le nom d'une mare qui marque la limite entre les dunes du Séno-Mango et la savane. Nouvelle région.",
    palette: "#C9A35E",
  },
  "Nakambé": {
    city: "Tenkodogo",
    former: "Centre-Est",
    blurb: "Le nom d'un des grands fleuves du pays, qui arrose la région. Tenkodogo, « la vieille terre », berceau des royaumes mossi.",
    palette: "#B25D38",
  },
  Nando: {
    city: "Koudougou",
    former: "Centre-Ouest",
    blurb: "L'ancien nom gourounsi de la ville de Koudougou : le pays des marigots sacrés et des crocodiles de Sabou.",
    palette: "#C29B3C",
  },
  Nazinon: {
    city: "Manga",
    former: "Centre-Sud",
    blurb: "Le nom du fleuve autrefois appelé Volta rouge. C'est aussi le pays kassena et des cases peintes de Tiébélé.",
    palette: "#D9A066",
  },
  Oubri: {
    city: "Ziniaré",
    former: "Plateau-Central",
    blurb: "Oubri, petit-fils de Ouédraogo, fonda le royaume de Wogdgo. Manega, Laongo et ses granites sculptés.",
    palette: "#C48A55",
  },
  Tannounyan: {
    city: "Banfora",
    former: "Cascades",
    blurb: "En turka et en gouin, les collines ou les falaises : cascades de Karfiguéla, dômes de Fabédougou, pics de Sindou.",
    palette: "#4E8E7E",
  },
  Yaadga: {
    city: "Ouahigouya",
    former: "Nord",
    blurb: "Yaadga, petit-fils de Naaba Oubri, fonda le royaume du Yatenga, le pays des cavaliers.",
    palette: "#9E6B44",
  },
};

/** Couleur d'une région sur la carte */
export function regionTone(name: string): string {
  return REGION_INFO[name]?.palette ?? "#B07A3F";
}
