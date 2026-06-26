// TODO: Implement for real (this is a placeholder for testing)

import { setState } from "./store.js";

export async function runAnalysis(location) {
  setState({
    status: "loading",
    error: null,
    selectedLocation: location,
  });

  await new Promise((resolve) => setTimeout(resolve, 1500));

  setState({
    status: "success",

    analysis: {
      location,

      percentile: 98,
      sigma: 2.4,

      interpretation: {
        label: "Very unusual",
        severity: "2",
      },

      frequency: {
        label: "Occurs roughly once every 40 years",
      },

      observedTemp: 34.7,
      feelsLikeTemp: 37.2,

      historicalMean: 23.1,
      historicalStd: 4.8,

      humidity: 64,
    },
  });
}
