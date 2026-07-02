import { fetchDailyHistoricalWeather } from "../../api/history.js";
import {
  clampDate,
  dayOfYear,
  getYearFromISO,
  shiftDays,
  shiftYears,
  toDateStr,
} from "../../utils/date.js";
import { computeStats, toSigma } from "../calculation.js";
import { DEFAULT_SETTINGS } from "../../app/settings.js";
import {
  CONDITIONS,
  APPSTATE,
  HISTORICAL,
  LOCATION,
  DAILY_CONDITIONS,
} from "../../types.js";
import { MIN_DATE } from "../../constants.js";

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
export async function runAnalysisPast(state, settings, location) {
  const targetDate = state.options.past.date;
  if (!targetDate) throw new Error("Please select a date");

  const calcEndDate = shiftDays(targetDate, settings.windowDays);
  const calcStartDate = shiftYears(
    shiftDays(targetDate, -settings.windowDays),
    settings.historicalYears,
  );

  const maxDate = shiftDays(toDateStr(new Date()), -1);
  const startDate = clampDate(calcStartDate, MIN_DATE, maxDate);
  const endDate = clampDate(calcEndDate, startDate, maxDate);

  const readings = await fetchDailyHistoricalWeather(
    location.latitude,
    location.longitude,
    startDate,
    endDate,
  );

  const targetDOY = dayOfYear(targetDate);
  const windowedReadings = readings.filter((r) => {
    if (!r.datetime) return false;
    if (getYearFromISO(r.datetime) === getYearFromISO(targetDate)) return false;
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
    readings: windowedReadings,
  };
}
