# Kuma Faso — la parole du Burkina

**Site en ligne : https://kuma-faso.vercel.app**

Plateforme web immersive de préservation et de transmission du patrimoine oral
burkinabè : carte interactive des 17 régions (découpage de 2025), contes, légendes et récits
historiques illustrés et sonorisés, récit interactif, lexique des langues
nationales et formulaire de contribution.

## Démarrage rapide

```bash
npm install        # ou : bun install
npm run dev        # le site tourne sur http://localhost:3000
```

Autres commandes :

```bash
npm run lint       # vérification du code (ESLint)
npm run build      # build de production (testé avant chaque déploiement)
npm start          # sert le build de production en local
```

## Personnaliser le site

**Tous les contenus modifiables sont centralisés dans `src/content/` :**

| Fichier | Contenu |
| --- | --- |
| `src/content/site.ts` | Nom du site, slogan, textes d'accueil, e-mail de contact, référencement |
| `src/content/stories.ts` | Les récits (contes, légendes, mythes) : ajout, modification, suppression |
| `src/content/langues.ts` | Langues nationales et lexique |
| `src/content/regions.ts` | Les 17 régions : chef-lieu, ancienne région, sens du nom, couleur |
| `src/content/narrative.ts` | Le récit interactif « Le masque du fleuve » |

Les couleurs du site se changent dans `src/app/globals.css` (variables
`--terre`, `--or`, `--sable`, `--nuit`), les polices dans `src/app/layout.tsx`.

👉 **Guide détaillé pas à pas : voir [PERSONNALISATION.md](./PERSONNALISATION.md).**

## Déployer sur Vercel

Aucune base de données ni variable d'environnement n'est nécessaire : le site
se déploie tel quel, en quelques minutes.

👉 **Guide pas à pas : voir [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md).**

## Structure du projet

```
src/
  app/                 Pages et API Next.js (App Router)
    api/stories/       Liste des récits (JSON)
    api/contributions/ Réception des contributions (webhook ou e-mail)
  components/kuma/     Interface du site (accueil, carte, contes, lecteur…)
  content/             ★ CONTENUS MODIFIABLES (récits, textes, langues…)
  data/burkina-map.json  Formes SVG simplifiées des 17 régions et position des villes
public/
  audio/               Bandes sonores : un fichier <slug>.mp3 par récit
```

## Crédits

- Contes, légendes et histoires : patrimoine oral burkinabè ; les récits
  historiques s'appuient sur des sources publiques (UNESCO, presse burkinabè).
- Frontières administratives : provinces [Natural Earth](https://www.naturalearthdata.com) (domaine public), regroupées selon le découpage de 2025 en 17 régions,
  simplifiées en SVG pour la carte interactive.
- Illustrations animées : dessins SVG originaux inspirés des fresques kassena,
  des masques et des paysages du Burkina Faso.

Contact : Odilon.simpore@gobelab.org — Projet GOBELAB.
