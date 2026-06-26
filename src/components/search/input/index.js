import { searchLocations } from "../../../api/locations.js";
import { runAnalysis } from "../../../app/analysis.js";
import { setState, subscribe } from "../../../app/store.js";
import { resetSheet } from "../../../styles/reset.js";
import { el } from "../../../utils/dom.js";
import { renderShadow } from "../../../utils/shadow.js";
import { style } from "./style.js";
import { template } from "./template.js";

class Search extends HTMLElement {
  constructor() {
    super();

    this.state = {
      timer: null,
      query: "",
      loading: false,
      suggestions: [],
    };

    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [resetSheet];
    this.handleInput = this.handleInput.bind(this);
  }

  connectedCallback() {
    this.render();

    this.inputEl = this.shadowRoot.querySelector("#input");
    this.suggestionsEl = this.shadowRoot.querySelector("search-suggestions");

    this.inputEl.addEventListener("input", this.handleInput);

    this.suggestionsEl.addEventListener("location-selected", (e) =>
      this.selectLocation(e.detail),
    );
  }

  handleInput(e) {
    const query = e.target.value.trim();
    this.state.query = query;

    clearTimeout(this.state.timer);

    if (query.length < 2) {
      this.suggestionsEl.setSuggestions([]);
      return;
    }

    this.state.timer = setTimeout(async () => {
      try {
        const locations = await searchLocations(query, 10);
        this.suggestionsEl.setSuggestions(locations);
      } catch (err) {
        console.error(err);
      }
    }, 300);
  }

  selectLocation(loc) {
    setState({ selectedLocation: loc });

    // this.dispatchEvent(
    //   new CustomEvent("location-selected", {
    //     detail: loc,
    //     bubbles: true,
    //     composed: true,
    //   }),
    // );
    runAnalysis(loc);
  }

  render() {
    renderShadow(this.shadowRoot, template, style);
  }
}

customElements.define("site-search", Search);
