import { resetSheet } from "../../../../../styles/reset.js";
import { renderShadow } from "../../../../../utils/shadow.js";
import { style } from "./style.js";
import { template } from "./template.js";

class ResultStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [resetSheet];

    renderShadow(this.shadowRoot, template, style);
  }

  setData() {
    // TODO
  }
}

customElements.define("result-stats", ResultStats);
