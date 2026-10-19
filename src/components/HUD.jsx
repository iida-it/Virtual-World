import React from 'react';
import { LanguageSelector } from './LanguageSelector.jsx';

export function HUD() {
  return (
    <div id="hud">
      <div id="hud-top" className="pill" hidden></div>
      <div id="top-right">
        <LanguageSelector id="hud-language" />
        <button id="cart-chip" className="pill" hidden></button>
        <button id="btn-customize" className="pill" title="Customise your character (C)">👕 Avatar</button>
        <button id="btn-view" className="pill" title="Switch camera (V)">🎥 3rd</button>
        <button id="help-btn" className="round" aria-label="Controls">?</button>
      </div>
      <div id="help" className="card" hidden></div>

      <div id="minimap">
        <div id="minimap-frame">
          <canvas id="minimap-canvas"></canvas>
          <span className="n">N</span>
          <button id="minimap-toggle" aria-label="Minimise map" title="Minimise map (M)">–</button>
        </div>
        <button id="minimap-open" className="round" aria-label="Show map" title="Show map (M)">🗺️</button>
      </div>

      <div id="crosshair"><i></i><i></i><i></i><i></i></div>
      <div id="scope"></div>
      <div id="power" hidden><div id="power-fill"></div></div>
      <div id="hint" hidden></div>
      <button id="prompt" className="pill" hidden></button>
      <div id="toasts"></div>

      <div id="joy" hidden><div id="joy-knob"></div></div>
      <div id="touch-btns" hidden>
        <button id="btn-fire" className="round big" hidden>Fire</button>
        <button id="btn-run" className="round big">Run</button>
        <button id="btn-jump" className="round big">Jump</button>
      </div>
    </div>
  );
}
