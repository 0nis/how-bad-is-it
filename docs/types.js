// Can you tell how much I miss TypeScript? :D

/**
 * @typedef {Object} AppState
 *
 * @property {"idle" | "loading" | "success" | "error"} status
 * @property {typeof LOCATION | null} selectedLocation
 * @property {string} error Error message to display
 * @property {boolean} settingsOpen
 * @property {{
 *    datetime: string,
 *    timezone: string,
 *    location: typeof LOCATION,
 *    sigma: number,
 *    percentile: number,
 *    label: string,
 *    severity: number,
 *    frequency: string,
 *    sampleSize: number,
 *    basedOn: "raw" | "feels",
 *    observed: typeof CONDITIONS,
 *    historical: typeof HISTORICAL,
 *    settings: typeof DEFAULT_SETTINGS
 * } | null} analysis Units:
 * - datetime: ISO 8601
 * - temperature: °C
 * - apparentTemperature: °C
 * - humidity: %
 * - windSpeed: km/h
 * - precipitation: mm
 * - cloud cover: %
 * @property {"current" | "manual"} mode
 */

/** @type {AppState} */
export const APPSTATE = {};

/**
 * @type {{
 *    id: number,
 *    name: string,
 *    country: string,
 *    admin1: string|null,
 *    admin2: string|null,
 *    latitude: number,
 *    longitude: number,
 *    elevation: number|null,
 *    timezone: string
 * } | null}
 */
export const LOCATION = {};

/**
 * @type {{
 *   datetime: string,
 *   temperature?: number,
 *   apparentTemperature?: number,
 *   humidity?: number,
 *   windSpeed?: number,
 *   precipitation?: number,
 *   cloudCover?: number
 * }}
 */
export const CONDITIONS = {};

/**
 * @type {{ mean: number, std: number, count: number }}
 */
export const STATS = {};

/**
 * @type {{
 *    temperature?: typeof STATS,
 *    apparentTemperature?: typeof STATS,
 *    humidity?: typeof STATS,
 *    windSpeed?: typeof STATS,
 *    precipitation?: typeof STATS,
 *    cloudCover?: typeof STATS,
 * }}
 */
export const HISTORICAL = {};
