import {
  HISTORICAL_YEARS,
  WINDOW_DAYS,
  WINDOW_HOURS,
} from "../../constants.js";
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
    this.shadowRoot.querySelector("#day-window").textContent = WINDOW_DAYS;
    this.shadowRoot.querySelector("#hour-window").textContent = WINDOW_HOURS;
    this.shadowRoot.querySelector("#years").textContent = HISTORICAL_YEARS;
  }
}

customElements.define("site-footer", SiteFooter);
