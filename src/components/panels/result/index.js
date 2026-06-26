import "./children/hero/index.js";
import "./children/gauge/index.js";
import "./children/stats/index.js";

import { panelSheet } from "../../../styles/panel.js";
import { resetSheet } from "../../../styles/reset.js";
import { style } from "./style.js";
import { template } from "./template.js";
import { renderShadow } from "../../../utils/shadow.js";

class ResultPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [resetSheet, panelSheet];

    renderShadow(this.shadowRoot, template, style);

    this.hero = this.shadowRoot.querySelector("result-hero");
    this.gauge = this.shadowRoot.querySelector("result-gauge");
    this.stats = this.shadowRoot.querySelector("result-stats");
  }

  setResult(result) {
    this.hero.setData(result);
    this.gauge.setData(result);
    this.stats.setData(result);
  }

  show() {
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }
}

customElements.define("result-panel", ResultPanel);
