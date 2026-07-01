import { globalSheet } from "../../styles/sheets/global.js";
import { renderShadow } from "../../utils/shadow.js";
import { style } from "./style.js";
import { template } from "./template.js";

class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];
  }

  connectedCallback() {
    renderShadow(this.shadowRoot, template, style);
  }
}

customElements.define("site-footer", SiteFooter);
