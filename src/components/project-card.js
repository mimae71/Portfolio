
import { Card } from "./card.js";
import { Button } from "./button.js";

/**
 * Crée une carte projet à partir d'un objet "project".
 *
 * @param {Object} project
 * @param {string} project.id
 * @param {string} project.title
 * @param {string} project.description
 * @param {string[]} [project.tags]
 * @param {string} [project.demoUrl]
 * @param {string} [project.codeUrl]
 *
 * @returns {HTMLElement} article.project-card
 */
export function ProjectCard(project) {
  const footerItems = [];

  // Bouton "Voir la démo"
  if (project.demoUrl) {
    const demoLink = document.createElement("a");
    demoLink.href = project.demoUrl;
    demoLink.target = "_blank";
    demoLink.rel = "noopener noreferrer";
    demoLink.classList.add("btn", "btn--primary");
    demoLink.textContent = "Voir la démo";
    footerItems.push(demoLink);
  }

  // Bouton / lien "Voir le code"
  if (project.codeUrl) {
    const codeLink = document.createElement("a");
    codeLink.href = project.codeUrl;
    codeLink.target = "_blank";
    codeLink.rel = "noopener noreferrer";
    codeLink.classList.add("btn", "btn--ghost");
    codeLink.textContent = "Voir le code";
    footerItems.push(codeLink);
  }

  // On réutilise Card() comme base visuelle
  const card = Card(project.title, project.description, {
    variant: "project",
    footerItems,
    tags: project.tags || [],
  });

  card.classList.add("project-card"); // si tu as un style spécifique projet

  // Optionnel : dataset pour plus tard (store, filtrage, etc.)
  card.dataset.projectId = project.id;

  return card;
}
