export const template = /* HTML */ `
  <footer>
    <p>
      Climate data from
      <a href="https://open-meteo.com" target="_blank" rel="noopener"
        >Open-Meteo</a
      >
      (ERA5, 1940-present). Sigma computed over a ±<span id="day-window"></span
      >-day seasonal window and ±<span id="hour-window"></span>-hour alignment,
      using <span id="years"></span> years of ERA5 reanalysis data.
    </p>
  </footer>
`;
