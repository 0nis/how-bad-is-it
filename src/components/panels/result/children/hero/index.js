import { globalSheet } from "../../../../../styles/sheets/global.js";
import { renderShadow } from "../../../../../utils/shadow.js";
import { capitalize } from "../../../../../utils/string.js";
import { style } from "./style.js";
import { template } from "./template.js";

class ResultHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];

    renderShadow(this.shadowRoot, template, style);

    this.labelEl = this.shadowRoot.querySelector("#label");
    this.frequencyEl = this.shadowRoot.querySelector("#frequency");
    this.descriptionEl = this.shadowRoot.querySelector("#description");
  }

  setData(result) {
    this.labelEl.textContent = result.label;
    this.labelEl.className = `severity-${result.severity}`;

    this.frequencyEl.textContent = capitalize(result.frequency);

    this.descriptionEl.textContent = this.getDescription(
      result.sigma > 0,
      result.percentile,
      result.location.name,
    );
  }

  getDescription(sigma, pct, loc) {
    if (sigma > 0)
      return `Hotter than ${pct.toFixed(pct >= 99 ? 1 : 0)}% of days like this in ${loc}`;
    else
      return `Colder than ${pct.toFixed(pct <= 1 ? 1 : 0)}% of days like this in ${loc}`;
  }
}

customElements.define("result-hero", ResultHero);
