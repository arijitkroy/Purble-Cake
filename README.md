# Purble Cake

Purble Cake is a browser-based bakery simulation and order-fulfillment casual game built with React, TypeScript, and Vite. Inspired by assembly-line casual games, it delivers an automated production workflow where players interpret incoming customer specifications, operate multi-tiered confectionery machinery, and dispatch completed cakes down an animated conveyor belt.

The project is built entirely with original code, scalable vector assets, procedural sound synthesis, and real-time cloud leaderboard synchronization powered by Google Firebase Firestore.

---

## Architecture Overview

The application is structured into decoupled layers spanning presentation, gameplay simulation, audio synthesis, and persistence:

```
+-------------------------------------------------------------+
|                      React UI Layer                         |
|  [HeaderHUD]   [OrderQueue]   [Machinery]   [ConveyorBelt]  |
|         [StationPanel]   [Modals]   [GameIcon]              |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                     Game Engine Layer                       |
|   orderGenerator   orderValidator   scoreCalculator         |
|                State Management & Game Loop                 |
+-------------------------------------------------------------+
               |                               |
+------------------------------+ +----------------------------+
|      Web Audio Synthesizer   | |     Persistence Services   |
|   Procedural sound generator | |   Firebase Firestore Sync  |
|   Zero external asset lag    | |   Local Storage Fallback   |
+------------------------------+ +----------------------------+
```

---

## Technical Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | React 19 | Declarative UI and state orchestration |
| Language | TypeScript 5 | Strict typing across state, recipes, and APIs |
| Build Tool | Vite 8 | Ultra-fast development server and optimized bundler |
| Vector Graphics | Inline SVG + Lucide React | High-DPI scalable cake layers and UI controls |
| Sound Engine | Web Audio API | Native procedural sound synthesis with zero external assets |
| Cloud Database | Firebase Firestore | Global leaderboard persistence and real-time score retrieval |
| Local Storage | Web Storage API | Offline fallback, user preferences, and career statistics |
| Deployment Target | Vercel | Production-ready static hosting with environment variables |

---

## Key Features

### 1. Layered Scalable Vector Cake Engine
The application utilizes a custom, mathematical SVG rendering component (`Cake.tsx`) that visualizes cake states deterministically across varying viewports:
* **Base Tier:** Fluffy sponge cylinders with baked crumb texturing and specular curves (Vanilla, Chocolate, Strawberry, Lemon, Blueberry).
* **Filling Layer:** Ribbons and dollops sandwiched between sponge tiers (Sweet Cream, Cocoa Ganache, Berry Jam, Salted Caramel, Blueberry Compote).
* **Frosting Layer:** Draped glossy icing with animated drop scallops and reflective highlight curves (Buttercream, Fudge Glaze, Strawberry Whip, Mint, Royal Blueberry, Lemon Drizzle).
* **Decorations:** Surface patterns including rainbow confetti, golden stars, sugar hearts, pearl dots, piped spirals, and candy bits.
* **Toppings:** Physical garnishes including glazed cherries with green stems, ripe berries, wafer batons, embossed cocoa medallions, and swirl lollipops.

The identical rendering engine drives active conveyor carriages, customer order tickets, mistake inspection dialogs, and performance certificates.

### 2. Multi-Station Bakery Production Line
* **Base Station:** Selects batter base.
* **Filling Station:** Injects sandwiched fillings.
* **Frosting Station:** Coats tiers with glossy glazes.
* **Decoration Station:** Applies decorative sprinkles and pearls.
* **Topping Station:** Places final crowns and garnishes.
* **Conveyor Operations:** Features real-time delivery animation, layer undo functionality, and instant tray recycling.

### 3. Procedural Web Audio Synthesizer
Rather than relying on static audio files prone to latency or missing assets, the sound engine (`soundEngine.ts`) synthesizes all auditory feedback in real time using the browser's native `AudioContext`:
* Dynamic frequency modulation for mechanical presses and cream dispensers.
* Harmonic frequency ladders and arpeggios for icing application and star sprinkles.
* Ascending multi-chord fanfares for order completion and combo streaks.
* Sub-bass pulses and low-pass filtered buzzer tones for incorrect recipes.
* Gentle procedural melodic loops for background ambient music.
* Independent gain channels for sound effects and music with user-configurable mute toggles.

### 4. Game Modes
* **Classic Mode:** Endless progression across five scalable difficulty tiers. Players start with three lives. As levels increase, ingredient variety expands, timer limits tighten, and simultaneous customer tickets increase.
* **Timed Bakery:** A high-speed two-minute rush designed to test accuracy, speed, and combo maintenance under continuous time pressure.
* **Practice Kitchen:** A relaxed sandbox environment without timers or failure penalties, enabling players to study recipes and experiment freely.

