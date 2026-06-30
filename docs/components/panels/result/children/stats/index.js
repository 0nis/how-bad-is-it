import { globalSheet } from "../../../../../styles/sheets/global.js";
import { renderShadow } from "../../../../../utils/shadow.js";
import {
  formatPrecipitation,
  formatTemp,
  formatWind,
} from "../../../../../utils/weather.js";
import { style } from "./style.js";
import { template } from "./template.js";
import { APPSTATE } from "../../../../../types.js";

class ResultStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalSheet];

    renderShadow(this.shadowRoot, template, style);

    this.metrics = {
      temperature: {
        row: "#temp",
        id: "temperature",
        format: (v, unitSystem) => formatTemp(v, unitSystem),
      },

      feels: {
        row: "#feels",
        id: "apparentTemperature",
        format: (v, unitSystem) => formatTemp(v, unitSystem),
      },

      humidity: {
        row: "#hum",
        id: "humidity",
        format: (v) => `${v.toFixed(1)}%`,
      },

      precipitation: {
        row: "#prec",
        id: "precipitation",
        format: (v, unitSystem) => formatPrecipitation(v, unitSystem),
      },

      wind: {
        row: "#wind",
        id: "windSpeed",
        format: (v, unitSystem) => formatWind(v, unitSystem),
      },

      cloudCover: {
        row: "#cc",
        id: "cloudCover",
        format: (v) => `${Math.round(v)}%`,
      },
    };
  }

  /**
   * @param {typeof APPSTATE.analysis} result
   * @param {"metric" | "imperial"} unitSystem
   */
  setData(result, unitSystem = "metric") {
    for (const key in this.metrics) {
      const m = this.metrics[key];

      const row = this.shadowRoot.querySelector(m.row);

      if (
        (result.basedOn === "raw" && key === "temperature") ||
        (result.basedOn === "feels" && key === "feels")
      )
        row.style.setProperty("color", "var(--accent)");

      const observed = result.observed[m.id];
      const mean = result.historical[m.id]?.mean;
      const std = result.historical[m.id]?.std;

      if (observed == null || mean == null || std == null) {
        row.hidden = true;
        continue;
      }

      const fmt = (v) => {
        return m.format(v, unitSystem);
      };

      row.querySelector("[data-now]").textContent = fmt(observed);
      row.querySelector("[data-mean]").textContent = fmt(mean);
      row.querySelector("[data-std]").textContent = `±${fmt(std)}`;
    }
  }
}

customElements.define("result-stats", ResultStats);
