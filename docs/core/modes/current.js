import { fetchCurrentConditions } from "../../api/current.js";
import { fetchHourlyHistoricalWeather } from "../../api/history.js";
import {
  getHourFromISO,
  shiftDays,
  shiftYears,
  toDateStr,
} from "../../utils/date.js";
import { toChunks } from "../../utils/objects.js";
import { computeStats, toSigma } from "../calculation.js";
import { DEFAULT_SETTINGS } from "../../app/settings.js";
import { LOCATION, CONDITIONS, HISTORICAL, APPSTATE } from "../../types.js";

/**
 * @param {typeof APPSTATE} state
 * @param {typeof DEFAULT_SETTINGS} settings
 * @param {typeof LOCATION} location
 * @returns {{
 *   conditions: typeof CONDITIONS,
 *   stats: typeof HISTORICAL[],
 *   sigma: number,
 *   sampleSize: number,
 *   basedOn: {
 *      mode: "temperature" | "apparentTemperature",
 *      comparison: "min" | "max" | "mean"
 *   },
 *   readings: typeof CONDITIONS[],
 * }}
 */
export async function runAnalysisCurrent(state, settings, location) {
  const conditions = await fetchCurrentConditions(
    location.latitude,
    location.longitude,
  );

  const historicalReadings = await fetchHourlyHistoricalWindow(
    location.latitude,
    location.longitude,
    conditions.datetime,
    settings,
  );

  const targetHour = getHourFromISO(conditions.datetime);
  const windowedReadings = historicalReadings.filter((r) => {
    const hour = getHourFromISO(r.datetime);
    return Math.abs(hour - targetHour) <= settings.windowHours;
  });

  if (windowedReadings.length < settings.minReadings)
    throw new Error(
      "Not enough historical data for this location and time of day.",
    );

  // prettier-ignore
  const stats = {
    temperature: computeStats(windowedReadings.map((r) => r.temperature)),
    apparentTemperature: computeStats(windowedReadings.map((r) => r.apparentTemperature).filter(Boolean)),
    humidity: computeStats(windowedReadings.map((r) => r.humidity).filter(Boolean)),
    windSpeed: computeStats(windowedReadings.map((r) => r.windSpeed).filter(Boolean)),
    precipitation: computeStats(windowedReadings.map((r) => r.precipitation).filter(Boolean)),
    cloudCover: computeStats(windowedReadings.map((r) => r.cloudCover).filter(Boolean)),
  };

  // TODO: Add user setting to prefer raw temp
  const mode =
    conditions.apparentTemperature !== undefined &&
    stats.apparentTemperature.count > settings.minReadings
      ? "apparentTemperature"
      : "temperature";

  const sigma = toSigma(conditions[mode], stats[mode].mean, stats[mode].std);

  return {
    conditions,
    stats,
    sigma,
    sampleSize: stats[mode].count,
    basedOn: {
      mode,
      comparison: "mean",
    },
    readings: windowedReadings,
  };
}

/**
 * Fires multiple requests (defined in {@link settings}) to fetch historical weather conditions for the given location.
 * Requests are sent in chunks of {@link chunkSize} to be gentler on the API.
 * Each request covers only a set days (defined in {@link settings}) around the equivalent date in that year.
 *
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @param {string} referenceTime Date to center the window around
 * @param {typeof DEFAULT_SETTINGS} settings
 * @param {number} chunkSize Number of requests to send at once
 * @param {number} timeoutMs Timeout between each chunk of requests in ms
 * @returns {Promise<typeof CONDITIONS[]>}
 */
async function fetchHourlyHistoricalWindow(
  lat,
  lon,
  referenceTime,
  settings,
  chunkSize = 5,
  timeoutMs = 500,
) {
  const requests = Array.from({ length: settings.historicalYears }, (_, i) => {
    const year = i + 1;

    const center = shiftYears(toDateStr(referenceTime), year);
    const start = shiftDays(center, -settings.windowDays);
    const end = shiftDays(center, settings.windowDays);

    return () => fetchHourlyHistoricalWeather(lat, lon, start, end);
  });

  const chunks = toChunks(requests, chunkSize);
  const results = [];
  for (const batch of chunks) {
    results.push(...(await Promise.all(batch.map((fn) => fn()))));
    await new Promise((r) => setTimeout(r, timeoutMs));
  }
  return results.flat();
}
