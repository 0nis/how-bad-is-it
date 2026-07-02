import { getSettings, subscribeToSettings } from "../../../../app/settings.js";
import { setState, subscribe } from "../../../../app/store.js";
import { globalSheet } from "../../../../styles/sheets/global.js";
import { renderShadow } from "../../../../utils/shadow.js";
import { pluralize } from "../../../../utils/string.js";
import { fToC } from "../../../../utils/weather.js";
import { modeSheet } from "../../style.js";
import { flower, leaf, snowflake, sun } from "./icons.js";
import { template } from "./template.js";

class ModeManualPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet, modeSheet];
  }

  connectedCallback() {
    this.init();

    this.unsubscribe = subscribe(
      (state) => state.mode,
      (mode) => {
        this.hidden = mode !== "manual";
      },
    );

    this.unsubscribeSettings = subscribeToSettings((settings) => {
      this.sync();
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribeSettings?.();
  }

  init() {
    this.render();

    this.yearCountEl = this.shadowRoot.querySelector("#year-count");
    this.yearCountDescEl = this.shadowRoot.querySelector("#year-count-desc");

    this.comparisonTypeInput =
      this.shadowRoot.querySelector("#comparison-type");

    this.tempUnitEl = this.shadowRoot.querySelector("#unit");
    this.tempInputEl = this.shadowRoot.querySelector("#temp");

    this.seasonPickerInputEl = this.shadowRoot.querySelector("#season-picker");

    this.startBtn = this.shadowRoot.querySelector("start-analysis-button");

    this.initInputs();
    this.bindEvents();
    this.sync();
  }

  initInputs() {
    this.comparisonTypeInput.options = [
      { label: "Daily high", value: "max" },
      { label: "Daily low", value: "min" },
    ];
    this.comparisonTypeInput.value = "max";

    this.seasonPickerInputEl.options = [
      { value: "spring", label: "Spring", icon: flower ?? "🌸" },
      { value: "summer", label: "Summer", icon: sun ?? "☀️" },
      { value: "autumn", label: "Autumn", icon: leaf ?? "🍂" },
      { value: "winter", label: "Winter", icon: snowflake ?? "❄️" },
    ];
    this.seasonPickerInputEl.selected = "summer";
  }

  bindEvents() {
    this.comparisonTypeInput.addEventListener("change", () => {
      this.updateState();
    });
    this.tempInputEl.addEventListener("input", () => {
      this.updateState();
    });
    this.seasonPickerInputEl.addEventListener("change", () => {
      this.updateState();
    });
  }

  render() {
    renderShadow(this.shadowRoot, template);
  }

  updateState() {
    let temp = this.tempInputEl.value;
    if (getSettings().unitSystem === "imperial")
      temp = fToC(this.tempInputEl.value);
    setState({
      options: {
        manual: {
          temperature: temp,
          comparison: this.comparisonTypeInput.value,
          season: this.seasonPickerInputEl.selected,
        },
      },
    });
    this.checkIfReady();
  }

  checkIfReady() {
    if (this.tempInputEl.value && this.comparisonTypeInput.value)
      this.startBtn.ready = true;
    else this.startBtn.ready = false;
  }

  sync() {
    this.settings = getSettings();

    this.yearCountEl.textContent = this.settings.historicalYears;
    this.yearCountDescEl.textContent = pluralize(
      "year",
      this.settings.historicalYears,
    );

    if (this.settings.unitSystem === "metric") this.toCelsius();
    else this.toFahrenheit();
  }

  toFahrenheit() {
    this.tempUnitEl.textContent = "F";
    this.tempInputEl.setAttribute("max", 140);
    this.tempInputEl.setAttribute("min", -58);
    this.tempInputEl.setAttribute("step", 1);
    this.tempInputEl.setAttribute("placeholder", "e.g. 90");
  }

  toCelsius() {
    this.tempUnitEl.textContent = "C";
    this.tempInputEl.setAttribute("max", 60);
    this.tempInputEl.setAttribute("min", -50);
    this.tempInputEl.setAttribute("step", 0.1);
    this.tempInputEl.setAttribute("placeholder", "e.g. 32");
  }
}

customElements.define("manual-panel", ModeManualPanel);
