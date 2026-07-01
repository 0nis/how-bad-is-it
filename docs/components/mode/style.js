export const modeSheet = new CSSStyleSheet();

modeSheet.replaceSync(/* CSS */ `
    .panel {
        background: var(--bg-1);
        border: 1px solid var(--border);
        border-radius: var(--r-md);
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .actions { 
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
    }
    .actions > * {
        align-self: center;
    }

    .description {
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .fields {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.75rem;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .label {
        font-size: 0.775rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .optional {
        font-size: 0.7rem;
        font-weight: 400;
        color: var(--text-tertiary);
        text-transform: none;
        letter-spacing: 0;
    }

    input {
        background: var(--bg-2);
        border: 1px solid var(--border);
        border-radius: var(--r-sm);
        padding: 0.5rem 0.65rem;
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--text-secondary);
        outline: none;
        transition:
            border-color 0.15s,
            box-shadow 0.15s,
            color 0.15s;
        width: 100%;
        -webkit-appearance: none;
        color-scheme: dark;
    }
    input:hover {
        color: var(--text-primary);
    }
    input:focus {
        color: var(--text-primary);
        border-color: var(--accent-dim);
        box-shadow: 0 0 0 3px var(--accent-glow);
    }
    input::placeholder {
        color: var(--text-tertiary);
    }

    input[type="date"] {
        cursor: pointer;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
`);
