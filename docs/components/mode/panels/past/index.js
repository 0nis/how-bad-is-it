import { getSettings, subscribeToSettings } from "../../../../app/settings.js";
import { subscribe } from "../../../../app/store.js";
import { globalSheet } from "../../../../styles/sheets/global.js";
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

    const typeInput = this.shadowRoot.querySelector("#type");
    typeInput.options = [
      { label: "Max", value: "max" },
      { label: "Min", value: "min" },
    ];
    typeInput.value = "max";
  }

  render() {
    renderShadow(this.shadowRoot, template);
  }
}

customElements.define("past-panel", ModePastPanel);
