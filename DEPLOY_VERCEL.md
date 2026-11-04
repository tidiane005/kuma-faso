# Déployer Kuma Faso sur Vercel — guide pas à pas

Le site est prêt pour Vercel : **pas de base de données, pas de variable
d'environnement obligatoire**. Le déploiement prend environ 5 minutes.
Vercel héberge ce site gratuitement (plan Hobby), y compris avec un domaine
personnalisé.

---

## Méthode recommandée : GitHub + Vercel (redéploiement automatique)

Avec cette méthode, chaque fois que vous modifiez le site et poussez sur
GitHub, Vercel met la version en ligne à jour tout seul.

### Étape 1 — Mettre le code sur GitHub

1. Créez un compte gratuit sur [github.com](https://github.com) si besoin.
2. Créez un **nouveau dépôt** (bouton « New repository »), par exemple
   `kuma-faso`, en **privé** ou public, **sans** fichier initial
   (pas de README ajouté par GitHub).
3. Dans un terminal, **dans le dossier du projet** :

```bash
git init
git add .
git commit -m "Kuma Faso — première version"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/kuma-faso.git
git push -u origin main
```

(Remplacez `VOTRE-COMPTE` par votre nom d'utilisateur GitHub. GitHub vous
demandera de vous connecter au premier `push`.)

### Étape 2 — Importer le projet dans Vercel

1. Créez un compte sur [vercel.com](https://vercel.com) avec
   « Sign Up with GitHub » (le plus simple).
2. Cliquez sur **« Add New… → Project »**, puis **« Import »** à côté du
   dépôt `kuma-faso`.
3. Vercel détecte Next.js tout seul. **Ne changez aucun réglage** :
   - Framework Preset : *Next.js* (automatique)
   - Build Command : `next build` (automatique)
   - Environment Variables : **laissez vide**
4. Cliquez sur **« Deploy »** et patientez 2–3 minutes.

Votre site est en ligne sur une adresse du type
`https://kuma-faso.vercel.app` — c'est tout !

### Étape 3 — Publier vos modifications (plus tard)

Après chaque personnalisation :

```bash
git add .
git commit -m "Description de la modification"
git push
```

Vercel redéploie automatiquement en environ 2 minutes.

## Méthode alternative : ligne de commande Vercel

Sans passer par GitHub :

```bash
npm install -g vercel
vercel login          # première fois : créez votre compte
vercel --prod         # dans le dossier du projet : déploie en ligne
```

## Nom de domaine personnalisé (optionnel)

1. Achetez un domaine (ex. `kumafaso.bf`) chez un registrar (OVH, Namecheap,
   NIC-BF…).
2. Dans Vercel : votre projet → **Settings → Domains → Add**, entrez le
   domaine.
3. Copiez les enregistrements DNS affichés par Vercel (un `CNAME` ou des `A`)
   dans l'interface de votre registrar. Le certificat HTTPS est automatique.

## Le formulaire de contribution en ligne

- **Par défaut** : le formulaire ouvre la messagerie du visiteur avec un
  message prérempli vers l'adresse définie dans `src/content/site.ts`
  (`contactEmail`). Aucun réglage nécessaire.
- **Pour centraliser les contributions** (recommandé à terme) :
  1. Créez un formulaire sur [formspree.io](https://formspree.io) (plan
     gratuit : 50 envois/mois) et copiez son URL (`https://formspree.io/f/…`).
  2. Vercel → votre projet → **Settings → Environment Variables** → ajoutez :
     - Name : `CONTRIBUTIONS_WEBHOOK_URL`
     - Value : l'URL Formspree
     - Environments : Production, Preview, Development
  3. **Redeploy** (onglet Deployments → Redeploy) pour appliquer la variable.

## Questions fréquentes

**Le déploiement échoue ?** Vérifiez que `npm run build` passe en local : si
Vercel échoue, c'est pour la même raison, et son journal d'erreur (onglet
Deployments) indique la ligne fautive.

**Les sons ne se jouent pas ?** Les fichiers doivent être dans `public/audio/`
et nommés `<slug>.mp3`. Après un ajout, refaites un `git push`.

**Vercel est-il vraiment gratuit ?** Le plan Hobby couvre largement un site
comme celui-ci (bande passante généreuse, HTTPS, domaines). Les fonctions
serveur (l'API des contributions) ont un quota quotidien très supérieur à
l'usage réel du site.

**Puis-je ajouter une vraie base de données plus tard ?** Oui : Vercel propose
des bases Postgres gérées (Vercel Postgres/Neon, plan gratuit) ou Supabase.
L'architecture actuelle (contenus dans `src/content/`) reste tout à fait
valable : la base ne serait utile que pour stocker les contributions et les
enregistrements en langues nationales.

**Mettre à jour le site depuis un autre ordinateur ?** Clonez le dépôt
(`git clone https://github.com/VOTRE-COMPTE/kuma-faso.git`), puis
`npm install` et `npm run dev`.
