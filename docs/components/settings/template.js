import { DEFAULT_SETTINGS } from "../../app/settings.js";
import {
  HISTORICAL_YEARS,
  WINDOW_DAYS,
  WINDOW_HOURS,
} from "../../constants.js";

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
      <div class="segmented-control">
        <label class="segmented-option">
          <input
            type="radio"
            name="unit-system"
            value="metric"
            ${DEFAULT_SETTINGS.unitSystem === "metric" ? "checked" : ""}
          />
          <span>Metric (°C)</span>
        </label>
        <label class="segmented-option">
          <input
            type="radio"
            name="unit-system"
            value="imperial"
            ${DEFAULT_SETTINGS.unitSystem === "imperial" ? "checked" : ""}
          />
          <span>Imperial (°F)</span>
        </label>
      </div>
    </div>

    <div class="section">
      <div class="slider-row">
        <label for="setting-historical-years" class="section-label">
          Historical years
        </label>
        <span id="setting-historical-years-value" class="slider-value"
          >±${DEFAULT_SETTINGS.historicalYears} yr</span
        >
      </div>
      <input type="range" id="setting-historical-years" class="slider" />
      <p class="hint">How far back to pull comparison data from.</p>
    </div>

    <div class="section">
      <div class="slider-row">
        <label for="setting-window-days" class="section-label">
          Day window
        </label>
        <span id="setting-window-days-value" class="slider-value"
          >±${DEFAULT_SETTINGS.windowDays} day</span
        >
      </div>
      <input type="range" id="setting-window-days" class="slider" />
      <p class="hint">Days around the selected date to include, each year.</p>
    </div>

    <div class="section">
      <div class="slider-row">
        <label for="setting-window-hours" class="section-label">
          Hour window
        </label>
        <span id="setting-window-hours-value" class="slider-value"
          >±${DEFAULT_SETTINGS.windowHours} hr</span
        >
      </div>
      <input type="range" id="setting-window-hours" class="slider" />
      <p class="hint">Hours around the selected time to include.</p>
    </div>

    <div class="section">
      <div class="slider-row">
        <label for="setting-min-readings" class="section-label">
          Minimum readings
        </label>
        <span id="setting-min-readings-value" class="slider-value"
          >±${DEFAULT_SETTINGS.minReadings}</span
        >
      </div>
      <input type="range" id="setting-min-readings" class="slider" />
      <p class="hint">
        Minimum number of historical readings needed for analysis.
      </p>
    </div>
  </aside>
`;
