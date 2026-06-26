import { resetSheet } from "../../../../../styles/reset.js";
import { renderShadow } from "../../../../../utils/shadow.js";
import { capitalize } from "../../../../../utils/string.js";
import { style } from "./style.js";
import { template } from "./template.js";

class ResultHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [resetSheet];

    renderShadow(this.shadowRoot, template, style);

    this.pctValueEl = this.shadowRoot.querySelector("#pct-value");
    this.pctDescriptorEl = this.shadowRoot.querySelector("#pct-descriptor");
    this.tempDescriptorEl = this.shadowRoot.querySelector("#temp-descriptor");
    this.frequencyEl = this.shadowRoot.querySelector("#frequency");
  }

  setData(result) {
    const isHot = result.sigma >= 0;
    this.pctValueEl.textContent = `${this.getPercentile(isHot, result.percentile)}%`;
    this.pctValueEl.className = `severity-${result.interpretation.severity}`;
    this.pctDescriptorEl.textContent = this.getDescription(
      isHot,
      result.percentile,
      result.location,
    );
    this.tempDescriptorEl.textContent = result.interpretation.label;
    this.frequencyEl.textContent = capitalize(result.frequency.label) + ".";
  }

  getPercentile(isHot, percentile) {
    return isHot
      ? percentile.toFixed(percentile >= 99 ? 1 : 0)
      : (100 - percentile).toFixed(100 - percentile >= 99 ? 1 : 0);
  }

  getDescription(isHot, percentile, location) {
    const pctForPhrase = isHot ? percentile : 100 - percentile;
    return `${isHot ? "hotter" : "colder"} than ${pctForPhrase.toFixed(pctForPhrase >= 99 ? 1 : 0)}% of days like this in ${location.name}.`;
  }
}

customElements.define("result-hero", ResultHero);
