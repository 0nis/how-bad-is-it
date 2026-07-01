import { DEFAULT_SETTINGS } from "../../app/settings.js";

export const template = /* HTML */ `
  <div id="overlay" class="overlay" hidden></div>

  <aside
    id="panel"
    class="panel"
    hidden
    role="dialog"
    aria-label="Settings"
    aria-modal="true"
  >
    <div class="panel-header">
      <h2 class="panel-title">Settings</h2>
      <button id="reset" class="reset-btn" type="button">
        Reset to defaults
      </button>
    </div>

    <div class="section">
      <label class="section-label">Units</label>
      <segmented-input id="setting-units"></segmented-input>
    </div>

    <div class="section">
      <slider-input id="setting-historical-years" unit="yr">
        <label
          slot="label"
          class="section-label"
          for="setting-historical-years-input"
          >Historical years</label
        >
      </slider-input>
      <p class="hint">How far back to pull comparison data from.</p>
    </div>

    <div class="section">
      <slider-input id="setting-window-days" unit="day" prefix="±">
        <label
          slot="label"
          class="section-label"
          for="setting-window-days-input"
          >Day window</label
        >
      </slider-input>
      <p class="hint">Days around the selected date to include, each year.</p>
    </div>

    <div class="section">
      <slider-input id="setting-window-hours" unit="hr" prefix="±">
        <label
          slot="label"
          class="section-label"
          for="setting-window-hours-input"
          >Hour window</label
        >
      </slider-input>
      <p class="hint">Hours around the selected time to include.</p>
    </div>

    <div class="section">
      <slider-input id="setting-min-readings">
        <label
          slot="label"
          class="section-label"
          for="setting-min-readings-input"
          >Minimum readings</label
        >
      </slider-input>
      <p class="hint">
        Minimum number of historical readings needed for analysis.
      </p>
    </div>
  </aside>
`;
