
/**
 * Composant Button()
 * -------------------
 * Crée un bouton cohérent avec ton design system.
 * Utilise une whitelist de variantes pour éviter les erreurs silencieuses.
 *
 * @param {string} text - Texte du bouton.
 * @param {Object} options
 * @param {string} [options.variant="primary"] - Variante visuelle : primary, ghost, secondary...
 * @param {string} [options.action] - Action JS pour l'event delegation (data-action).
 * @param {string} [options.type="button"] - Type HTML du bouton.
 *
 * @returns {HTMLButtonElement}
 */

export function Button(
  text,
  { variant = "primary", action, type = "button" } = {}
) {
  // 1️⃣ Création de l’élément
  const btn = document.createElement("button");

  // 2️⃣ Type HTML (bouton, submit…)
  btn.type = type;

  // 3️⃣ Classe de base commune à tous les boutons
  btn.classList.add("btn");

  // 4️⃣ Liste des variantes autorisées dans ton Design System
  const VALID_VARIANTS = ["primary", "ghost", "secondary"];

  // 5️⃣ Vérification : si la variante demandée est valide, on la garde.
  // Sinon → on force "primary" pour éviter un bouton cassé.
  const safeVariant = VALID_VARIANTS.includes(variant)
    ? variant
    : "primary";

  // 6️⃣ Application de la classe CSS de la variante
  // Exemple final : .btn--primary
  btn.classList.add(`btn--${safeVariant}`);

  // 7️⃣ Insertion du texte
  btn.textContent = text;

  // 8️⃣ data-action → permet de gérer l’action ailleurs (event delegation)
  if (action) {
    btn.dataset.action = action;
  }

  return btn;
}

