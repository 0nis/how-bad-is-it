import { globalSheet } from "../../../../../styles/sheets/global.js";
import { renderShadow } from "../../../../../utils/shadow.js";
import { style } from "./style.js";
import { template } from "./template.js";
import { APPSTATE } from "../../../../../types.js";
import { el } from "../../../../../utils/dom.js";

class ResultContext extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];

    renderShadow(this.shadowRoot, template, style);

    this.contextEl = this.shadowRoot.querySelector("#context");
    this.hidden = true;
  }

  /** @param {typeof APPSTATE.analysis} result */
  setData(result) {
    this.contextEl.innerHTML = "";
    const mode = result.context.mode;

    const sampleSize = result.sampleSize;

    const [metric, aggregation] = result.basedOn.split(".");

    const historicalYears = result.context.settings.historicalYears;
    const windowDays = result.context.settings.windowDays;
    const windowHours = result.context.settings.windowHours;

    const season = result.context.season;

    const children = [];

    switch (mode) {
      case "current":
        children.push(
          el("p", {
            textContent: `Compared using ${this.format(metric)} from the same time (±${windowHours} h), within ±${windowDays} days, across ${historicalYears} years, with a sample size of ${sampleSize}`,
          }),
        );
        break;
      case "past":
        children.push(
          el("p", {
            textContent: `Compared using daily ${this.format(aggregation)} ${this.format(metric)} within ±${windowDays} days, across ${historicalYears} years, with a sample size of ${sampleSize}`,
          }),
        );
        break;
      case "manual":
        children.push(
          el("p", {
            textContent: `Based on manually entered values`,
            className: "important",
          }),
        );
        children.push(
          el("p", {
            textContent: `Compared using daily ${this.format(aggregation)} ${this.format(metric)} in ${season}, across ${historicalYears} years, with a sample size of ${sampleSize}`,
          }),
        );
        break;
    }

    for (const child of children) this.contextEl.appendChild(child);

    if (this.contextEl.children.length === 0) this.hidden = true;
    else this.hidden = false;
  }

  format(v) {
    if (v === undefined) return null;
    if (v === "min") return "minimum";
    if (v === "max") return "maximum";
    if (v === "temperature") return "raw air temperature";
    if (v === "apparentTemperature") return "feels-like temperature";
  }
}

customElements.define("result-context", ResultContext);
