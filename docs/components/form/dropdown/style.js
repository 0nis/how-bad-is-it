export const style = /* CSS */ `
  :host {
    display: block;
  }

  .wrapper {
    position: relative;
  }

  .trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 0.5rem 0.65rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--text-secondary);
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    text-align: left;
    -webkit-appearance: none;
  }
  .trigger:hover {
    color: var(--text-primary);
  }
  .trigger:focus,
  .trigger[aria-expanded="true"] {
    color: var(--text-primary);
    border-color: var(--accent-dim);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .trigger-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .trigger-icon {
    display: inline-flex;
    font-size: 0.95rem;
    line-height: 1;
  }

  .chevron {
    flex-shrink: 0;
    color: var(--text-tertiary);
    transition: transform 0.15s ease;
  }
  .trigger[aria-expanded="true"] .chevron {
    transform: rotate(180deg);
  }

  .listbox {
    position: absolute;
    top: calc(100% + 0.35rem);
    left: 0;
    right: 0;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    overflow: hidden;
    z-index: 50;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
      opacity: 0;
    transform: translateY(-4px);
    pointer-events: none;
    transition: opacity 0.12s ease, transform 0.12s ease;
  }
  .listbox.is-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--text-secondary);
    cursor: pointer;
    border-bottom: 1px solid var(--border-soft);
    transition: background 0.1s, color 0.1s;
    outline: none;
    user-select: none;
  }
  .option:last-child {
    border-bottom: none;
  }
  .option:hover,
  .option:focus {
    background: var(--bg-2);
    color: var(--text-primary);
  }
  .option[aria-selected="true"] {
    color: var(--text-primary);
  }
  .option[aria-selected="true"] .option-name::after {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    margin-left: 0.5rem;
    vertical-align: middle;
  }
  .option-icon {
    display: inline-flex;
    font-size: 0.95rem;
    line-height: 1;
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .listbox, .option, .trigger , .chevron {
      transition: none;
    }
  }
`;
