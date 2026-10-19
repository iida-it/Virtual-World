import React from 'react';
import { LanguageSelector } from './LanguageSelector.jsx';

export function StartScreen() {
  return (
    <div id="start">
      <div className="start-card">
        <div className="start-kicker">Welcome to</div>
        <h1>Virtual World</h1>
        <p id="start-controls"></p>
        <LanguageSelector id="welcome-language" />
        <button id="start-btn" disabled>Loading…</button>
      </div>
    </div>
  );
}
