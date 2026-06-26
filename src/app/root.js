import "../components/header/index.js";

class AppRoot extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /* HTML */ ` <site-header /> `;
  }
}

customElements.define("app-root", AppRoot);
