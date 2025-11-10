# Application Mobile - Réplique Muslim Pro

Application mobile React Native / Expo qui réplique les fonctionnalités principales de Muslim Pro, avec une fonctionnalité unique de scan de calendrier de prières par OCR.

## 🌟 Fonctionnalités

### ✅ Implémentées

- **📱 Horaires de Prières**: Affichage des 5 prières quotidiennes avec indication de la prochaine prière
- **📸 Scanner de Calendrier**: Scan photo d'un calendrier de prières avec extraction OCR des horaires
- **🧭 Boussole Qibla**: Direction de la Mecque en temps réel avec boussole magnétométrique
- **📖 Lecture du Coran**: Navigation par sourates avec texte arabe
- **🏪 Magasins Halal**: Recherche et localisation de commerces halal (restaurants, boucheries, épiceries, pâtisseries)

### 🚧 À Venir

- **🔔 Notifications**: Alertes avant chaque prière
- **🌍 Géolocalisation Automatique**: Calcul automatique des horaires selon votre position
- **📚 Contenu Complet du Coran**: Tous les versets avec traduction française

## 📱 Technologies

- **React Native** avec **Expo**
- **TypeScript**
- **React Navigation** (navigation par onglets)
- **Expo Camera** (scan de calendrier)
- **Expo Location** (géolocalisation pour Qibla)
- **Expo Sensors** (magnétomètre pour boussole)
- **AsyncStorage** (sauvegarde locale)

## 🚀 Installation

### Prérequis

- Node.js (v18+)
- npm ou yarn
- Expo CLI
- Application Expo Go sur votre téléphone (iOS/Android)

### Installation des dépendances

```bash
npm install
```

### Lancement de l'application

#### Développement

```bash
# Démarrer le serveur Expo
npm start

# Scanner le QR code avec Expo Go
```

#### Android

```bash
npm run android
```

#### iOS (macOS uniquement)

```bash
npm run ios
```

#### Web

```bash
npm run web
```

## 📂 Structure du Projet

```
HProject/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Horaires de prières
│   │   ├── ScannerScreen.tsx        # Scanner OCR
│   │   ├── QiblaScreen.tsx          # Boussole Qibla
│   │   ├── QuranScreen.tsx          # Lecture du Coran
│   │   └── HalalStoreScreen.tsx     # Magasins halal
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Configuration navigation
│   ├── types/
│   │   └── index.ts                 # Types TypeScript
│   └── components/                  # Composants réutilisables
├── App.tsx                          # Point d'entrée
├── app.json                         # Configuration Expo
└── package.json                     # Dépendances
```

## 🎨 Design

L'interface s'inspire de Muslim Pro avec :
- **Couleur principale**: Vert `#1a936f`
- **Design moderne** avec cartes et ombres
- **Navigation intuitive** avec 5 onglets
- **Icônes Ionicons**
- **Police Arabic** pour les textes arabes

## 📸 Utilisation du Scanner

1. Ouvrez l'onglet **Scanner**
2. Choisissez **Prendre une photo** ou **Choisir une image**
3. Photographiez votre calendrier de prières
4. L'application extrait automatiquement les horaires
5. **Enregistrez** pour mettre à jour l'écran d'accueil

## 🧭 Utilisation de la Qibla

1. Ouvrez l'onglet **Qibla**
2. Autorisez l'accès à la localisation
3. Tournez votre appareil jusqu'à ce que la flèche verte pointe vers le nord
4. La direction de la Mecque est indiquée par l'icône de la Kaaba

## 🔒 Permissions Requises

- **📷 Caméra**: Pour scanner les calendriers
- **📍 Localisation**: Pour calculer la direction Qibla
- **🖼️ Photos**: Pour charger des images de calendriers

## 🛠️ Développement Futur

### Notifications de Prières

```bash
npm install expo-notifications
```

### OCR Réel (Google Cloud Vision)

```bash
npm install @google-cloud/vision
```

### API Horaires de Prières

- [AlAdhan API](https://aladhan.com/prayer-times-api)
- [Islamic Finder API](https://www.islamicfinder.org/api/)

### Contenu Complet du Coran

- [Quran.com API](https://quran.api-docs.io/)
- [Al Quran Cloud API](https://alquran.cloud/api)

## 📝 Notes Techniques

### OCR Actuel

L'extraction OCR est actuellement **simulée** pour la démo. Pour une implémentation réelle :

1. Utilisez **Google Cloud Vision API**
2. Ou intégrez **Tesseract.js** pour OCR local
3. Traitez l'image pour améliorer la reconnaissance
4. Parsez les horaires extraits avec regex

### Calcul des Horaires de Prières

Pour des horaires précis selon la position :

- Utilisez une bibliothèque comme `adhan` ou `prayer-times`
- Intégrez l'API AlAdhan
- Calculez selon la méthode de calcul locale

### Base de Données Magasins Halal

- Intégrez Google Places API
- Ou créez une base Firebase
- Permettez aux utilisateurs d'ajouter des magasins

## 🤝 Contribution

Cette application est un projet de démonstration. Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Projet de démonstration à but éducatif.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue.

---

**Fait avec ❤️ pour la communauté musulmane**
