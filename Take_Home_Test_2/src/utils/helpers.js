/**
 * Utility helpers — pure functions with no side-effects.
 * Import only what you need; tree-shaking will drop the rest.
 */

// ── Date helpers ─────────────────────────────────────────────────────────────
/** Format a date string or Date object to a human-readable string */
export const formatDate = (date, locale = 'en-IN') =>
  new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// ── String helpers ────────────────────────────────────────────────────────────
/** Capitalise the first letter of a string */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

/** Truncate a string to a max length and add an ellipsis */
export const truncate = (str = '', max = 100) =>
  str.length > max ? `${str.slice(0, max)}…` : str;

// ── Object helpers ────────────────────────────────────────────────────────────
/** Remove keys with null / undefined values from an object */
export const cleanObject = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined)
  );

// ── Storage helpers ───────────────────────────────────────────────────────────
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // quota exceeded or private mode — fail silently
    }
  },
  remove: (key) => localStorage.removeItem(key),
};
