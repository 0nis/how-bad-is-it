import "./result/index.js";
import "./loading/index.js";
import "./error/index.js";

import { renderShadow } from "../../utils/shadow.js";
import { subscribe } from "../../app/store.js";

const template = /* HTML */ `
  <loading-panel hidden></loading-panel>
  <error-panel hidden></error-panel>
  <result-panel hidden></result-panel>
`;

class PanelContainer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    renderShadow(this.shadowRoot, template);

    this.loading = this.shadowRoot.querySelector("loading-panel");
    this.error = this.shadowRoot.querySelector("error-panel");
    this.result = this.shadowRoot.querySelector("result-panel");
  }

  connectedCallback() {
    this.unsubscribe = subscribe((state) => {
      //   this.loading.hide();
      //   this.error.hide();
      this.result.hide();

      switch (state.status) {
        // case "loading":
        //   this.loading.show();
        //   break;

        // case "error":
        //   this.error.setMessage(state.error);
        //   this.error.show();
        //   break;

        case "success":
          this.result.setResult(state.analysis);
          this.result.show();
          break;
      }
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }
}

customElements.define("panel-container", PanelContainer);
