import { globalSheet } from "../../../styles/sheets/global.js";
import { el } from "../../../utils/dom.js";
import { renderShadow } from "../../../utils/shadow.js";
import { style } from "./style.js";
import { template } from "./template.js";

class DropdownInput extends HTMLElement {
  open = false;
  _selected = null;
  _options = [];
  _bound = false;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];

    this.handleDocumentPointerDown = (e) => {
      if (!e.composedPath().includes(this)) {
        this.closeList();
      }
    };
  }

  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback(name, _old, next) {
    if (name !== "value") return;
    if (this._selected === next) return;
    if (!this.options.some((o) => o.value === next)) return;

    this._selected = next;
    this.renderTrigger();
    this.renderOptions();
  }

  connectedCallback() {
    renderShadow(this.shadowRoot, template, style);

    this.triggerEl = this.shadowRoot.querySelector(".trigger");
    this.listboxEl = this.shadowRoot.querySelector(".listbox");

    this.bindEvents();

    this.buildOptions();
    this.renderTrigger();
    this.renderOptions();
  }

  disconnectedCallback() {
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    if (this._selected === value) return;
    this._selected = value;

    if (this.getAttribute("value") !== value) {
      this.setAttribute("value", value);
    }

    this.renderTrigger();
    this.renderOptions();
  }

  get options() {
    return this._options;
  }

  set options(list) {
    this._options = list || [];

    if (this.listboxEl) {
      this.buildOptions();
      this.renderTrigger();
      this.renderOptions();
    }
  }

  buildOptions() {
    if (!this.listboxEl) return;

    const fragment = document.createDocumentFragment();

    for (const { value, label, icon } of this.options) {
      if (!value || !label) continue;
      const li = el(
        "li",
        {
          className: "option",
          attrs: {
            role: "option",
            tabindex: "-1",
          },
        },
        [
          el("span", {
            className: "option-icon",
            innerHTML: icon,
            attrs: { "aria-hidden": "true" },
          }),
          el("span", { className: "option-name" }, [label]),
        ],
      );
      li.dataset.value = value;
      fragment.appendChild(li);
    }

    this.listboxEl.replaceChildren(fragment);
  }

  renderTrigger() {
    if (!this.triggerEl) return;

    const option = this.options.find((o) => o.value === this.selected);

    if (!option) return;

    this.triggerEl.querySelector(".trigger-icon").innerHTML = option.icon ?? "";
    this.triggerEl.querySelector(".trigger-label").textContent =
      option.label ?? "";
  }

  renderOptions() {
    if (!this.listboxEl) return;

    this.listboxEl.querySelectorAll(".option").forEach((option) => {
      option.setAttribute(
        "aria-selected",
        option.dataset.value === this.selected ? "true" : "false",
      );
    });
  }

  openList() {
    if (this.open) return;

    this.open = true;

    this.listboxEl.hidden = false;
    this.triggerEl.setAttribute("aria-expanded", "true");

    requestAnimationFrame(() => {
      this.listboxEl.classList.add("is-open");
    });

    const selected = this.listboxEl.querySelector(
      `[data-value="${this.selected}"]`,
    );

    selected?.focus();
  }

  closeList() {
    if (!this.open) return;

    this.open = false;

    this.triggerEl.setAttribute("aria-expanded", "false");
    this.listboxEl.classList.remove("is-open");

    const onTransitionEnd = () => {
      if (!this.open) this.listboxEl.hidden = true;
      this.listboxEl.removeEventListener("transitionend", onTransitionEnd);
    };

    this.listboxEl.addEventListener("transitionend", onTransitionEnd);
  }

  select(value) {
    if (this.selected === value) {
      this.closeList();
      return;
    }

    this.selected = value;

    this.closeList();

    this.triggerEl.focus();

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  bindEvents() {
    if (this._bound) return;
    this._bound = true;

    this.triggerEl.addEventListener("click", () => {
      this.open ? this.closeList() : this.openList();
    });

    this.triggerEl.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
          e.preventDefault();
          this.openList();
          break;
      }
    });

    this.listboxEl.addEventListener("click", (e) => {
      const option = e.target.closest(".option");

      if (!option) return;

      this.select(option.dataset.value);
    });

    this.listboxEl.addEventListener("keydown", (e) => {
      const options = [...this.listboxEl.querySelectorAll(".option")];

      const current = this.shadowRoot.activeElement;
      const index = options.indexOf(current);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          options[(index + 1) % options.length]?.focus();
          break;

        case "ArrowUp":
          e.preventDefault();
          options[(index - 1 + options.length) % options.length]?.focus();
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          if (current?.dataset.value) {
            this.select(current.dataset.value);
          }
          break;

        case "Escape":
          e.preventDefault();
          this.closeList();
          this.triggerEl.focus();
          break;
      }
    });

    document.addEventListener("pointerdown", this.handleDocumentPointerDown);
  }
}

customElements.define("dropdown-input", DropdownInput);
