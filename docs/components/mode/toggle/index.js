import { setState } from "../../../app/store.js";
import { globalSheet } from "../../../styles/sheets/global.js";
import { renderShadow } from "../../../utils/shadow.js";
import { style } from "./style.js";
import { template } from "./template.js";

class ModeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];
  }

  connectedCallback() {
    renderShadow(this.shadowRoot, template, style);

    this.currentBtn = this.shadowRoot.querySelector("#current");
    this.pastBtn = this.shadowRoot.querySelector("#past");
    this.manualBtn = this.shadowRoot.querySelector("#manual");

    this.currentBtn.addEventListener("click", () =>
      this.setCurrentMode("current"),
    );
    this.pastBtn.addEventListener("click", () => this.setCurrentMode("past"));
    this.manualBtn.addEventListener("click", () =>
      this.setCurrentMode("manual"),
    );
  }

  /** @param {"current" | "manual"} mode */
  setCurrentMode(mode) {
    this.currentBtn.checked = mode === "current";
    this.manualBtn.checked = mode === "manual";
    this.pastBtn.checked = mode === "past";

    setState({
      mode,
    });
  }
}

customElements.define("mode-toggle", ModeToggle);
