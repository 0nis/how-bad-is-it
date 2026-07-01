import { globalSheet } from "../../../styles/sheets/global.js";
import { el } from "../../../utils/dom.js";
import { renderShadow } from "../../../utils/shadow.js";
import { style } from "./style.js";

class SegmentedOptionsInput extends HTMLElement {
  static observedAttributes = ["value"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];
    renderShadow(this.shadowRoot, `<div class="wrap"></div>`, style);

    this.wrap = this.shadowRoot.querySelector(".wrap");
  }

  set options(list) {
    this._options = list || [];
    this.render();
  }

  get options() {
    return this._options;
  }

  set value(v) {
    this._value = v;
    this.render();
  }

  get value() {
    return this._value;
  }

  connectedCallback() {
    // this.wrap.addEventListener("click", (e) => {
    //   const btn = e.target.closest(".segmented-option");
    //   if (!btn) return;
    //   this.value = btn.dataset.value;
    //   this.dispatchEvent(
    //     new CustomEvent("change", {
    //       detail: { value: this.value },
    //       bubbles: true,
    //       composed: true,
    //     }),
    //   );
    // });
    // this.render();
  }

  render() {
    if (!this._options) return;
    const fragment = document.createDocumentFragment();

    for (const { label, value } of this._options) {
      fragment.append(
        el(
          "label",
          {
            className: `segmented-option`,
          },
          [
            el("input", {
              type: "radio",
              value: value,
              checked: value === this._value,
              onclick: () => {
                this.value = value;
                this.dispatchEvent(
                  new Event("change", {
                    detail: { value: this.value },
                    bubbles: true,
                    composed: true,
                  }),
                );
              },
            }),
            el("span", {}, [label]),
          ],
        ),
      );
    }

    this.wrap.replaceChildren(fragment);
  }
}

customElements.define("segmented-input", SegmentedOptionsInput);
