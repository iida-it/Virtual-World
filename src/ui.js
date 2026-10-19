// Thin wrapper around the DOM overlay. The 3D world never touches the DOM directly.
import { t, message, resolve, onLanguageChange, languageSelector } from './i18n/i18n.js';
const $ = (id) => (typeof document !== 'undefined' ? document.getElementById(id) : null);

export const el = {
  get prompt() { return $('prompt'); },
  get hudTop() { return $('hud-top'); },
  get hint() { return $('hint'); },
  get power() { return $('power'); },
  get fill() { return $('power-fill'); },
  get toasts() { return $('toasts'); },
  get panel() { return $('panel'); },
  get kicker() { return $('panel-kicker'); },
  get title() { return $('panel-title'); },
  get body() { return $('panel-body'); },
  get close() { return $('panel-close'); },
  get cart() { return $('cart-chip'); },
  get help() { return $('help'); },
  get helpBtn() { return $('help-btn'); },
};

let promptText = null;
let promptTap = null;
let current = null; // open panel descriptor
let hintSource = null, hudSource = null;
const toastSources = new Map();

export function ensurePanelLanguage() {
  const panel = $('panel');
  const body = $('panel-body');
  if (panel && body && !$('panel-language')) {
    const panelLanguage = languageSelector('panel-language');
    panel.insertBefore(panelLanguage, body);
  }
}

function controlKey(node) {
  if (!node) return null;
  if (node.id) return `id:${node.id}`;
  return [...node.attributes].filter(a => a.name.startsWith('data-')).map(a => `${a.name}=${a.value}`).join('|') || null;
}
function renderHud(source) {
  const hudTop = el.hudTop;
  if (!hudTop) return;
  const callbacks = new Map([...hudTop.querySelectorAll('button[id]')].map(n => [n.id, n.onclick]));
  const html = resolve(source);
  hudTop.hidden = !html;
  if (html) hudTop.innerHTML = html;
  for (const button of hudTop.querySelectorAll('button[id]')) if (callbacks.has(button.id)) button.onclick = callbacks.get(button.id);
}

export function initUIListeners() {
  el.prompt?.addEventListener('click', () => promptTap && promptTap());
  el.close?.addEventListener('click', () => ui.closePanel());
  el.helpBtn?.addEventListener('click', () => { if (el.help) el.help.hidden = !el.help.hidden; });
}

// One listener for the shared panel; only showroom dialogs request modal ownership.
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if (!current?.modal) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); ui.closePanel(); return; }
    if (e.key !== 'Tab') return;
    const panel = el.panel;
    if (!panel) return;
    const controls = [...panel.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter((n) => n.getClientRects().length);
    const first = controls[0] || panel, last = controls.at(-1) || panel;
    if (!panel.contains(document.activeElement) || (e.shiftKey && document.activeElement === first) || (!e.shiftKey && document.activeElement === last)) {
      e.preventDefault(); (e.shiftKey ? last : first).focus();
    }
  }, true);
}

