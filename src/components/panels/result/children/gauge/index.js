import { resetSheet } from "../../../../../styles/reset.js";
import { renderShadow } from "../../../../../utils/shadow.js";
import { style } from "./style.js";
import { template } from "./template.js";

class ResultGauge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [resetSheet];

    renderShadow(this.shadowRoot, template, style);

    this.barEl = this.shadowRoot.querySelector(".bar");
    this.markerEl = this.shadowRoot.querySelector(".marker");
  }

  setData(result) {
    const clamped = Math.max(-4, Math.min(4, result.sigma));
    const pct = ((clamped + 4) / 8) * 100;
    const color = this.getColor(result.interpretation.severity);
    this.barEl.style.setProperty("--gauge-pct", `${pct}%`);
    this.barEl.style.setProperty("--gauge-color", color);
    this.markerEl.style.left = `${pct}%`;
  }

  getColor(severity) {
    const colors = [
      "var(--gauge-normal)",
      "var(--gauge-mild)",
      "var(--gauge-moderate)",
      "var(--gauge-severe)",
      "var(--gauge-extreme)",
      "var(--gauge-critical)",
    ];
    return colors[Math.min(severity, colors.length - 1)];
  }
}

customElements.define("result-gauge", ResultGauge);
