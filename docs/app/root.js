import "../components/header/index.js";
import "../components/settings/index.js";
import "../components/search/index.js";
import "../components/mode/container.js";
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
      <site-settings></site-settings>
      <site-header></site-header>
      <site-search></site-search>
      <mode-container></mode-container>
      <panel-container></panel-container>
      <site-footer></site-footer>
    `;
  }
}

customElements.define("app-root", AppRoot);
