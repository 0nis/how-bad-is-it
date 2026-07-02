import { getSettings, subscribeToSettings } from "../../../../app/settings.js";
import { subscribe } from "../../../../app/store.js";
import { globalSheet } from "../../../../styles/sheets/global.js";
import { renderShadow } from "../../../../utils/shadow.js";
import { pluralize } from "../../../../utils/string.js";
import { modeSheet } from "../../style.js";
import { template } from "./template.js";

class ModeCurrentPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet, modeSheet];
  }

  connectedCallback() {
    renderShadow(this.shadowRoot, template);

    this.yearCountEl = this.shadowRoot.querySelector("#year-count");
    this.yearCountDescEl = this.shadowRoot.querySelector("#year-count-desc");
    this.comparisonMetricEl =
      this.shadowRoot.querySelector("#comparison-metric");

    this.unsubscribeState = subscribe(
      (state) => state.mode,
      (mode) => {
        this.hidden = mode !== "current";
      },
    );

    this.unsubscribeSettings = subscribeToSettings((settings) => {
      this.sync();
    });
  }

  disconnectedCallback() {
    this.unsubscribeState?.();
    this.unsubscribeSettings?.();
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

customElements.define("current-panel", ModeCurrentPanel);
