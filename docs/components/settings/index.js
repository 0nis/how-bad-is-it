import {
  getSettings,
  resetSettings,
  SETTINGS_BOUNDS,
  updateSettings,
} from "../../app/settings.js";
import { setState, subscribe } from "../../app/store.js";
import { globalSheet } from "../../styles/sheets/global.js";
import { renderShadow } from "../../utils/shadow.js";
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

    this.unsubscribe = subscribe((state) => {
      if (state.settingsOpen) this.open();
      else if (!state.settingsOpen) this.close();
    });

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
    this.initUnitSelector();
    this.initSliders();
    this.initReset();

    this.renderFromSettings(getSettings());
  }

  initUnitSelector() {
    this.panel
      .querySelectorAll('input[name="unit-system"]')
      .forEach((input) => {
        input.addEventListener("change", (e) => {
          updateSettings({ unitSystem: e.target.value });
        });
      });
  }

  initReset() {
    this.shadowRoot.querySelector("#reset").addEventListener("click", () => {
      resetSettings();
      this.renderFromSettings(getSettings());
    });
  }

  renderFromSettings(settings) {
    this.renderUnitSelector(settings);
    this.renderSliders(settings);
  }

  renderUnitSelector(settings) {
    this.panel.querySelectorAll("input[name=unit-system]").forEach((input) => {
      input.checked = input.value === settings.unitSystem;
    });
  }

  initSliders() {
    this.applyBounds(
      "setting-historical-years",
      SETTINGS_BOUNDS.historicalYears,
    );
    this.applyBounds("setting-window-days", SETTINGS_BOUNDS.windowDays);
    this.applyBounds("setting-window-hours", SETTINGS_BOUNDS.windowHours);
    this.applyBounds("setting-min-readings", SETTINGS_BOUNDS.minReadings);

    this.bindSlider("setting-historical-years", "historicalYears", "yr");
    this.bindSlider("setting-window-days", "windowDays", "day", "±");
    this.bindSlider("setting-window-hours", "windowHours", "hr", "±");
    this.bindSlider("setting-min-readings", "minReadings");
  }

  renderSliders(settings) {
    this.setSliderValue(
      "setting-historical-years",
      settings.historicalYears,
      "yr",
    );
    this.setSliderValue("setting-window-days", settings.windowDays, "day", "±");
    this.setSliderValue(
      "setting-window-hours",
      settings.windowHours,
      "hr",
      "±",
    );
    this.setSliderValue("setting-min-readings", settings.minReadings);
  }

  bindSlider(id, settingKey, unitLabel, prefix) {
    const slider = this.shadowRoot.querySelector(`#${id}`);
    const output = this.shadowRoot.querySelector(`#${id}-value`);
    if (!slider) return;

    slider.addEventListener("input", () => {
      if (output)
        output.textContent = this.formatValue(slider.value, unitLabel, prefix);
    });
    slider.addEventListener("change", () => {
      updateSettings({ [settingKey]: Number(slider.value) });
    });
  }

  applyBounds(id, { min, max, step }) {
    const el = this.shadowRoot.querySelector(`#${id}`);
    if (!el) return;
    el.min = min;
    el.max = max;
    el.step = step;
  }

  setSliderValue(id, value, unitLabel, prefix) {
    const slider = this.shadowRoot.querySelector(`#${id}`);
    const output = this.shadowRoot.querySelector(`#${id}-value`);
    if (slider) slider.value = value;
    if (output) output.textContent = this.formatValue(value, unitLabel, prefix);
  }

  formatValue(value, unitLabel, prefix) {
    const n = Number(value);
    const plural = n === 1 || !unitLabel ? "" : "s";
    return `${prefix ?? ""}${n} ${unitLabel ?? ""}${plural}`;
  }
}

customElements.define("site-settings", SiteSettings);
