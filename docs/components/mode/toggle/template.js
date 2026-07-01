export const template = /* HTML */ `
  <fieldset class="toggle">
    <legend class="sr-only">Temperature source</legend>

    <label class="option">
      <input
        type="radio"
        name="input-mode"
        id="current"
        value="today"
        checked
      />
      <span class="label">
        <span class="label-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle
              cx="7"
              cy="7"
              r="3"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <line
              x1="7"
              y1="0.5"
              x2="7"
              y2="2.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="7"
              y1="11.5"
              x2="7"
              y2="13.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="0.5"
              y1="7"
              x2="2.5"
              y2="7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="11.5"
              y1="7"
              x2="13.5"
              y2="7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="2.4"
              y1="2.4"
              x2="3.8"
              y2="3.8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="10.2"
              y1="10.2"
              x2="11.6"
              y2="11.6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="11.6"
              y1="2.4"
              x2="10.2"
              y2="3.8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="3.8"
              y1="10.2"
              x2="2.4"
              y2="11.6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </span>
        Current weather
      </span>
    </label>

    <label class="option">
      <input type="radio" name="input-mode" id="past" value="past" />
      <span class="label">
        <span class="label-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <g fill="none">
              <path
                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
              />
              <path
                fill="currentColor"
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
              />
            </g>
          </svg>
        </span>
        Past date
      </span>
    </label>

    <label class="option">
      <input type="radio" name="input-mode" id="manual" value="manual" />
      <span class="label">
        <span class="label-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        Enter values
      </span>
    </label>
  </fieldset>
`;
