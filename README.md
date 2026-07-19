# Newsroom  — Backend API

Backend REST développé avec **NestJS** pour l'application mobile de journalisme **Newsroom **, réalisée dans le cadre d'un projet de fin d'études (PFE) pour France Télévisions.

## Sommaire

- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Modèle de données](#modèle-de-données)
- [Authentification](#authentification)
- [Variables d'environnement](#variables-denvironnement)
- [Installation et démarrage](#installation-et-démarrage)
- [Documentation des endpoints](#documentation-des-endpoints)
- [Sauvegarde automatique](#sauvegarde-automatique)

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | NestJS (Node.js) |
| Base de données | PostgreSQL (hébergée sur Neon) |
| ORM | TypeORM |
| Authentification | JWT (Passport) + Azure Entra ID (MSAL) pour les comptes institutionnels |
| Hachage des mots de passe | bcrypt |
| Tâches planifiées | `@nestjs/schedule` |
| Déploiement | Render |

## Architecture

Le backend suit l'architecture modulaire standard de NestJS : chaque domaine métier possède son **module**, son **controller** (routes HTTP), son **service** (logique métier / accès aux données via TypeORM) et ses **DTOs** (validation des payloads entrants).

```
src/
├── app.module.ts          # Module racine : connexion DB, imports des modules métier
├── main.ts                # Bootstrap Nest, CORS, seed du compte admin au démarrage
├── config/
│   ├── jwt.strategy.ts    # Stratégie Passport JWT
│   └── roles.guard.ts     # Guard + décorateur @RequireRoles pour le contrôle d'accès par rôle
├── entities/              # Entités TypeORM (schéma de base de données)
├── dto/                   # Objets de transfert de données (validation class-validator)
├── modules/                # Un module Nest par domaine métier
├── controllers/           # Routes HTTP par domaine
└── services/               # Logique métier par domaine
```

### Modules métier

- **auth** — connexion, création d'utilisateur, callback MSAL mobile
- **user** — gestion des comptes utilisateurs
- **article** — cycle de vie des articles (rédaction → validation → publication)
- **media** — fichiers médias (image/vidéo/audio) rattachés aux articles
- **agenda** — événements à couvrir par la rédaction
- **news-item** — veille informationnelle (actualités issues de sources externes)
- **source** — sources d'information (médias, agences, réseaux sociaux, etc.)
- **revision** — commentaires/relectures sur les articles
- **notification** — notifications utilisateur
- **role** — rôles applicatifs
- **ia_analyse** — historique des échanges avec l'assistant conversationnel (Gemini)
- **backup** — synchronisation automatique vers une base de secours

### Base de données double

`app.module.ts` déclare **deux connexions TypeORM** :
- `default` : la base de données principale (Neon/PostgreSQL, pilotée par `DATABASE_URL`)
- `backup` : une base de secours (pilotée par `BACKUP_DATABASE_URL`), synchronisée automatiquement chaque jour

`synchronize: true` est activé sur les deux connexions : le schéma est généré automatiquement à partir des entités TypeORM (adapté au contexte académique du projet, à revoir avant une mise en production stricte).

## Modèle de données

| Entité | Description | Relations principales |
|---|---|---|
| `User` | Compte utilisateur (email, mot de passe hashé, statut) | `Role` (N:1), `Article`/`Media`/`Revision`/`Notification`/`IAAnalyse` (1:N) |
| `Role` | Rôle applicatif (`ADMIN`, `JOURNALISTE`, `EQUIPE_MEDIA`, `CELLULE_VALIDATION`) | `User` (1:N) |
| `Article` | Article rédigé, avec statut de workflow éditorial | `User` (auteur, N:1), `Media`/`Revision` (1:N), `NewsItem` (N:N) |
| `Media` | Fichier média (image/vidéo/audio) lié à un article | `Article` (N:1, cascade suppression), `User` (N:1) |
| `Revision` | Commentaire de relecture sur un article | `Article`, `User` (N:1) |
| `Agenda` | Événement planifié à couvrir | `Source` (N:1) |
| `NewsItem` | Actualité issue de veille (source externe) | `Source` (N:1), `Article` (N:N) |
| `Source` | Source d'information (site, agence, chaîne TV, réseau social…) | `NewsItem` (1:N) |
| `Notification` | Notification adressée à un utilisateur | `User` (N:1) |
| `IAAnalyse` | Question/réponse de l'assistant IA, historisée par utilisateur | `User` (N:1) |

### Statuts d'un article (workflow éditorial)

```
Brouillon → EnAttente → Valider → Publier
                ↓
            EnRevision (renvoyé pour corrections)
                ↓
             Refuse
```

## Authentification

Le backend combine deux mécanismes d'authentification :

### 1. Connexion classique (email / mot de passe)

`POST /auth/login` — vérifie l'email et le mot de passe (bcrypt), renvoie un JWT signé contenant `sub`, `email`, `role`, `nom`, `prenom`.

### 2. Connexion via Azure Entra ID (MSAL) — comptes institutionnels

Utilisée notamment côté application d'administration :

`POST /auth/msal-mobile-callback` — reçoit un code d'autorisation OAuth2, l'échange auprès de Microsoft (`login.microsoftonline.com`), récupère le profil via Microsoft Graph, puis crée ou retrouve l'utilisateur correspondant en base et renvoie un JWT applicatif.

`POST /user/msal-login` — variante simplifiée acceptant directement un email (et nom/prénom optionnels), utile pour les flux mobiles.

> ⚠️ Le `client_id`, le `tenant_id` et le `redirect_uri` MSAL sont actuellement codés en dur dans `auth.controller.ts`. Il est recommandé de les externaliser en variables d'environnement avant tout partage public du code.

### Protection des routes

- **`AuthGuard('jwt')`** (Passport) : exige un JWT valide dans l'en-tête `Authorization: Bearer <token>`.
- **`RolesGuard` + `@RequireRoles(...)`** : restreint l'accès à certains rôles (`ADMIN`, `JOURNALISTE`, `EQUIPE_MEDIA`, `CELLULE_VALIDATION`).

À ce jour, ces guards ne sont explicitement appliqués que sur les routes du contrôleur `user` (et `auth/users`). Les autres contrôleurs (`article`, `media`, `agenda`, etc.) n'ont pas de garde JWT/rôle déclarée dans leur code — un point à considérer selon le niveau de protection souhaité pour ces ressources.

## Variables d'environnement

| Variable | Description |
|---|---|
| `PORT` | Port d'écoute du serveur (défaut : `10000`) |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL principale (Neon) |
| `BACKUP_DATABASE_URL` | Chaîne de connexion PostgreSQL de secours |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Paramètres de connexion alternatifs si `DATABASE_URL` n'est pas défini |
| `JWT_SECRET` | Clé secrète de signature des JWT |
| `ADMIN_EMAIL` | Email du compte administrateur créé automatiquement au démarrage (défaut : `admin@.ac.ma`) |
| `ADMIN_PASSWORD` | Mot de passe du compte administrateur seedé (défaut : `Admin@1234`) |

> Le SSL est activé automatiquement sur la connexion PostgreSQL si l'URL contient `neon.tech` ou `render.com`.

## Installation et démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run start:dev

# Démarrage en mode production
npm run start:prod
```

Au démarrage, l'application :
1. Se connecte aux deux bases de données (`default` et `backup`).
2. Démarre le serveur HTTP.
3. Crée un compte administrateur par défaut si celui-ci n'existe pas encore (`seedAdmin`), de manière non bloquante — un échec de cette étape n'interrompt pas le démarrage du serveur.

## Documentation des endpoints

### `POST /auth/login`
Connexion classique. Corps attendu : `{ email, motDePasse }`. Retourne `{ access_token, user }`.

### `POST /auth/users` 🔒 `ADMIN`
Création d'un utilisateur par un administrateur. Corps : `{ nom, prenom, email, motDePasse, role }`.

### `POST /auth/msal-mobile-callback`
Callback OAuth2 pour connexion via Microsoft Entra ID. Corps : `{ code }`.

### `GET /user` 🔒 `ADMIN`
Liste tous les utilisateurs.

### `GET /user/:id` 🔒 JWT requis
Détail d'un utilisateur.

### `GET /user/by-email/:email`
Recherche (ou crée) un utilisateur par email.

### `POST /user/msal-login`
Connexion/inscription simplifiée par email. Retourne `{ access_token, user }`.

### `PATCH /user/:id` 🔒 `ADMIN`
Mise à jour d'un utilisateur.

### `DELETE /user/:id` 🔒 `ADMIN`
Suppression d'un utilisateur.

### `GET /user/count-by-role/:role`
Nombre d'utilisateurs pour un rôle donné.

### `GET /user/users-by-role/:role`
Liste des utilisateurs pour un rôle donné.

---

### `POST /article`
Création d'un article. Corps : `{ titre, contenu?, statut?, categorie?, tags?, auteurId }`.

### `GET /article`
Liste tous les articles.

### `GET /article/:id`
Détail d'un article.

### `PATCH /article/:id`
Mise à jour d'un article.

### `DELETE /article/:id`
Suppression d'un article.

### `GET /article/status/:statut`
Liste les articles ayant un statut donné (ex. `EnAttente`, `Valider`, `Publier`).

### `GET /article/count/status/:statut`
Nombre d'articles ayant un statut donné.

### `GET /article/status/:statut/author/:auteurId`
Liste les articles d'un auteur ayant un statut donné.

### `GET /article/count/status/:statut/author/:auteurId`
Nombre d'articles d'un auteur ayant un statut donné.

---

### `POST /media`
Ajout d'un média. Corps : `{ type, urlFichier, titre, description?, localisation?, dateCapture? }`.

### `GET /media`
Liste tous les médias.

### `GET /media/:id`
Détail d'un média.

### `PATCH /media/:id`
Mise à jour d'un média.

### `DELETE /media/:id`
Suppression d'un média.

### `GET /media/Article/:id`
Liste les médias rattachés à un article donné.

---

### `POST /agenda`, `GET /agenda`, `GET /agenda/:id`, `PATCH /agenda/:id`, `DELETE /agenda/:id`
CRUD standard sur les événements d'agenda éditorial (`titre, resume, categorie, importance, dateDebut, dateFin, lieu, source`).

---

### `POST /news-item`
Création d'une actualité de veille.

### `GET /news-item`
Liste les actualités. Supporte des filtres optionnels en query string : `?sourceId=&date=&categorie=`.

### `GET /news-item/:id`, `PATCH /news-item/:id`, `DELETE /news-item/:id`
CRUD standard.

---

### `POST /source`, `GET /source`, `GET /source/:id`, `PATCH /source/:id`, `DELETE /source/:id`
CRUD standard sur les sources d'information.

---

### `POST /revision`, `GET /revision`, `GET /revision/:id`, `PATCH /revision/:id`, `DELETE /revision/:id`
CRUD standard sur les commentaires de relecture d'articles.

---

### `POST /notification`, `GET /notification`, `GET /notification/:id`, `PATCH /notification/:id`, `DELETE /notification/:id`
CRUD standard sur les notifications utilisateur.

---

### `POST /role`, `GET /role`, `GET /role/:id`, `PATCH /role/:id`, `DELETE /role/:id`
CRUD standard sur les rôles applicatifs.

---

### `POST /ia-analyse`
Enregistre un échange question/réponse avec l'assistant IA. Corps : `{ question, resultat, userId }`.

### `GET /ia-analyse`
Liste tous les échanges enregistrés.

### `GET /ia-analyse/history/:userId`
Historique de conversation d'un utilisateur, trié du plus ancien au plus récent (utilisé pour recharger le contexte de l'assistant au démarrage).

### `DELETE /ia-analyse/history/:userId`
Efface l'historique de conversation d'un utilisateur (nouvelle conversation).

### `GET /ia-analyse/:id`, `PATCH /ia-analyse/:id`, `DELETE /ia-analyse/:id`
CRUD standard sur une entrée d'analyse.

> **Note :** ce contrôleur gère la persistance de l'historique des échanges. L'appel effectif au modèle **Google Gemini** pour générer les réponses du chatbot est réalisé côté frontend/autre couche de service — ce backend expose uniquement le stockage et la restitution de l'historique.

## Sauvegarde automatique

Le `BackupService` exécute une tâche planifiée (`@Cron`, tous les jours à 10h) qui parcourt toutes les entités TypeORM de la base `default` et synchronise (insertion + mise à jour) leurs données vers la base `backup`. Les suppressions ne sont pas répercutées (synchronisation additive uniquement). Les résultats de chaque synchronisation sont journalisés via le `Logger` NestJS.

---

## Notes et points d'attention

- `synchronize: true` est actif sur TypeORM : adapté à un contexte de développement/PFE, mais à désactiver au profit de migrations explicites avant toute mise en production.
- Les identifiants MSAL (`client_id`, `tenant_id`, `redirect_uri`) sont actuellement en dur dans le code source plutôt qu'en variables d'environnement.
- Seuls les contrôleurs `auth` et `user` appliquent des gardes JWT/rôles ; les autres ressources (articles, médias, agenda, etc.) sont actuellement accessibles sans authentification au niveau de ce backend.
- CORS est configuré en accès ouvert (`origin: '*'`) dans `main.ts`.