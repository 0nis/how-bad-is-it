export const style = /* CSS */ `
    .wrap {
        display: flex;
        background: var(--bg-2);
        border: 1px solid var(--border);
        border-radius: var(--r-md);
        gap: 0.25rem;
    }
    
    .segmented-option {
        flex: 1;
        cursor: pointer;
    }
    
    .segmented-option input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .segmented-option span {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.45rem 0.5rem;
        border-radius: calc(var(--r-md) - 3px);
        font-size: 0.825rem;
        font-weight: 500;
        color: var(--text-secondary);
        background-color: transparent;  
        transition: background-color 0.15s, color 0.15s;
        user-select: none;
        text-align: center;
    }
    
    .segmented-option input:checked + span {
        background-color: var(--accent);
        color: var(--text-accent);
    }
    
    .segmented-option:hover input:not(:checked) + span {
        color: var(--text-primary);
    }

    @media (prefers-reduced-motion: reduce) {
        .segmented-option span {
            transition: none;
        }
    }
`;
