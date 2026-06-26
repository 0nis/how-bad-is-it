const state = {
  status: "idle",
  selectedLocation: null,
  analysis: null,
  error: null,
  cachedHistoricalData: null,
};

const listeners = new Set();

/**
 * Returns the current state
 */
export function getState() {
  return state;
}

/**
 * Merges the given patch into the current state
 *
 * @param {Partial<state>} patch
 * @returns Updated state
 */
export function setState(patch) {
  Object.assign(state, patch);

  listeners.forEach((fn) => fn(state));
}

/**
 * Subscribes to state changes
 *
 * @param {(key: keyof state) => void} fn
 * @returns Function to unsubscribe
 */
export function subscribe(fn) {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}
