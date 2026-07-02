import { fetchDailyHistoricalWeather } from "../../api/history.js";
import { shiftYears, toDateStr } from "../../utils/date.js";
import { computeStats, toSigma } from "../calculation.js";
import { DEFAULT_SETTINGS } from "../../app/settings.js";
import { LOCATION, CONDITIONS, HISTORICAL, APPSTATE } from "../../types.js";

/** Months corresponding to each season, per hemisphere (northern or southern) */
const SEASONS = {
  northern: {
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    autumn: [9, 10, 11],
    winter: [12, 1, 2],
  },
  southern: {
    spring: [9, 10, 11],
    summer: [12, 1, 2],
    autumn: [3, 4, 5],
    winter: [6, 7, 8],
  },
};

/**
 * @param {typeof APPSTATE} state
 * @param {typeof DEFAULT_SETTINGS} settings
 * @param {typeof LOCATION} location
 * @returns {{
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
export async function runAnalysisManual(state, settings, location) {
  const now = new Date();
  const conditions = {
    datetime: now.toISOString(),
    temperature: state.options.manual.temperature,
  };
  if (!conditions.temperature) throw new Error("Please enter a temperature!");

  const comparison = state.options.manual.comparison;
  if (!comparison || !["min", "max"].includes(comparison))
    throw new Error("Please select either daily min or max!");

  const season = state.options.manual.season;
  if (!season || !["spring", "summer", "autumn", "winter"].includes(season))
    throw new Error("Please select a season!");

  const endDate = toDateStr(now);
  const startDate = shiftYears(endDate, settings.historicalYears);

  const historicalReadings = await fetchDailyHistoricalWeather(
    location.latitude,
    location.longitude,
    startDate,
    endDate,
  );

  // TODO: Make season picker function

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
