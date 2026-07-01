import { renderShadow } from "../../../utils/shadow.js";
import { globalSheet } from "../../../styles/sheets/global.js";
import { template } from "./template.js";
import { style } from "./style.js";
import { pluralize } from "../../../utils/string.js";

class SliderInput extends HTMLElement {
  static observedAttributes = [
    "id",
    "value",
    "min",
    "max",
    "step",
    "unit",
    "prefix",
  ];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];
    renderShadow(this.shadowRoot, template, style);

    this.input = this.shadowRoot.querySelector("input");
    this.output = this.shadowRoot.querySelector("output");
  }

  connectedCallback() {
    this.sync();

    this.input.addEventListener("input", () => {
      this.value = this.input.value;

      this.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );
    });

    this.input.addEventListener("change", () => {
      this.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );
    });
  }

  attributeChangedCallback() {
    this.sync();
  }

  sync() {
    this.input.min = this.getAttribute("min") ?? "";
    this.input.max = this.getAttribute("max") ?? "";
    this.input.step = this.getAttribute("step") ?? "";
    this.input.value = this.getAttribute("value") ?? "";
    this.input.id = `${this.getAttribute("id")}-input` ?? "";

    this.output.textContent = this.format(this.input.value);
  }

  format(value) {
    const prefix = this.getAttribute("prefix") ?? "";
    const unit = this.getAttribute("unit");

    const n = Number(value);

    return `${prefix}${n}${unit ? ` ${pluralize(unit, n)}` : ""}`;
  }

  applyBounds({ min, max, step }) {
    this.setAttribute("min", min);
    this.setAttribute("max", max);
    this.setAttribute("step", step);
  }

  get value() {
    return this.input.value;
  }

  set value(v) {
    this.setAttribute("value", v);
  }
}

customElements.define("slider-input", SliderInput);
