import { getSettings, subscribeToSettings } from "../../../../app/settings.js";
import { setState, subscribe } from "../../../../app/store.js";
import { globalSheet } from "../../../../styles/sheets/global.js";
import { shiftDays, toDateStr } from "../../../../utils/date.js";
import { renderShadow } from "../../../../utils/shadow.js";
import { pluralize } from "../../../../utils/string.js";
import { modeSheet } from "../../style.js";
import { setYearCount } from "../helpers.js";
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

    this.unsubscribeSettings = setYearCount(
      this.shadowRoot.querySelector("#year-count"),
      this.shadowRoot.querySelector("#year-count-desc"),
    );
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribeSettings?.();
  }

  init() {
    this.render();

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
}

customElements.define("past-panel", ModePastPanel);
