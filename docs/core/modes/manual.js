import { fetchDailyHistoricalWeather } from "../../api/history.js";
import { getMonthFromISO, shiftYears, toDateStr } from "../../utils/date.js";
import { computeStats, toSigma } from "../calculation.js";
import { DEFAULT_SETTINGS } from "../../app/settings.js";
import {
  LOCATION,
  CONDITIONS,
  HISTORICAL,
  APPSTATE,
  DAILY_CONDITIONS,
} from "../../types.js";

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
 *   sampleSize: number,
 *   basedOn: {
 *      mode: "temperature" | "apparentTemperature",
 *      comparison: "min" | "max" | "mean"
 *   },
 *   readings: typeof DAILY_CONDITIONS[],
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

  const readings = await fetchDailyHistoricalWeather(
    location.latitude,
    location.longitude,
    startDate,
    endDate,
  );

  const hemisphere = location.latitude >= 0 ? "northern" : "southern";
  const months = SEASONS[hemisphere][season];

  const windowedReadings = readings.filter((r) => {
    return months.includes(getMonthFromISO(r.datetime));
  });

  // prettier-ignore
  const stats = {
    temperature: {
      min: computeStats(windowedReadings.map((r) => r.temperature.min).filter(Boolean)),
      max: computeStats(windowedReadings.map((r) => r.temperature.max).filter(Boolean)),
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
    readings: windowedReadings,
  };
}
