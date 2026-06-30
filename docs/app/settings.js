const STORAGE_KEY = "how-bad-is-it:settings";

export const DEFAULT_SETTINGS = {
  /** @type {"metric" | "imperial"} */
  unitSystem: "metric",

  /** The number of years of historical data to fetch */
  historicalYears: 30,

  /** The number of days around the target date to compare */
  windowDays: 15,

  /** The number of hours around the target hour to compare */
  windowHours: 2,

  /** Minimum number of readings for analysis */
  minReadings: 10,
};

/** Bounds for each setting key to prevent silly values */
export const SETTINGS_BOUNDS = {
  historicalYears: { min: 1, max: 50, step: 1 },
  windowDays: { min: 1, max: 30, step: 1 },
  windowHours: { min: 0, max: 6, step: 1 },
  minReadings: { min: 1, max: 100, step: 1 },
};

let currentSettings = loadSettings();
const listeners = new Set();

/** @returns {typeof DEFAULT_SETTINGS} A copy of the current settings */
export function getSettings() {
  return { ...currentSettings };
}

/**
 * Merge a partial settings object into the current settings, persist, and notify listeners.
 * @param {Partial<typeof DEFAULT_SETTINGS>} partial
 */
export function updateSettings(partial) {
  currentSettings = { ...currentSettings, ...sanitise(partial) };
  persistSettings(currentSettings);
  listeners.forEach((fn) => fn(getSettings()));
}

/** Reset everything back to defaults. */
export function resetSettings() {
  currentSettings = { ...DEFAULT_SETTINGS };
  persistSettings(currentSettings);
  listeners.forEach((fn) => fn(getSettings()));
}

/**
 * Subscribe to settings changes.
 * @param {(settings: typeof DEFAULT_SETTINGS) => void} callback
 * @returns {() => void} Unsubscribe function
 */
export function subscribeToSettings(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/** @returns {typeof DEFAULT_SETTINGS} Settings from local storage, default settings if inaccessible or invalid */
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...sanitise(JSON.parse(raw)) };
  } catch {
    console.warn("Failed to load settings from local storage");
    return { ...DEFAULT_SETTINGS };
  }
}

/** Persist settings to local storage, ignore errors (settings not surviving a reload is fine) */
function persistSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    console.warn("Failed to persist settings to local storage");
  }
}

/**
 * Clamp numeric fields to their bounds, ignore unknown keys.
 *
 * @param {Partial<typeof DEFAULT_SETTINGS>} partial
 * @returns {Partial<typeof DEFAULT_SETTINGS>} Cleaned settings
 */
function sanitise(partial) {
  const clean = {};

  if (
    String(partial.unitSystem).toLowerCase() === "metric" ||
    String(partial.unitSystem).toLowerCase() === "imperial"
  )
    clean.unitSystem = partial.unitSystem;

  for (const key of ["historicalYears", "windowDays", "windowHours"]) {
    if (partial[key] === undefined) continue;
    const { min, max } = SETTINGS_BOUNDS[key];
    const value = Number(partial[key]);
    if (!Number.isNaN(value)) clean[key] = Math.min(max, Math.max(min, value));
  }

  return clean;
}
