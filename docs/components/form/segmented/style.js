export const style = /* CSS */ `
    .wrap {
        display: flex;
        background: var(--bg-2);
        border: 1px solid var(--border);
        border-radius: var(--r-md);
        padding: 0.25rem;
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
        transition: background 0.15s, color 0.15s;
        user-select: none;
        text-align: center;
    }
    
    .segmented-option input:checked + span {
        background: var(--accent);
        color: #0f0f13;
    }
    
    .segmented-option:hover input:not(:checked) + span {
        color: var(--text-primary);
    }
`;
