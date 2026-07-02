import { DEFAULT_SETTINGS } from "../../../../app/settings.js";

export const template = /* HTML */ `
  <div id="panel" class="panel">
    <div class="fields">
      <div class="field">
        <label for="temp" class="label"
          >Temperature (°<span id="unit"
            >${DEFAULT_SETTINGS.unitSystem === "metric" ? "C" : "F"}</span
          >)</label
        >
        <input
          id="temp"
          type="number"
          placeholder="e.g. 32"
          step="0.1"
          min="-80"
          max="60"
        />
      </div>
      <div class="field">
        <label for="season-picker" class="label">Season</label>
        <dropdown-input id="season-picker"></dropdown-input>
      </div>
      <div class="field">
        <label for="comparison-type" class="label">Compare against</label>
        <segmented-input id="comparison-type"></segmented-input>
      </div>
    </div>
    <div class="actions">
      <p class="description">
        Tests any air temperature against the highest or lowest recorded
        temperatures for this location over the past
        <span id="year-count">${DEFAULT_SETTINGS.historicalYears}</span>
        <span id="year-count-desc">years</span>.
      </p>
      <start-analysis-button disabled></start-analysis-button>
    </div>
  </div>
`;
