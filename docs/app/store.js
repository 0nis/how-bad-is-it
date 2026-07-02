import { LOCATION, CONDITIONS, HISTORICAL, APPSTATE } from "../types.js";
import { DEFAULT_SETTINGS } from "./settings.js";

/** @type {typeof APPSTATE} */
const state = {
  selectedLocation: null,
  mode: "current",
  options: {
    past: {
      date: null,
    },
    manual: {
      temperature: null,
      comparison: null,
      season: null,
    },
  },
  status: "idle",
  analysis: null,
  error: null,
  settingsOpen: false,
};

const listeners = new Set();

/** @returns {typeof APPSTATE} Current state */
export function getState() {
  return state;
}

/**
 * Merges the given patch into the current state and notifies listeners
 *
 * @param {Partial<typeof APPSTATE>} patch
 */
export function setState(patch) {
  for (const key in patch) {
    if (
      typeof patch[key] === "object" &&
      patch[key] !== null &&
      !Array.isArray(patch[key])
    )
      state[key] = {
        ...state[key],
        ...patch[key],
      };
    else state[key] = patch[key];
  }

  listeners.forEach((fn) => fn(state));
}

/**
 * Subscribes to a *selected slice* of the state.
 *
 * The selector allows components to only react when relevant state changes,
 * preventing unnecessary updates from unrelated state mutations.
 *
 * @template TSelected
 *
 * @param {(state: typeof APPSTATE) => TSelected} selector Function that extracts the part of state this subscriber cares about
 * @param {(selected: TSelected,state: typeof APPSTATE) => void} fn Callback triggered when the selected value changes
 * @returns {() => void} Function to unsubscribe
 */
export function subscribe(selector, fn) {
  let prevSelected = selector(state);

  const wrapped = (state) => {
    const nextSelected = selector(state);

    if (Object.is(prevSelected, nextSelected)) return;

    prevSelected = nextSelected;
    fn(nextSelected, state);
  };

  listeners.add(wrapped);
  fn(prevSelected, state);

  return () => listeners.delete(wrapped);
}
