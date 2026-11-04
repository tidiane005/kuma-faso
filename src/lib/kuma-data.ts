// ===========================================================================
// POINT D'ENTRÉE DES DONNÉES ÉDITORIALES DE KUMA FASO
// ===========================================================================
// Le contenu modifiable vit dans src/content/ :
//   stories.ts    — les récits (contes, légendes, mythes, histoires)
//   regions.ts    — les 17 régions (descriptions, couleurs de la carte)
//   langues.ts    — les langues nationales et leur lexique
//   narrative.ts  — le récit interactif « Le masque du fleuve »
//   site.ts       — identité du site (nom, slogan, contact, textes d'accueil)
//
// Ce fichier ne fait que ré-exporter ces contenus pour les composants ;
// vous n'avez normalement pas besoin de le modifier.
// Guide complet : voir PERSONNALISATION.md à la racine.
// ===========================================================================

export * from "@/content/stories";
export * from "@/content/regions";
export * from "@/content/langues";
export * from "@/content/narrative";
