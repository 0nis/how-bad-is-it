export const style = /* CSS */ `
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 15, 19, 0.6);
        backdrop-filter: blur(2px);
        z-index: 200;
        animation: fade-in 0.18s ease;
    }
    
    @keyframes fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    
    .panel {
        position: fixed;
        top: 0;
        right: 0;
        height: 100dvh;
        width: min(360px, 100vw);
        background: var(--bg-1);
        border-left: 1px solid var(--border);
        z-index: 201;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
        overflow-y: auto;
        
        transform: translateX(100%);
        transition: transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
    }
    
    .panel.is-open {
        transform: translateX(0);
    }
    
    @media (max-width: 480px) {
        .panel { width: 100vw; }
    }
    
    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-soft);
    }
    
    .panel-title {
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: -0.01em;
    }
    
    .reset-btn {
        background: none;
        border: none;
        color: var(--text-tertiary);
        font-family: var(--font-body);
        font-size: 0.8rem;
        cursor: pointer;
        padding: 0.25rem 0;
        transition: color 0.15s;
    }
    .reset-btn:hover {
        color: var(--accent);
    }
    
    .section {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }
    
    .section-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .hint {
        font-size: 0.75rem;
        color: var(--text-tertiary);
        line-height: 1.5;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .panel, .overlay {
            transition: none;
            animation: none;
        }
    }
`;
