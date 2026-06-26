import "../components/header/index.js";
import "../components/search/input/index.js";
import "../components/search/suggestions/index.js";
import "../components/panels/container.js";
import { resetSheet } from "../styles/reset.js";

class AppRoot extends HTMLElement {
  constructor() {
    super();
    document.adoptedStyleSheets = [resetSheet];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /* HTML */ `
      <site-header></site-header>
      <site-search></site-search>
      <panel-container></panel-container>
    `;
  }
}

customElements.define("app-root", AppRoot);
