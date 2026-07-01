import { fetchCurrentConditions } from "../api/current.js";
import {
  fetchDailyHistoricalWeather,
  fetchHourlyHistoricalWeather,
} from "../api/history.js";
import {
  dayOfYear,
  getHourFromISO,
  shiftDays,
  shiftYears,
  toDateStr,
} from "../utils/date.js";
import { getState, setState } from "../app/store.js";
import { toChunks } from "../utils/objects.js";
import {
  computeStats,
  sigmaToFrequency,
  sigmaToLabel,
  sigmaToPercentile,
  sigmaToSeverity,
  toSigma,
} from "./calculation.js";
import { getSettings, DEFAULT_SETTINGS } from "../app/settings.js";
import { LOCATION, CONDITIONS, HISTORICAL, APPSTATE } from "../types.js";

export async function runAnalysis() {
  try {
    const state = getState();
    const settings = getSettings();
    const location = state.selectedLocation;

    if (!location) throw new Error("Please select a location first!");

    setState({
      status: "loading",
      location,
      error: null,
      analysis: null,
    });

    /**
     * @type {{
     *   conditions: typeof CONDITIONS,
     *   stats: typeof HISTORICAL[],
     *   sigma: number,
     *   sampleSize: number
     *   basedOn: {
     *      mode: "temperature" | "apparentTemperature",
     *      comparison: "min" | "max" | "mean"
     *   }
     * }}
     */
    let data = {
      conditions: null,
      stats: null,
      sigma: null,
      sampleSize: null,
      basedOn: null,
    };

    switch (state.mode) {
      case "current":
        data = await runAnalysisCurrent(state, settings, location);
        break;
      case "past":
        data = await runAnalysisPast(state, settings, location);
        break;
      case "manual":
        data = await runAnalysisManual(state, settings, location);
        break;
      default:
        throw new Error("Unknown mode: " + mode);
    }

    const { conditions, stats, sigma } = data;
    if (!conditions) throw new Error("Failed to fetch conditions");
    if (!stats) throw new Error("Failed to compute stats");
    if (!sigma) throw new Error("Failed to compute sigma");

    setState({
      status: "success",
      location: location,
      analysis: {
        datetime: conditions.datetime,
        timezone: location.timezone,
        location,
        sigma,
        percentile: sigmaToPercentile(sigma),
        frequency: sigmaToFrequency(sigma),
        severity: sigmaToSeverity(sigma),
        label: sigmaToLabel(sigma),
        sampleSize: data.sampleSize,
        basedOn: data.basedOn,
        observed: conditions,
        historical: stats,
        settings: settings,
      },
      error: null,
    });
  } catch (err) {
    setState({
      status: "error",
      error: err.message,
    });
    console.error(err);
  }
}

/**
 * @param {typeof APPSTATE} state
 * @param {typeof DEFAULT_SETTINGS} settings
 * @returns {{
 *   conditions: typeof CONDITIONS,
 *   readings: typeof CONDITIONS[]
 * }}
 */
async function runAnalysisCurrent(state, settings, location) {
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
  };
}

/**
 * @param {typeof APPSTATE} state
 * @param {typeof DEFAULT_SETTINGS} settings
 * @returns {{
 *   conditions: typeof CONDITIONS,
 *   readings: typeof CONDITIONS[]
 * }}
 */
async function runAnalysisPast(state, settings, location) {
  const endDate = state.options.past.date;
  if (!endDate) throw new Error("Please select a date");
  const startDate = shiftYears(endDate, settings.historicalYears);

  const readings = await fetchDailyHistoricalWeather(
    location.latitude,
    location.longitude,
    startDate,
    endDate,
  );

  const targetDate = endDate;
  const targetDOY = dayOfYear(targetDate);
  const windowedReadings = readings.filter((r) => {
    const doy = dayOfYear(r.datetime);
    let diff = Math.abs(doy - targetDOY);
    diff = Math.min(diff, 365 - diff);
    return diff <= settings.windowDays;
  });

  if (windowedReadings.length < settings.minReadings)
    throw new Error(
      "Not enough historical data for this location and time of year.",
    );

  const conditions = readings.find((r) => r.datetime === targetDate);
  if (!conditions) throw new Error("Failed to fetch conditions");

  // prettier-ignore
  const stats = {
    temperature: {
      min: computeStats(windowedReadings.map((r) => r.temperature.min).filter(Boolean)),
      max: computeStats(windowedReadings.map((r) => r.temperature.max).filter(Boolean)),
    },
    apparentTemperature: {
      min: computeStats(windowedReadings.map((r) => r.apparentTemperature.min).filter(Boolean)),
      max: computeStats(windowedReadings.map((r) => r.apparentTemperature.max).filter(Boolean)),
    }
  };

  // TODO: Add user setting to prefer raw temp
  const mode =
    conditions.apparentTemperature !== undefined
      ? "apparentTemperature"
      : "temperature";

  const value =
    mode === "raw" ? conditions.temperature : conditions.apparentTemperature;

  const sigma = toSigma(value.max, stats[mode].max.mean, stats[mode].max.std);

  return {
    conditions,
    stats,
    sigma,
    sampleSize: stats[mode].max.count,
    basedOn: {
      mode,
      comparison: "max",
    },
  };
}

/**
 * @param {typeof APPSTATE} state
 * @param {typeof DEFAULT_SETTINGS} settings
 * @returns {{
 *   conditions: typeof CONDITIONS,
 *   readings: typeof CONDITIONS[]
 * }}
 */
async function runAnalysisManual(state, settings, location) {
  const now = new Date();
  const conditions = {
    datetime: now.toISOString(),
    temperature: state.options.manual.temperature,
  };
  if (!conditions.temperature) throw new Error("Please enter a temperature");

  const comparison = state.options.manual.comparison;
  if (!comparison || !["min", "max"].includes(comparison))
    throw new Error("Please select either daily min or max");

  const endDate = toDateStr(now);
  const startDate = shiftYears(endDate, settings.historicalYears);

  const historicalReadings = await fetchDailyHistoricalWeather(
    location.latitude,
    location.longitude,
    startDate,
    endDate,
  );

  // prettier-ignore
  const stats = {
    temperature: {
      min: computeStats(historicalReadings.map((r) => r.temperature.min).filter(Boolean)),
      max: computeStats(historicalReadings.map((r) => r.temperature.max).filter(Boolean)),
    }
  }

  const sigma = toSigma(
    conditions.temperature,
    stats.temperature[comparison].mean,
    stats.temperature[comparison].std,
  );

  return {
    conditions,
    stats,
    sigma,
    sampleSize: stats.temperature[comparison].count,
    basedOn: {
      mode: "temperature",
      comparison,
    },
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

    const center = new Date(referenceTime);
    center.setFullYear(center.getFullYear() - year);

    const start = shiftDays(center, -settings.windowDays);
    const end = shiftDays(center, settings.windowDays);

    return () =>
      fetchHourlyHistoricalWeather(lat, lon, toDateStr(start), toDateStr(end));
  });

  const chunks = toChunks(requests, chunkSize);
  const results = [];
  for (const batch of chunks) {
    results.push(...(await Promise.all(batch.map((fn) => fn()))));
    await new Promise((r) => setTimeout(r, timeoutMs));
  }
  return results.flat();
}
