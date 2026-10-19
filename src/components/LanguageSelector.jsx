import React, { useState, useEffect } from 'react';
import { LANGUAGES, getLanguage, setLanguage, t, onLanguageChange } from '../i18n/i18n.js';

export function LanguageSelector({ id }) {
  const [lang, setLang] = useState(() => getLanguage());

  useEffect(() => {
    return onLanguageChange((newLang) => {
      setLang(newLang);
    });
  }, []);

  return (
    <label className="language-control">
      <span data-language-caption="">{t('language.label')}</span>
      <select
        id={id}
        data-language-selector=""
        value={lang}
        aria-label={t('language.label')}
        onChange={(e) => {
          setLanguage(e.target.value);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key !== 'Escape' && e.key !== 'Tab') e.stopPropagation();
        }}
        onKeyUp={(e) => {
          if (e.key !== 'Escape' && e.key !== 'Tab') e.stopPropagation();
        }}
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
