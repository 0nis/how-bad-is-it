export const template = /* HTML */ `
  <div id="wrapper" role="search" aria-label="Search for a city">
    <div class="field">
      <svg
        class="search-icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="6.5"
          cy="6.5"
          r="5"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path
          d="M10.5 10.5L14 14"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <input
        id="input"
        type="search"
        placeholder="City, region, or country…"
        autocomplete="off"
        spellcheck="false"
        aria-label="Search for a city"
        aria-autocomplete="list"
        aria-controls="suggestions"
      />
    </div>
    <search-suggestions></search-suggestions>
  </div>
`;
