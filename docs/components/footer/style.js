export const style = /* CSS */ `
    footer {
        text-align: center;
        font-size: 0.75rem;
        color: var(--text-tertiary);
        line-height: 1.7;
    }
    footer a {
        color: var(--text-secondary);
        text-decoration: none;
    }
    footer a:hover {
        color: var(--accent);
    }

    footer .support {
        margin-top: 0.4rem;
    }
    footer .support a {
        color: var(--text-tertiary);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        gap: 0.4rem;
        font-style: italic;
    }
    footer .support a:hover {
        color: var(--accent);
    }
    footer .support svg {
        width: 16px;
        height: 16px;
        transform: rotate(8deg)
    }

    footer .support a:hover svg {
        animation: rotate 2s infinite linear;
    }

    @keyframes rotate {
        to {
            transform: rotate(360deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        footer .support a:hover svg {
            animation: none;
        }
    }
`;
