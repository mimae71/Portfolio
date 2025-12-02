/**
 * Rend un élément dans un container.
 * @param {HTMLElement} container - Le noeud DOM qui accueillera le composant.
 * @param {HTMLElement} element - Le composant généré (Button, Card, etc.).
 * @param {Object} options
 * @param {boolean} [options.clear=false] - Si true, vide le container avant d'ajouter l'élément.
 */
export function render(container, element, { clear = false } = {}) {
  if (!container || !element) return;

  if (clear) {
    container.innerHTML = "";
  }

  container.appendChild(element);
}
