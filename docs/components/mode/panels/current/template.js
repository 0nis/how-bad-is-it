import { DEFAULT_SETTINGS } from "../../../../app/settings.js";

export const template = /* HTML */ `
  <div id="panel" class="panel">
    <div class="actions">
      <p class="description">
        Compares the current
        <span id="comparison-metric">feels-like</span> temperature to the
        average of similar dates and times from the past
        <span id="year-count">${DEFAULT_SETTINGS.historicalYears}</span>
        <span id="year-count-desc">years</span>.
      </p>
      <start-analysis-button ready disabled></start-analysis-button>
    </div>
  </div>
`;
