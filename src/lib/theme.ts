/**
 * Light/dark choice. With no stored choice the OS preference wins (see
 * styles/tokens.css); a stored choice sets data-theme on <html>. Applied
 * from main.tsx before first render — an inline <script> in index.html
 * would avoid the flash entirely, but the CSP allows script-src 'self' only.
 */
export type Theme = 'light' | 'dark';

const KEY = 'theme';

export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

export function applyTheme(theme: Theme | null) {
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

export function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    // Private mode / blocked storage: the toggle still works for this visit.
  }
}

export function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
