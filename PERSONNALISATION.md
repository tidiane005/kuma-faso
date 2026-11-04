# Personnaliser Kuma Faso — guide pas à pas

Ce guide s'adresse à toute personne qui veut modifier le site sans être
expert(e). Aucune base de données, aucun réglage caché : **tout le contenu
modifiable est réuni dans le dossier `src/content/`**. Après chaque
modification, le site se met à jour tout seul (en local : enregistrez le
fichier, le navigateur se rafraîchit ; après déploiement : Vercel redéploie
automatiquement à chaque `git push`).

> Astuce : testez d'abord en local (`npm run dev`), puis publiez.

---

## 1. Changer le nom du site, le slogan, l'e-mail, les textes d'accueil

**Fichier : `src/content/site.ts`**

Tout est regroupé et commenté dans ce fichier :

- `name` : le nom du site (en-tête, page d'accueil, onglet du navigateur) ;
- `tagline` : le slogan affiché sous le grand titre ;
- `baseline` et `mission` : les deux lignes du pied de page ;
- `heroBadge`, `heroText` : le bandeau et le paragraphe d'accueil ;
- `missionTitle`, `missionText` : l'encadré foncé « Préserver. Numériser… » ;
- `contactEmail` : l'adresse utilisée par le pied de page, la page « À propos »
  **et le formulaire de contribution** (e-mail de secours) ;
- `project` : la mention du projet (pied de page) ;
- `meta` : titre et description vus par Google et les réseaux sociaux.

Modifiez le texte entre guillemets, enregistrez : c'est tout. Le nom et
l'e-mail se mettent à jour automatiquement partout sur le site.

## 2. Ajouter, modifier ou retirer un récit

**Fichier : `src/content/stories.ts`** — c'est le cœur du site.

Chaque récit est un bloc `{ … }` du tableau `RAW_STORIES`. Pour **ajouter un
récit** : copiez un bloc existant, collez-le à la fin du tableau (avant le
`]` final), puis changez ses champs :

| Champ | Rôle | Conseils |
| --- | --- | --- |
| `slug` | identifiant unique | minuscules, sans accent ni espace, avec des tirets : `ma-nouvelle-histoire` |
| `title` | titre affiché | — |
| `region` | région de la carte | **copiez exactement** un des noms listés dans `src/content/regions.ts` (ex. `"Kuilsé"` ou `"Djôrô"`, avec la majuscule et les accents) |
| `city` | lieu principal | facultatif |
| `type` | catégorie | `"conte"`, `"legende"` ou `"histoire"` (sans accent) |
| `artTheme` | illustration animée | une valeur de la liste ci-dessous |
| `summary` | résumé court | 1–2 phrases, affiché sur les cartes |
| `content` | texte complet | les paragraphes sont séparés par une ligne vide à l'intérieur des apostrophes inversées `` `…` `` |
| `moral` | leçon du récit | facultatif |
| `era` | époque | ex. `"XIXᵉ siècle"` |
| `peoples` | peuples / langues | séparés par `", "` |
| `moment` | moment d'écoute conseillé | facultatif |
| `order` | ordre de lecture | un nombre : 1, 2, 3… |

Valeurs possibles pour `artTheme` (thème de l'illustration animée) :
`cheval`, `tamtam`, `masque`, `mosquee`, `pierre`, `hippo`, `balafon`,
`baobab`, `enfant`, `crocodile`, `fresque`, `elephant`, `dune`, `puits`.

Pour **retirer un récit** : supprimez son bloc (ou renommez le tableau pour
garder une archive). Pour **réordonner** : changez les `order`.

### Ajouter la bande sonore d'un récit

Déposez un fichier MP3 dans `public/audio/` nommé **exactement**
`<slug>.mp3` (ex. `public/audio/ma-nouvelle-histoire.mp3`). Le lecteur du site
le détecte tout seul ; s'il est absent, le site le signale poliment.
Le slug et le nom du fichier doivent être identiques, c'est la seule règle.

## 3. Changer les couleurs du site

**Fichier : `src/app/globals.css`** — cherchez le bloc `:root` (vers la
ligne 69) :

```css
--terre: oklch(0.545 0.165 42);  /* couleur principale (terracotta) */
--or:    oklch(0.79 0.135 78);   /* doré */
--nuit:  oklch(0.235 0.035 45);  /* brun très foncé (encadrés) */
--sable: oklch(0.955 0.022 84);  /* fond crème */
```

Remplacez les valeurs par d'autres couleurs. Le format `oklch()` peut être
remplacé par du classique : `--terre: #A63B12;` fonctionne aussi. Il existe un
second bloc `.dark` plus bas pour le mode sombre, même principe.
Les couleurs des **types de récit** (Conte / Légende / Histoire) sont dans
`src/content/stories.ts` (`TYPE_COLORS`) et celles de la **carte** dans
`src/content/regions.ts`.

## 4. Changer les polices

**Fichier : `src/app/layout.tsx`** (lignes 7–16) : remplacez `Fraunces`
(titres) et `Outfit` (textes) par une autre police Google Fonts :

```tsx
const fraunces = Fraunces({ ... })   // → importez p. ex. Playfair_Display
```

puis mettez à jour la classe `font-display` dans `src/app/globals.css`
(variable `--font-fraunces`).

## 5. Modifier les langues nationales et le lexique

**Fichier : `src/content/langues.ts`** : ajoutez une langue (copiez un bloc,
changez `code`, `nom`, `famille`, `parlée`) et son lexique (5 mots suffisent).
`AUDIO_STATUT` décrit l'état des bandes sonores par langue (disponibles ou
« à enregistrer ») affiché sur la page Langues.

## 6. Modifier le récit interactif « Le masque du fleuve »

**Fichier : `src/content/narrative.ts`**. Chaque scène est un nœud
`{ id, title, text, choices }`. Un choix peut :

- mener à une autre scène : `to: "id-de-la-scène"`;
- poser des drapeaux : `set: ["genereux"]` ;
- exiger des drapeaux : `cond` (tous), `condAny` (au moins un), `condNot` (aucun).

Trois nœuds de fin portent `ending: "bonne" | "mitigee" | "lecon"`.
Conservez ces trois fins et vérifiez que chaque `to` pointe vers un `id`
existant.

## 7. Modifier la carte

- **Descriptions, villes et couleurs des régions** : `src/content/regions.ts`
  (`REGION_INFO` — la clé doit rester le nom exact de la région).
- **Formes géographiques** : `src/data/burkina-map.json` (SVG simplifié).
  Les couleurs de fond des régions viennent de `MAP_TONES` (même fichier).

## 8. Textes plus spécifiques (page Contes, À propos, formulaire…)

Les textes propres à chaque page vivent dans les composants correspondants de
`src/components/kuma/` : `ContesView.tsx` (bibliothèque), `AboutView.tsx`
(à propos), `ContributeView.tsx` (formulaire), `MapView.tsx` (légende de la
carte), `LanguagesView.tsx` (page langues). Ce sont des fichiers React simples :
repérez la chaîne de caractères française à modifier, changez-la, enregistrez.

## 9. Le formulaire de contribution : où arrivent les messages ?

Deux modes, sans code à écrire :

1. **Par défaut (recommandé pour démarrer)** : quand un visiteur envoie le
   formulaire, son logiciel de messagerie s'ouvre avec un message prérempli
   adressé à `contactEmail` (défini dans `src/content/site.ts`).
2. **Service externe (Formspree ou équivalent)** : créez un formulaire sur
   [formspree.io](https://formspree.io) (gratuit), copiez l'URL du type
   `https://formspree.io/f/xxxxxxx`, puis définissez la variable
   `CONTRIBUTIONS_WEBHOOK_URL` (en local : fichier `.env` ; sur Vercel :
   Settings → Environment Variables). Les contributions y sont alors stockées
   et vous recevez un e-mail à chaque envoi.

## 10. Vérifier avant de publier

```bash
npm run lint     # le code est propre
npm run build    # le site se construit sans erreur
```

Si ces deux commandes passent, le déploiement Vercel passera aussi.
En cas de doute après une modification de `stories.ts`, le message d'erreur de
`npm run build` indique précisément la ligne fautive (souvent : une virgule
manquante entre deux blocs, ou un guillemet non fermé).
