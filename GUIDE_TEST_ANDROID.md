# 📱 Guide de Test sur Android

Guide complet pour tester l'application Muslim Pro Replica sur votre téléphone Android.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation d'Expo Go](#installation-dexpo-go)
3. [Lancement de l'Application](#lancement-de-lapplication)
4. [Test des Fonctionnalités](#test-des-fonctionnalités)
5. [Dépannage](#dépannage)

---

## 🔧 Prérequis

### Sur votre ordinateur :
- ✅ Node.js installé (version 18 ou supérieure)
- ✅ Le projet téléchargé dans `/home/user/HProject`
- ✅ Connexion Internet stable

### Sur votre téléphone Android :
- ✅ Android 5.0 (Lollipop) ou supérieur
- ✅ Connexion Internet (WiFi recommandé)
- ✅ Même réseau WiFi que votre ordinateur

---

## 📲 Installation d'Expo Go

### Étape 1 : Télécharger Expo Go

1. Ouvrez le **Google Play Store** sur votre téléphone Android
2. Recherchez **"Expo Go"**
3. Installez l'application officielle **"Expo Go"** (par Expo)
4. Ouvrez l'application après installation

**Lien direct** : https://play.google.com/store/apps/details?id=host.exp.exponent

---

## 🚀 Lancement de l'Application

### Sur votre ordinateur :

#### Étape 1 : Ouvrir le terminal

```bash
cd /home/user/HProject
```

#### Étape 2 : Démarrer le serveur de développement

```bash
npm start
```

**Attendez** que le serveur démarre. Vous verrez :
- Un QR code dans le terminal
- Une interface web s'ouvrir dans votre navigateur (généralement à `http://localhost:8081`)

#### Étape 3 : Vérifier la connexion

Assurez-vous de voir :
```
Metro waiting on exp://192.168.X.X:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Sur votre téléphone Android :

#### Méthode 1 : Scanner le QR Code (Recommandé)

1. Ouvrez l'application **Expo Go**
2. Appuyez sur **"Scan QR code"**
3. Pointez votre caméra vers le QR code affiché dans le terminal ou le navigateur
4. L'application commencera à se télécharger et se charger

#### Méthode 2 : Connexion Manuelle

Si le QR code ne fonctionne pas :

1. Dans Expo Go, notez l'adresse IP affichée (ex: `exp://192.168.1.100:8081`)
2. Dans le terminal, vous verrez l'URL de connexion
3. Tapez l'URL manuellement dans Expo Go : **"Enter URL manually"**

---

## 🧪 Test des Fonctionnalités

Une fois l'application chargée, testez chaque fonctionnalité :

### 1️⃣ Écran d'Accueil - Horaires de Prières

**Ce que vous devez voir :**
- En-tête vert avec votre ville (ou "Paris, France" par défaut)
- Date du jour en français
- Carte "Prochaine prière" avec le nom et l'heure
- Liste des 5 prières quotidiennes : Fajr, Dhuhr, Asr, Maghrib, Isha

**Tests à effectuer :**
- ✅ Tirez vers le bas (pull-to-refresh) pour actualiser
- ✅ Vérifiez que la prochaine prière est mise en évidence en vert
- ✅ Autorisez la localisation pour voir votre ville réelle

**Permissions requises :**
- 📍 Localisation (optionnelle pour cette page)

---

### 2️⃣ Scanner de Calendrier

**Navigation :** Appuyez sur l'onglet **"Scanner"** (icône caméra)

**Test avec la caméra :**

1. Appuyez sur **"Prendre une photo"**
2. **Autorisez l'accès à la caméra** quand demandé
3. Vous verrez l'interface caméra avec un cadre blanc
4. Positionnez un calendrier de prières dans le cadre (ou n'importe quel texte pour tester)
5. Appuyez sur le **grand bouton circulaire vert** au centre pour capturer
6. L'image sera traitée (simulation OCR de 2 secondes)
7. Vous verrez les horaires extraits (exemple avec horaires par défaut)
8. Appuyez sur **"Enregistrer"** pour sauvegarder

**Test avec une image existante :**

1. Appuyez sur **"Choisir une image"**
2. **Autorisez l'accès aux photos** quand demandé
3. Sélectionnez une image de calendrier de prières dans votre galerie
4. Suivez les mêmes étapes que ci-dessus

**Vérification :**
- ✅ Retournez à l'onglet **"Home"**
- ✅ Les horaires devraient être mis à jour avec ceux extraits

**Permissions requises :**
- 📷 Caméra (obligatoire pour prendre une photo)
- 🖼️ Stockage/Photos (obligatoire pour choisir une image)

**Note importante :** L'OCR est actuellement **simulé**. Il affichera toujours les mêmes horaires d'exemple. Pour une vraie extraction, une API OCR comme Google Cloud Vision doit être intégrée.

---

### 3️⃣ Boussole Qibla

**Navigation :** Appuyez sur l'onglet **"Qibla"** (icône boussole)

**Ce que vous devez voir :**
- Deux cartes d'information en haut :
  - Direction en degrés (ex: 118°)
  - Distance de la Mecque en km
- Grande boussole circulaire avec :
  - Points cardinaux (N, E, S, O)
  - Flèche verte pointant vers la Qibla
  - Flèche rouge pointant vers l'opposé
  - Icône de la Kaaba
- Indicateur de statut en bas

**Tests à effectuer :**

1. **Autoriser la localisation** quand demandé (obligatoire)
2. Tenez votre téléphone **à plat** (parallèle au sol)
3. **Tournez-vous lentement** dans différentes directions
4. Observez la flèche verte et l'icône Kaaba tourner en temps réel
5. Quand la flèche pointe vers le haut et que vous voyez **"Direction correcte!"**, vous êtes face à la Mecque

**Calibration du magnétomètre (si la boussole est imprécise) :**
1. Dessinez un "8" dans l'air avec votre téléphone
2. Cela calibre le magnétomètre interne
3. Répétez si nécessaire

**Permissions requises :**
- 📍 Localisation (obligatoire pour calculer la direction)
- 🧭 Capteurs (magnétomètre, automatique sur Android)

---

### 4️⃣ Lecture du Coran

**Navigation :** Appuyez sur l'onglet **"Quran"** (icône livre)

**Ce que vous devez voir :**
- En-tête vert avec texte arabe et français
- Liste de sourates avec :
  - Numéro
  - Nom en français et arabe
  - Type (Meccan/Medinan)
  - Nombre de versets

**Tests à effectuer :**

1. Faites défiler la liste des sourates
2. Appuyez sur **Al-Fatiha (1)** :
   - Un modal plein écran s'ouvre
   - Vous voyez les 7 versets en arabe
   - Chaque verset est numéroté
3. Faites défiler pour lire tous les versets
4. Appuyez sur la **flèche retour** en haut à gauche pour fermer

**Sourates complètes disponibles :**
- ✅ Al-Fatiha (1) - 7 versets
- ✅ Al-Ikhlas (112) - 4 versets
- ✅ Al-Falaq (113) - 5 versets
- ✅ An-Nas (114) - 6 versets

**Sourates partielles :**
- Pour les autres sourates (Al-Baqarah, Ya-Sin, Ar-Rahman, Al-Mulk), vous verrez un message "Contenu complet disponible prochainement"

**Permissions requises :**
- Aucune

---

### 5️⃣ Magasins Halal

**Navigation :** Appuyez sur l'onglet **"HalalStores"** (icône magasin)

**Ce que vous devez voir :**
- Barre de recherche en haut
- Filtres horizontaux par catégorie
- Liste de magasins halal avec :
  - Icône selon le type
  - Nom du magasin
  - Type (Restaurant, Boucherie, etc.)
  - Adresse
  - Note (étoiles)
  - Distance depuis votre position

**Tests à effectuer :**

1. **Recherche par texte :**
   - Tapez "Baraka" dans la barre de recherche
   - Vous devriez voir "Boucherie Halal Al-Baraka"
   - Effacez pour voir tous les résultats

2. **Filtrage par type :**
   - Appuyez sur **"Restaurants"** : voir uniquement les restaurants
   - Appuyez sur **"Boucheries"** : voir uniquement les boucheries
   - Appuyez sur **"Tous"** : voir tous les magasins

3. **Ouvrir dans Maps :**
   - Appuyez sur n'importe quel magasin
   - **Google Maps** ou votre app de navigation s'ouvre
   - L'adresse du magasin est prête pour la navigation

**Types de magasins disponibles :**
- 🍽️ Restaurants
- 🥩 Boucheries
- 🛒 Épiceries
- 🥐 Pâtisseries

**Permissions requises :**
- 📍 Localisation (optionnelle, pour calculer les distances)

**Note :** Les magasins affichés sont des exemples. Pour une vraie application, intégrez une base de données ou Google Places API.

---

## 🎯 Résumé des Tests

Utilisez cette checklist pour vérifier toutes les fonctionnalités :

### Écran d'Accueil
- [ ] Affichage des 5 prières
- [ ] Prochaine prière mise en évidence
- [ ] Pull-to-refresh fonctionne
- [ ] Localisation détectée (avec permission)

### Scanner
- [ ] Prise de photo avec caméra
- [ ] Sélection d'image depuis galerie
- [ ] Extraction simulée des horaires
- [ ] Sauvegarde et mise à jour de l'accueil

### Qibla
- [ ] Permission localisation accordée
- [ ] Boussole réagit aux mouvements
- [ ] Direction et distance affichées
- [ ] Indicateur "Direction correcte" fonctionne

### Coran
- [ ] Liste des sourates affichée
- [ ] Ouverture d'Al-Fatiha (1)
- [ ] Lecture des versets en arabe
- [ ] Fermeture du modal

### Magasins Halal
- [ ] Liste des magasins affichée
- [ ] Recherche par nom fonctionne
- [ ] Filtrage par type fonctionne
- [ ] Ouverture dans Google Maps

---

## 🐛 Dépannage

### Problème : Le QR code ne se scanne pas

**Solutions :**
1. Assurez-vous que votre téléphone et ordinateur sont sur le **même réseau WiFi**
2. Désactivez temporairement le VPN s'il est actif
3. Essayez la méthode **"Enter URL manually"** dans Expo Go
4. Redémarrez le serveur :
   ```bash
   # Appuyez sur Ctrl+C dans le terminal
   npm start -- --clear
   ```

### Problème : L'application ne se charge pas / Erreur "Unable to connect"

**Solutions :**
1. Vérifiez que le serveur tourne toujours dans le terminal
2. Sur le téléphone, fermez et rouvrez Expo Go
3. Redémarrez le serveur :
   ```bash
   npm start -- --tunnel
   ```
   (Le mode tunnel est plus lent mais fonctionne mieux avec les réseaux complexes)

### Problème : Caméra ne fonctionne pas

**Solutions :**
1. Vérifiez que vous avez **autorisé** la permission caméra
2. Allez dans **Paramètres Android** > **Applications** > **Expo Go** > **Permissions**
3. Activez manuellement la permission "Appareil photo"
4. Redémarrez l'application

### Problème : Localisation ne fonctionne pas / Qibla ne s'affiche pas

**Solutions :**
1. Activez le **GPS** dans les paramètres Android
2. Vérifiez les permissions de localisation pour Expo Go
3. Allez dans **Paramètres Android** > **Applications** > **Expo Go** > **Permissions**
4. Activez "Position" et choisissez "Autoriser tout le temps" ou "Uniquement pendant l'utilisation"
5. Redémarrez l'application

### Problème : La boussole Qibla n'est pas précise

**Solutions :**
1. **Calibrez le magnétomètre** :
   - Dessinez un "8" dans l'air avec votre téléphone
   - Faites plusieurs rotations complètes
2. Éloignez-vous des objets métalliques (voitures, ordinateurs, etc.)
3. Utilisez l'application en extérieur pour plus de précision
4. Certains téléphones ont des magnétomètres de mauvaise qualité

### Problème : L'application est lente

**Solutions :**
1. C'est normal en mode développement (plus lent qu'une app finale)
2. Fermez les autres applications sur votre téléphone
3. Utilisez une connexion WiFi stable et rapide
4. Pour une app plus rapide, construisez un APK :
   ```bash
   npx expo build:android
   ```

### Problème : Erreur "Metro bundler has encountered an error"

**Solutions :**
1. Nettoyez le cache :
   ```bash
   npm start -- --clear
   ```
2. Supprimez node_modules et réinstallez :
   ```bash
   rm -rf node_modules
   npm install
   npm start
   ```

### Problème : L'application se ferme / crash

**Solutions :**
1. Vérifiez les logs dans le terminal pour voir l'erreur
2. Dans Expo Go, secouez le téléphone pour ouvrir le menu développeur
3. Choisissez "Reload" pour recharger l'application
4. Si le problème persiste, regardez les erreurs dans le terminal

---

## 💡 Astuces

### Menu Développeur
- **Secouez votre téléphone** pour ouvrir le menu développeur
- Options disponibles :
  - Reload : Recharger l'application
  - Debug Remote JS : Déboguer avec Chrome
  - Show Performance Monitor : Afficher les FPS

### Rechargement Rapide
- Modifiez le code sur votre ordinateur
- L'application se recharge automatiquement sur le téléphone (Fast Refresh)

### Voir les Logs
Dans le terminal, appuyez sur :
- `r` : Recharger l'application
- `m` : Ouvrir le menu sur l'appareil
- `j` : Ouvrir Chrome DevTools
- `Ctrl+C` : Arrêter le serveur

---

## 📸 Captures d'Écran Attendues

### Écran d'Accueil
- En-tête vert avec localisation
- Grande carte "Prochaine prière"
- 5 cartes pour les prières (une en vert)

### Scanner
- Interface caméra avec cadre blanc
- OU sélecteur d'image
- Prévisualisation avec loader "Extraction en cours..."
- Tableau des horaires extraits avec boutons

### Qibla
- 2 cartes d'info (direction, distance)
- Grande boussole ronde avec N/E/S/O
- Flèche verte et icône Kaaba au centre
- Badge de statut en bas

### Coran
- Liste avec numéros verts et noms arabes
- Modal plein écran avec versets
- Texte arabe grand et lisible

### Magasins Halal
- Barre de recherche blanche
- Chips de filtres horizontaux
- Cartes de magasins avec icônes et infos

---

## 🎓 Prochaines Étapes

Après avoir testé l'application :

1. **Signaler les bugs** : Notez tout comportement inattendu
2. **Tester sur différents appareils** : Si possible, testez sur plusieurs téléphones Android
3. **Tester différentes permissions** : Refusez puis acceptez les permissions
4. **Construire un APK** : Pour une version plus rapide et standalone

---

## 📞 Support

Si vous rencontrez des problèmes non couverts dans ce guide :

1. Vérifiez les logs dans le terminal
2. Consultez la documentation Expo : https://docs.expo.dev
3. Vérifiez les issues GitHub du projet

---

**Bon test ! 🚀**

Si tout fonctionne correctement, vous avez maintenant une application mobile Islamic complète avec scanner de calendrier de prières !