export const ui = {
  /** Show "[E] label" at the bottom, or hide with null. */
  prompt(label, onTap, touch) {
    label = resolve(message(label));
    if (label === promptText) return;
    promptText = label;
    promptTap = onTap || null;
    el.prompt.hidden = !label;
    if (label) el.prompt.innerHTML = `<kbd>${touch ? t('controls.tap') : 'E'}</kbd>${label}`;
  },

  toast(text, ms = 2200) {
    const node = document.createElement('div'), source = message(text);
    node.className = 'toast'; node.textContent = resolve(source);
    toastSources.set(node, source); el.toasts.appendChild(node);
    while (el.toasts.children.length > 3) { toastSources.delete(el.toasts.firstChild); el.toasts.firstChild.remove(); }
    setTimeout(() => { node.style.opacity = '0'; setTimeout(() => { toastSources.delete(node); node.remove(); }, 320); }, ms);
  },

  /** Top-centre status pill (used by mini-games). */
  hud(html) {
    hudSource = html; renderHud(html);
    return el.hudTop;
  },
  hint(text) { hintSource = message(text); el.hint.hidden = !text; el.hint.textContent = resolve(hintSource) || ''; },
  power(v) {
    el.power.hidden = v === null;
    if (v !== null) el.fill.style.width = Math.round(v * 100) + '%';
  },

  setHelp(html) { el.help.innerHTML = html; },
  hideHelp() { el.help.hidden = true; },

  setCart(count, onClick) {
    el.cart.hidden = count === 0;
    el.cart.textContent = `🛒 ${count}`;
    el.cart.setAttribute('aria-label', t('mall.viewCart', { count }));
    el.cart.onclick = onClick;
  },

  /** Open the side panel. `zone` (optional) lets the game close it when you walk away. */
  openPanel({ kicker = '', title, body, zone = null, onClose = null, modal = false, render = null }) {
    if (current) ui.closePanel();
    const opener = document.activeElement;
    current = { zone, onClose, modal, opener, render, kicker, title };
    el.kicker.textContent = resolve(message(kicker));
    el.title.textContent = resolve(message(title));
    el.body.replaceChildren(body);
    el.body.scrollTop = 0;
    el.panel.hidden = false;
    // A newly opened explanation starts at its prose, including on mobile.
    el.body.scrollTop = 0;
    document.body.classList.add('panel-open');
    if (modal) {
      el.panel.setAttribute('role', 'dialog');
      el.panel.setAttribute('aria-modal', 'true');
      el.panel.setAttribute('aria-labelledby', 'panel-title');
      el.panel.tabIndex = -1;
      document.getElementById('hud').inert = true;
      document.getElementById('game').inert = true;
      el.close.focus({ preventScroll: true });
    }
  },
  /** Refresh the same owner/body; no close callback, resume or listener rebinding. */
  refreshPanel() {
    if (!current) return;
    const focus = controlKey(document.activeElement), scroll = el.body.scrollTop;
    const inputs = new Map([...el.body.querySelectorAll('input, select, textarea')].map(n => [controlKey(n), { value: n.value, checked: n.checked, start: n.selectionStart, end: n.selectionEnd }]));
    const content = current.render?.() || {};
    el.kicker.textContent = resolve(message(content.kicker ?? current.kicker));
    el.title.textContent = resolve(message(content.title ?? current.title));
    for (const node of el.body.querySelectorAll('input, select, textarea')) {
      const saved = inputs.get(controlKey(node));
      if (!saved) continue;
      node.value = saved.value; if ('checked' in node) node.checked = saved.checked;
      if (saved.start !== null && node.setSelectionRange) { try { node.setSelectionRange(saved.start, saved.end); } catch { /* non-text input */ } }
    }
    const target = focus && [...el.panel.querySelectorAll('button, a, input, select, textarea')].find(n => controlKey(n) === focus);
    target?.focus({ preventScroll: true });
    el.body.scrollTop = Math.min(scroll, Math.max(0, el.body.scrollHeight - el.body.clientHeight));
  },
  closePanel() {
    if (!current) return false;
    const c = current;
    current = null;
    el.panel.hidden = true;
    document.body.classList.remove('panel-open');
    if (document.activeElement && el.panel.contains(document.activeElement)) document.activeElement.blur();
    if (c.onClose) c.onClose();
    if (c.modal) {
      el.panel.removeAttribute('role');
      el.panel.removeAttribute('aria-modal');
      el.panel.removeAttribute('aria-labelledby');
      document.getElementById('hud').inert = false;
      document.getElementById('game').inert = false;
      const target = c.opener?.isConnected && !c.opener.closest('[hidden], [inert]') ? c.opener : document.getElementById('game');
      target.focus({ preventScroll: true });
    }
    return true;
  },
  /** Fade to black, run `mid` while the screen is dark, then fade back in. */
  fade(mid, ms = 380) {
    const f = document.getElementById('fade');
    if (f.classList.contains('on')) return false;
    f.classList.add('on');
    setTimeout(() => {
      try { mid(); } finally { setTimeout(() => f.classList.remove('on'), 60); }
    }, ms);
    return true;
  },

  get panelZone() { return current ? current.zone : null; },
  get panelOpen() { return !!current; },
  get modalOpen() { return !!current?.modal; },
};

onLanguageChange(() => {
  promptText = null;
  ui.refreshPanel();
  if (hudSource) renderHud(hudSource);
  if (el.hint) el.hint.textContent = resolve(hintSource) || '';
  for (const [node, source] of toastSources) {
    if (node && node.isConnected) node.textContent = resolve(source);
  }
  if (el.close) el.close.setAttribute('aria-label', t('controls.close'));
  if (el.cart) el.cart.setAttribute('aria-label', t('mall.viewCart', { count: el.cart.textContent.replace(/\D/g, '') || 0 }));
});

/** Build an element from an HTML string. */
export function h(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d;
}
