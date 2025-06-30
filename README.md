# Voltshare

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat-square&logo=react&logoColor=black)

## Description du projet

Voltshare est une application mobile développée avec React Native qui permet aux utilisateurs de gérer des réservations de bornes de recharge pour véhicules électriques. L'application offre une interface utilisateur intuitive pour ajouter des véhicules, consulter les bornes disponibles, et effectuer des paiements en toute sécurité. 

### Fonctionnalités clés

- Gestion des comptes utilisateurs
- Réservation de bornes de recharge
- Ajout de véhicules
- Notifications de messages
- Réinitialisation de mot de passe
- Authentification à deux facteurs
- Système de messagerie

## Tech Stack

| Technologie       | Description                     |
|-------------------|---------------------------------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | Bibliothèque JavaScript pour construire des interfaces utilisateur. |
| ![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat-square&logo=react&logoColor=black) | Framework pour construire des applications mobiles. |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | Superset de JavaScript qui ajoute des types statiques. |

## Instructions d'installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Expo CLI (pour le développement avec React Native)

### Étapes d'installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Younesasn/voltshare.git
   cd voltshare
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez votre environnement :
   - Créez un fichier `.env` à la racine du projet et ajoutez vos variables d'environnement. Assurez-vous de suivre le format requis par votre application.

4. Démarrez l'application :
   ```bash
   npm start
   ```

## Utilisation

Pour exécuter l'application, utilisez la commande suivante dans le terminal :
```bash
npm start
```
Cela lancera le serveur de développement et vous pourrez scanner le code QR avec l'application Expo Go sur votre appareil mobile pour visualiser l'application.

### Exemples d'utilisation

- **Réserver une borne** : Naviguez vers l'écran de réservation pour sélectionner une borne et choisir une date.

## Structure du projet

Voici un aperçu de la structure du projet :

```
voltshare/
├── api/                                          # Gestion des requêtes API
│   └── AuthAxios.ts                  # Configuration Axios pour l'authentification
├── app/                                       # Composants de l'application
│   ├── (app)/                              # Routes de l'application
│   │   ├── account/                  # Gestion des comptes utilisateurs
│   │   ├── message/                # Gestion des messages
│   │   ├── reservation/            # Gestion des réservations
│   │   ├── _layout.tsx                # Mise en page principale
│   │   └── index.tsx                   # Point d'entrée de l'application
│   ├── borne-details/            # Détails des bornes de recharge
│   ├── forgot-password/     # Gestion de la réinitialisation du mot de passe
│   ├── add-car.tsx                    # Écran pour ajouter un véhicule
│   ├── login.tsx                          # Écran de connexion
│   └── register.tsx                     # Écran d'inscription
├── components/                   # Composants réutilisables
├── context/                              # Contextes pour la gestion de l'état
├── hooks/                                 # Hooks personnalisés
├── interfaces/                         # Interfaces TypeScript
├── screens/                             # Écrans de l'application
├── services/                            # Services pour la logique métier
├── themes/                             # Thèmes et styles
└── utils/                                     # Fonctions utilitaires
```