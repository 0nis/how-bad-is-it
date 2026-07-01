import { getSettings, subscribeToSettings } from "../../../../app/settings.js";
import { setState, subscribe } from "../../../../app/store.js";
import { globalSheet } from "../../../../styles/sheets/global.js";
import { renderShadow } from "../../../../utils/shadow.js";
import { pluralize } from "../../../../utils/string.js";
import { fToC } from "../../../../utils/weather.js";
import { modeSheet } from "../../style.js";
import { template } from "./template.js";

// TODO: Add a seasonal selector? Maybe?

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

    this.startBtn = this.shadowRoot.querySelector("start-analysis-button");

    this.initInputs();
    this.sync();
  }

  initInputs() {
    this.comparisonTypeInput.options = [
      { label: "Daily high", value: "max" },
      { label: "Daily low", value: "min" },
    ];
    this.comparisonTypeInput.addEventListener("change", () => {
      this.updateState();
      this.checkIfReady();
    });

    this.tempInputEl.addEventListener("input", () => {
      let newTemp;
      if (getSettings().unitSystem === "imperial")
        newTemp = fToC(this.tempInputEl.value);
      else newTemp = this.tempInputEl.value;

      this.updateState();
      this.checkIfReady();
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
        },
      },
    });
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
