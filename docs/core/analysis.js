import { getState, setState } from "../app/store.js";
import {
  sigmaToFrequency,
  sigmaToLabel,
  sigmaToPercentile,
  sigmaToSeverity,
} from "./calculation.js";
import { getSettings } from "../app/settings.js";
import { CONDITIONS, HISTORICAL, DAILY_CONDITIONS } from "../types.js";
import { runAnalysisCurrent } from "./modes/current.js";
import { runAnalysisPast } from "./modes/past.js";
import { runAnalysisManual } from "./modes/manual.js";

/**
 * Orchestrates and executes the core statistical analysis pipeline for the application.
 *
 * This is the primary controller function that runs by itself by evaluating the current
 * global store state and user settings.
 *
 * - On start: Updates state 'status' to 'loading'
 * - On error: Updates state 'status' to 'error' and 'error' with error message
 * - On success: Updates state 'status' to 'success' and 'analysis' with analysis results
 *
 * TODO: Add caching behavior (re-use partial analysis results when location and mode are the same)
 *
 * @returns {Promise<void>}
 */
export async function runAnalysis() {
  try {
    setState({
      status: "loading",
      error: null,
      analysis: null,
    });

    const state = getState();
    const settings = getSettings();
    const location = state.selectedLocation;

    if (!location) throw new Error("Please select a location first!");

    /**
     * @type {{
     *   conditions: typeof CONDITIONS,
     *   stats: typeof HISTORICAL[],
     *   sigma: number,
     *   sampleSize: number,
     *   basedOn: {
     *      mode: "temperature" | "apparentTemperature",
     *      comparison: "min" | "max" | "mean"
     *   },
     *   readings: typeof CONDITIONS[] | typeof DAILY_CONDITIONS[],
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