### 5. Dual-Tier Persistence and Firestore Cloud Sync
* **Online Mode:** Automatically pushes completed game records (player name, score, game mode, level, cakes delivered, accuracy percentage, and server timestamp) to the `purble_leaderboard` collection in Firebase Firestore.
* **Offline Mode:** If network connectivity is unavailable or environment variables are unset, the system gracefully falls back to local storage, ensuring unbroken gameplay.

---

## Project Structure

```
purble-cake/
|-- public/
|   |-- assets/
|   |   |-- chef_muffin.jpg        # Character mascot asset
|   |   `-- bakery_backdrop.jpg    # Menu environment backdrop
|   `-- favicon.svg
|-- src/
|   |-- audio/
|   |   `-- soundEngine.ts         # Native Web Audio API procedural synthesizer
|   |-- components/
|   |   |-- bakery/
|   |   |   |-- BakeryMachinery.tsx# Animated overhead apparatus
|   |   |   |-- Cake.tsx           # Scalable vector cake renderer
|   |   |   |-- ConveyorBelt.tsx   # Conveyor assembly and carriage actions
|   |   |   `-- StationPanel.tsx   # Category tabs and ingredient selectors
|   |   |-- screens/
|   |   |   |-- GameOverModal.tsx  # Performance breakdown and grade calculation
|   |   |   |-- GameScreen.tsx     # Central gameplay workstation
|   |   |   |-- LeaderboardModal.tsx# Firestore and local high score rankings
|   |   |   |-- MainMenu.tsx       # Mode selection and navigation
|   |   |   |-- PauseModal.tsx     # State suspension and settings access
|   |   |   `-- SettingsModal.tsx  # User preferences and progress controls
|   |   `-- ui/
|   |       |-- CustomerAvatar.tsx # Vector customer critter illustrations
|   |       |-- FloatingFeedback.tsx# Animated score and combo toasts
|   |       |-- GameIcon.tsx       # Unified Lucide icon abstraction
|   |       |-- HeaderHUD.tsx      # Metrics, timers, and lives indicators
|   |       |-- InspectionModal.tsx# Side-by-side recipe mismatch diagnosis
|   |       |-- OrderQueue.tsx     # Active customer ticket stream
|   |       `-- TutorialGuide.tsx  # Contextual prompt callouts
|   |-- data/
|   |   |-- customers.ts           # Customer metadata and dialogue
|   |   |-- ingredients.ts         # Ingredient attributes, palettes, and categories
|   |   `-- levels.ts              # Progression thresholds and difficulty curves
|   |-- game/
|   |   |-- orderGenerator.ts      # Dynamic procedural recipe generation
|   |   |-- orderValidator.ts      # Multi-property cake verification engine
|   |   |-- scoreCalculator.ts     # Multipliers, speed bonuses, and letter grades
|   |   `-- types.ts               # Shared interfaces and type definitions
|   |-- services/
|   |   |-- firebase.ts            # Firestore client abstraction
|   |   `-- persistence.ts         # Local storage sync and dual-write coordinator
|   |-- styles/
|   |   `-- global.css             # Design tokens, typography, and responsive rules
|   |-- App.tsx                    # Root routing and global modal state
|   `-- main.tsx                   # DOM mount entry point
|-- .env.example                   # Environment configuration template
|-- LICENSE                        # MIT License
|-- package.json
|-- tsconfig.json
`-- vite.config.ts
```

---

## Deployment to Vercel

This application is architected and preconfigured for deployment on Vercel as a high-performance modern web application.

### 1. Repository Setup
Push the repository to GitHub, GitLab, or Bitbucket:
```bash
git remote add origin https://github.com/your-username/purble-cake.git
git branch -M main
git push -u origin main
```

### 2. Vercel Project Import
1. Navigate to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
2. Select and import the `purble-cake` repository.
3. Confirm the build settings detected by Vercel:
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
   * **Install Command:** `npm install`

### 3. Environment Variables Configuration
In the **Environment Variables** section of the Vercel project configuration, add your Firebase credentials:

| Variable Name | Description | Example Value |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication domain | `purble-cake.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Google Cloud / Firebase Project ID | `purble-cake` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Cloud Storage bucket identifier | `purble-cake.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Firebase Application identifier | `1:123456789012:web:...` |

### 4. Deploy
Click **Deploy**. Vercel will bundle the production build with Vite and distribute it globally via the Vercel Edge Network.

---

## Controls and Keybindings

| Key | Action |
|---|---|
| `1` | Switch to Base Station |
| `2` | Switch to Filling Station |
| `3` | Switch to Frosting Station |
| `4` | Switch to Decoration Station |
| `5` | Switch to Topping Station |
| `Space` | Deliver Cake down the conveyor |
| `U` | Undo last applied layer |
| `Esc` | Pause or resume the active game |
| `Mouse / Touch` | Interactive selection of tabs, ingredients, and buttons |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete details.
