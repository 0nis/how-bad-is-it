export const template = /* HTML */ `
  <div class="wrapper">
    <button
      class="trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-controls="listbox"
    >
      <span class="trigger-content">
        <span class="trigger-icon" aria-hidden="true"></span>
        <span class="trigger-label"></span>
      </span>
      <svg
        class="chevron"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 4l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <ul
      class="listbox"
      id="listbox"
      role="listbox"
      aria-label="Season"
      hidden
    ></ul>
  </div>
`;
