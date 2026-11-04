// ===========================================================================
// LANGUES NATIONALES — FICHIER DE CONTENU (modifiable librement)
// ===========================================================================
// Ajoutez, modifiez ou retirez une langue et son petit lexique illustré.
// AUDIO_STATUT décrit, pour chaque code de langue, l'état des bandes sonores
// (disponibles ou à enregistrer) affiché sur la page « Langues ».
// Guide complet : voir PERSONNALISATION.md à la racine.
// ===========================================================================

export interface LexEntry {
  mot: string;
  sens: string;
}
export interface LangueInfo {
  code: string;
  nom: string;
  famille: string;
  parlée: string;
  entries: LexEntry[];
}
export const LANGUES: LangueInfo[] = [
  {
    code: "moore",
    nom: "Mooré",
    famille: "Langue oti-volta (groupe gur)",
    parlée: "Kadiogo, Oubri, Yaadga, Kuilsé, Nakambé, Nazinon…",
    entries: [
      { mot: "Laafi", sens: "paix, bien-être, santé" },
      { mot: "Wẽnd", sens: "Dieu" },
      { mot: "Bende", sens: "masque (d'où « bendrologie »)" },
      { mot: "Naaba", sens: "roi, chef" },
      { mot: "Biiga", sens: "enfant" },
    ],
  },
  {
    code: "dioula",
    nom: "Dioula (Jula)",
    famille: "Langue mandé",
    parlée: "Guiriko, Tannounyan, Bankui, Sourou, grandes villes",
    entries: [
      { mot: "I ni sogoma", sens: "bonjour (le matin)" },
      { mot: "Kuma", sens: "parole, discours — d'où « Kuma Faso »" },
      { mot: "Jeli", sens: "griot, gardien de mémoire" },
      { mot: "Daba", sens: "houe, outil de culture" },
      { mot: "Baraka", sens: "bénédiction, chance partagée" },
    ],
  },
  {
    code: "fulfulde",
    nom: "Fulfulde",
    famille: "Langue atlantique (peule)",
    parlée: "Liptako, Soum, Sirba, Yaadga",
    entries: [
      { mot: "Jam", sens: "paix" },
      { mot: "Nagge", sens: "vache, zébu" },
      { mot: "Pullo", sens: "berger peul (singulier)" },
      { mot: "Pulaaku", sens: "code d'honneur et de retenue peul" },
      { mot: "Fulɓe", sens: "les Peuls" },
    ],
  },
];

export const AUDIO_STATUT: Record<
  string,
  { dispo: boolean; note: string }
> = {
  fr: {
    dispo: true,
    note: "Narration synthétique française (aperçu) — chaque récit possède sa bande sonore.",
  },
  moore: {
    dispo: false,
    note: "À enregistrer : votre voix peut être la première. Via le formulaire « Contribuer ».",
  },
  dioula: {
    dispo: false,
    note: "À enregistrer : votre voix peut être la première. Via le formulaire « Contribuer ».",
  },
  fulfulde: {
    dispo: false,
    note: "À enregistrer : votre voix peut être la première. Via le formulaire « Contribuer ».",
  },
};
