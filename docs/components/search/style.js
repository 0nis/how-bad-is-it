export const style = /* CSS */ `
    #wrapper {
        position: relative;
    }

    .field {
        display: flex;
        align-items: center;
        background: var(--bg-1);
        border: 1px solid var(--border);
        border-radius: var(--r-md);
        padding: 0.75rem 1rem;
        gap: 0.75rem;
        transition:
            border-color 0.15s,
            box-shadow 0.15s;
    }
    .field:focus-within {
        border-color: var(--accent-dim);
        box-shadow: 0 0 0 3px var(--accent-glow);
    }

    .search-icon {
        color: var(--text-tertiary);
        flex-shrink: 0;
    }

    #input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        font-family: var(--font-body);
        font-size: 1rem;
        color: var(--text-primary);
    }
    #input::placeholder {
        color: var(--text-tertiary);
    }

    @media (prefers-reduced-motion: reduce) {
        .field {
            transition: none;
        }
    }
`;
