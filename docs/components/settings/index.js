import {
  getSettings,
  resetSettings,
  SETTINGS_BOUNDS,
  updateSettings,
} from "../../app/settings.js";
import { setState, subscribe } from "../../app/store.js";
import { globalSheet } from "../../styles/sheets/global.js";
import { renderShadow } from "../../utils/shadow.js";
import { pluralize } from "../../utils/string.js";
import { style } from "./style.js";
import { template } from "./template.js";

class SiteSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];
  }

  connectedCallback() {
    this.render();
    this.overlay = this.shadowRoot.querySelector("#overlay");
    this.panel = this.shadowRoot.querySelector("#panel");
    if (!this.panel) return;

    this.overlay.addEventListener("click", () =>
      setState({ settingsOpen: false }),
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.panel.hidden)
        setState({ settingsOpen: false });
    });

    this.unsubscribe = subscribe(
      (state) => state.settingsOpen,
      (settingsOpen) => {
        if (settingsOpen) this.open();
        else if (!settingsOpen) this.close();
      },
    );

    this.init();
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  open() {
    this.panel.hidden = false;
    this.overlay.hidden = false;
    requestAnimationFrame(() => this.panel.classList.add("is-open"));
  }

  close() {
    this.panel.classList.remove("is-open");
    setTimeout(() => {
      this.panel.hidden = true;
      this.overlay.hidden = true;
    }, 180);
  }

  render() {
    renderShadow(this.shadowRoot, template, style);
  }

  init() {
    this.settings = getSettings();

    this.initReset();
    this.initSegmentedInputs();
    this.initSliders();
  }

  initReset() {
    this.shadowRoot.querySelector("#reset").addEventListener("click", () => {
      resetSettings();
      this.renderFromSettings(getSettings());
    });
  }

  initSegmentedInputs() {
    const unitSystemInput = this.panel.querySelector("#setting-units");
    unitSystemInput.options = [
      { label: "Metric", value: "metric" },
      { label: "Imperial", value: "imperial" },
    ];
    unitSystemInput.value = this.settings.unitSystem;
    unitSystemInput.addEventListener("change", (e) => {
      updateSettings({ unitSystem: e.target.value });
    });

    const comparisonMetricInput = this.panel.querySelector(
      "#setting-comparison-metric",
    );
    comparisonMetricInput.options = [
      { label: "Raw Air Temperature", value: "raw" },
      { label: "Feels-like Temperature", value: "apparent" },
    ];
    comparisonMetricInput.value = this.settings.comparisonMetric;
    comparisonMetricInput.addEventListener("change", (e) => {
      updateSettings({ comparisonMetric: e.target.value });
    });
  }

  initSliders() {
    this.setupSlider(
      "setting-historical-years",
      "historicalYears",
      SETTINGS_BOUNDS.historicalYears,
    );
    this.setupSlider(
      "setting-window-days",
      "windowDays",
      SETTINGS_BOUNDS.windowDays,
    );
    this.setupSlider(
      "setting-window-hours",
      "windowHours",
      SETTINGS_BOUNDS.windowHours,
    );
    this.setupSlider(
      "setting-min-readings",
      "minReadings",
      SETTINGS_BOUNDS.minReadings,
    );
  }

  setupSlider(id, key, bounds) {
    const slider = this.shadowRoot.querySelector(`#${id}`);
    slider.applyBounds(bounds);
    slider.value = this.settings[key];
    slider.addEventListener("change", () => {
      updateSettings({ [key]: Number(slider.value) });
    });
  }
}

customElements.define("site-settings", SiteSettings);
