import React from 'react';
import { LanguageSelector } from './LanguageSelector.jsx';

export function SidePanel() {
  return (
    <aside id="panel" hidden>
      <header>
        <div>
          <div id="panel-kicker"></div>
          <h2 id="panel-title"></h2>
        </div>
        <button id="panel-close" className="round" aria-label="Close">✕</button>
      </header>
      <LanguageSelector id="panel-language" />
      <div id="panel-body"></div>
    </aside>
  );
}
