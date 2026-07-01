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

    .fields {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.75rem;
    }

    .-field {
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
        color: var(--text-primary);
        outline: none;
        transition:
            border-color 0.15s,
            box-shadow 0.15s;
        width: 100%;
        -webkit-appearance: none;
        color-scheme: dark;
    }
    input:focus {
        border-color: var(--accent-dim);
        box-shadow: 0 0 0 3px var(--accent-glow);
    }
    input::placeholder {
        color: var(--text-tertiary);
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }

    .analyse-btn {
        align-self: flex-start;
        background: var(--accent);
        color: #0f0f13;
        border: none;
        border-radius: var(--r-sm);
        padding: 0.55rem 1.25rem;
        font-family: var(--font-body);
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        transition:
            opacity 0.15s,
            transform 0.1s;
    }
    .analyse-btn:hover {
        opacity: 0.9;
    }
    .analyse-btn:active {
        transform: scale(0.97);
    }
`);
