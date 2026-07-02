import { getSettings, subscribeToSettings } from "../../../../app/settings.js";
import { setState, subscribe } from "../../../../app/store.js";
import { globalSheet } from "../../../../styles/sheets/global.js";
import { shiftDays, toDateStr } from "../../../../utils/date.js";
import { renderShadow } from "../../../../utils/shadow.js";
import { pluralize } from "../../../../utils/string.js";
import { modeSheet } from "../../style.js";
import { template } from "./template.js";

class ModePastPanel extends HTMLElement {
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
        this.hidden = mode !== "past";
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
    this.comparisonMetricEl =
      this.shadowRoot.querySelector("#comparison-metric");

    this.dateEl = this.shadowRoot.querySelector("#date");
    this.startBtn = this.shadowRoot.querySelector("start-analysis-button");

    this.dateEl.setAttribute("min", "1940-01-01");
    this.dateEl.setAttribute("max", toDateStr(shiftDays(new Date(), -1)));
    this.dateEl.addEventListener("input", () => {
      setState({ options: { past: { date: this.dateEl.value } } });
      this.checkIfReady();
    });
  }

  render() {
    renderShadow(this.shadowRoot, template);
  }

  checkIfReady() {
    if (this.dateEl.value) this.startBtn.ready = true;
    else this.startBtn.ready = false;
  }

  sync() {
    this.settings = getSettings();

    this.yearCountEl.textContent = this.settings.historicalYears;
    this.yearCountDescEl.textContent = pluralize(
      "year",
      this.settings.historicalYears,
    );
    this.comparisonMetricEl.textContent =
      this.settings.comparisonMetric === "raw" ? "air" : "feels-like";
  }
}

customElements.define("past-panel", ModePastPanel);
