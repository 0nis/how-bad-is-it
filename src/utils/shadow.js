/**
 * Renders a HTML template with CSS styles into a shadow root
 *
 * @param {HTMLElement} shadowRoot Root element
 * @param {string | undefined} template HTML
 * @param {string | undefined} styles CSS
 */
export function renderShadow(shadowRoot, template, styles) {
  shadowRoot.innerHTML = `
        ${styles ? `<style>${styles}</style>` : ""}
        ${template ? template : ""}
    `;
}
