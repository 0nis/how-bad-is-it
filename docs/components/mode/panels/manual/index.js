import { subscribe } from "../../../../app/store.js";
import { globalSheet } from "../../../../styles/sheets/global.js";
import { renderShadow } from "../../../../utils/shadow.js";
import { modeSheet } from "../../style.js";
import { template } from "./template.js";

class ModeManual extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet, modeSheet];
  }

  connectedCallback() {
    renderShadow(this.shadowRoot, template);

    this.unsubscribe = subscribe(
      (state) => state.mode,
      (mode) => {
        this.hidden = mode !== "manual";
      },
    );
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }
}

customElements.define("mode-manual", ModeManual);
