import React, { useEffect } from 'react';
import { HUD } from './components/HUD.jsx';
import { SidePanel } from './components/SidePanel.jsx';
import { StartScreen } from './components/StartScreen.jsx';
import { initUIListeners } from './ui.js';
import { initGame } from './game.js';

export default function App() {
  useEffect(() => {
    initUIListeners();
    initGame();
  }, []);

  return (
    <>
      <canvas
        id="game"
        tabIndex={0}
        aria-label="Virtual World game. Use WASD or arrow keys to move and E to interact."
      ></canvas>
      <HUD />
      <SidePanel />
      <div id="fade"></div>
      <StartScreen />
    </>
  );
}
