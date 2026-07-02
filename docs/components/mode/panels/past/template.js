import { DEFAULT_SETTINGS } from "../../../../app/settings.js";

export const template = /* HTML */ `
  <div id="panel" class="panel">
    <div class="fields">
      <div class="field">
        <input id="date" type="date" aria-label="Pick a date" />
      </div>
    </div>
    <div class="actions">
      <p class="description">
        Compares a historic date's peak
        <span id="comparison-metric">feels-like</span> temperature to the
        historical average peak for similar dates over the past
        <span id="year-count">${DEFAULT_SETTINGS.historicalYears}</span>
        <span id="year-count-desc">years</span>.
      </p>
      <start-analysis-button disabled></start-analysis-button>
    </div>
  </div>
`;
