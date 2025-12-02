/**
 * Crée une carte générique.
 *
 * @param {string} title - Titre principal de la carte.
 * @param {string} content - Texte principal / description.
 * @param {Object} options
 * @param {string} [options.variant="default"] - Variante visuelle éventuelle.
 * @param {HTMLElement[]} [options.footerItems] - Eléments DOM à placer en bas (boutons, liens...).
 * @param {string[]} [options.tags] - Liste de tags à afficher.
 *
 * @returns {HTMLElement} article.project-card
 */
export function Card(title, content, { variant = "default", footerItems = [], tags = [] } = {}) {
  const card = document.createElement("article");
  card.classList.add("card");

  if (variant !== "default") {
    card.classList.add(`card--${variant}`);
  }

  // Header / titre
  const header = document.createElement("header");
  header.classList.add("card__header");

  const titleEl = document.createElement("h3");
  titleEl.classList.add("card__title");
  titleEl.textContent = title;

  header.appendChild(titleEl);

  // Tags éventuels
  if (tags.length > 0) {
    const tagsWrapper = document.createElement("div");
    tagsWrapper.classList.add("card__tags", "inline");

    tags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.classList.add("tag");
      tagEl.textContent = tag;
      tagsWrapper.appendChild(tagEl);
    });

    header.appendChild(tagsWrapper);
  }

  // Contenu
  const body = document.createElement("div");
  body.classList.add("card__body");

  const contentEl = document.createElement("p");
  contentEl.classList.add("card__content");
  contentEl.textContent = content;

  body.appendChild(contentEl);

  // Footer (boutons / liens)
  const footer = document.createElement("footer");
  footer.classList.add("card__footer");

  footerItems.forEach((item) => {
    footer.appendChild(item);
  });

  // Assemblage
  card.appendChild(header);
  card.appendChild(body);

  // On n'ajoute le footer que s'il y a des éléments dedans
  if (footerItems.length > 0) {
    card.appendChild(footer);
  }

  return card;
}
