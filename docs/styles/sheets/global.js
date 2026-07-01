export const globalSheet = new CSSStyleSheet();

globalSheet.replaceSync(/* CSS */ `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: var(--font-body);
    background: var(--bg-0);
    color: var(--text-primary);
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }


  [hidden] {
    display: none !important;
  }

  @media (max-width: 520px) {
    body {
      padding: 1.5rem 0.75rem;
    }
  }
`);
