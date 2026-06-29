import "../components/header/index.js";
import "../components/search/input/index.js";
import "../components/search/suggestions/index.js";
import "../components/panels/container.js";
import "../components/footer/index.js";
import { globalSheet } from "../styles/sheets/global.js";

class AppRoot extends HTMLElement {
  constructor() {
    super();
    document.adoptedStyleSheets = [globalSheet];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /* HTML */ `
      <site-header></site-header>
      <site-search></site-search>
      <panel-container></panel-container>
      <site-footer></site-footer>
    `;
  }
}

customElements.define("app-root", AppRoot);
