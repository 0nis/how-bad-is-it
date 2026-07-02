import { fetchDailyHistoricalWeather } from "../../api/history.js";
import { dayOfYear, shiftYears } from "../../utils/date.js";
import { computeStats, toSigma } from "../calculation.js";
import { DEFAULT_SETTINGS } from "../../app/settings.js";
import { CONDITIONS, APPSTATE, HISTORICAL, LOCATION } from "../../types.js";

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
export async function runAnalysisPast(state, settings, location) {
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
