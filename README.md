# Virtual World (React)

An explorable 3D town in the browser built with React 19, Three.js, and Vite. Explore the city, customize your character, shop the Virtual Mall, modify and race cars around the Mingalar Raceway, visit the Virtual Office, test your aim at the Gun Range, and tour the five-bay Panasonic S-CLASS concept showroom.

The application features full internationalization support with synchronized Myanmar (မြန်မာ), English, and Japanese (日本語) visitor interfaces.

## Features

- **React Shell & UI**: React-driven application architecture (`App.jsx`, `HUD.jsx`, `SidePanel.jsx`, `LanguageSelector.jsx`, `StartScreen.jsx`).
- **3D World & Procedural Models**: Three.js procedural city generation with no external heavy 3D asset downloads.
- **Virtual Mall**: Tech & Fashion floors with interactive product displays, 3D clothing try-on for your avatar, and shopping cart.
- **Virtual Garage & Raceway**: 5 modifiable cars (paint, rims, spoiler, underglow, bodykit, engine, nitrous) and high-speed lap racing against AI rivals with chase and cockpit cameras.
- **Virtual Office**: Interactive business zones linking to external resources.
- **Gun Range**: Target practice mini-game with 6 firearms, custom scopes, recoil, and 60-second scoring.
- **Panasonic S-CLASS Showroom**: 5 concept layout bays (I-Type, II-Type, L-Type, Peninsula, Island) with procedural architectural models and kitchen kiosk.
- **Mini-Games**: 3-hole mini-golf and gym workout with rep counter.
- **Multi-Language Support**: Seamless live switching between English, Japanese, and Myanmar without world reconstruction.

## Getting Started

```bash
npm install
npm run dev
```

Runs the development server on `http://localhost:3000`. Add `?debug` to the URL for an FPS, draw-call, and triangle readout.

## Build

```bash
npm run build
```

Builds the production-ready React and Three.js application into `dist/`.

## Controls

| Action | Desktop | Mobile / Touch |
|---|---|---|
| Move | W A S D / Arrow keys | Left thumb virtual joystick |
| Run | Shift | Run button |
| Jump / Drift / Putt | Space | Jump / Drift / Putt button |
| Camera / Look | Mouse drag (3rd person) · Pointer lock (1st person) | Touch drag |
| Zoom | Scroll wheel | Pinch gesture |
| Interact | E | Tap prompt button |
| First / Third Person | V or 🎥 button | 🎥 button |
| Customise Avatar | C or 👕 button | 👕 button |
| Minimap Toggle | M or – button | – button / 🗺️ button |
| Exit / Close | Escape | ✕ button |
