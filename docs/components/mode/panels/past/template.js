import { DEFAULT_SETTINGS } from "../../../../app/settings.js";

export const template = /* HTML */ `
  <div id="panel" class="panel">
    <div class="fields">
      <div class="field">
        <label for="date" class="label">Date</label>
        <input id="date" type="date" />
      </div>
      <div class="field">
        <label for="type" class="label">Type</label>
        <segmented-input id="type"></segmented-input>
      </div>
    </div>
    <div class="actions">
      <p class="description">
        Compares a historic date's feels-like temperature against the highs or
        lows of similar calendar dates over the past
        <span id="year-count">${DEFAULT_SETTINGS.historicalYears}</span>
        <span id="year-count-desc">years</span>.
      </p>
      <start-analysis-button disabled></start-analysis-button>
    </div>
  </div>
`;
