// =====================================================
// SEMAINE 2 – JOUR 1
// DOM avancé, events centralisés, architecture propre
// =====================================================

// =============================
// 1. Sélecteurs & constantes
// =============================

// Bouton "retour en haut"
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Header sticky
const header = document.querySelector(".header");

// Liens de navigation
const navLinks = document.querySelectorAll(".nav__link");

// Sections principales (pour le scroll spy & l'observer)
const sections = document.querySelectorAll("section");

// Zone aria-live pour annoncer la section visible
const navAnnouncer = document.getElementById("nav-announcer");

// Observer reveal
const revealElements = document.querySelectorAll(".reveal");

// Formulaire de contact + éléments pour les messages
const form = document.querySelector(".contact__form");
const formStatus = document.querySelector("#form-status");
const formGlobalError = document.querySelector("#form-global-error");

// Bouton "Afficher plus" dans la section projets
const btnShowMore = document.getElementById("btn-show-more");
const extraWrapper = document.getElementById("extra-wrapper");
const projectsAnnouncer = document.getElementById("projects-announcer");

// Préférence utilisateur pour la réduction des animations
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// -----------------------------
// Map des champs pour la validation
// -----------------------------
const fields = {
  nom: {
    el: document.querySelector("#nom"),
    error: document.querySelector("#nom-error"),
    validate: (value) => {
      if (!value) return "Le nom est requis.";
      if (value.length < 2)
        return "Le nom doit contenir au moins 2 caractères.";
      return null;
    },
  },
  email: {
    el: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate: (value) => {
      if (!value) return "L’e-mail est requis.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Veuillez saisir une adresse e-mail valide.";
      }
      return null;
    },
  },
  message: {
    el: document.querySelector("#message"),
    error: document.querySelector("#message-error"),
    validate: (value) => {
      if (!value) return "Le message est requis.";
      if (value.length < 10) {
        return "Votre message doit contenir au moins 10 caractères.";
      }
      return null;
    },
  },
};

// =============================
// 2. Helpers "généraux"
// =============================

// Défilement fluide vers le haut
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

// Défilement fluide vers une section (pour les ancres #id)
function smoothScrollToSection(targetId) {
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!target) return;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

// Mise à jour de l'état du lien actif dans la navigation
function updateActiveLink(visibleSectionId) {
  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href")?.slice(1); // enlève le '#'
    const isActive = targetId === visibleSectionId;

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

    link.classList.toggle("nav__link-active", isActive);
  });
}

// Annonce dans la zone aria-live des sections
function announceVisibleSection(sectionId) {
  if (!navAnnouncer || !sectionId) return;
  navAnnouncer.textContent = `Section ${sectionId} affichée`;
}

// Helper pour savoir si le bloc "projet supplémentaire" est ouvert
function isExtraProjectOpen() {
  if (!extraWrapper) return false;
  return !extraWrapper.hasAttribute("hidden");
}

// =============================
// 3. UI : mises à jour visuelles
// =============================

// Afficher / masquer le bouton "retour en haut"
function updateScrollTopVisibility(scrollY) {
  if (!scrollTopBtn) return;
  const shouldShow = scrollY > 300;
  scrollTopBtn.classList.toggle("show", shouldShow);
}

// Appliquer la classe de header sticky
function updateHeaderOnScroll(scrollY) {
  if (!header) return;
  header.classList.toggle("is-scrolled", scrollY > 10);
}

// Gérer l'ouverture / fermeture du projet supplémentaire
function toggleExtraProjects(forceOpen) {
  if (!btnShowMore || !extraWrapper) return;

  // État actuel
  const currentlyOpen = isExtraProjectOpen();

  // Nouvel état (si forceOpen est défini, on l'utilise, sinon on inverse)
  const willBeOpen =
    typeof forceOpen === "boolean" ? forceOpen : !currentlyOpen;

  // Toggle affichage
  extraWrapper.toggleAttribute("hidden", !willBeOpen);

  // Mise à jour ARIA
  btnShowMore.setAttribute("aria-expanded", String(willBeOpen));

  // Texte du bouton
  btnShowMore.textContent = willBeOpen ? "Afficher moins" : "Afficher plus";

  // Annonce pour lecteur d’écran
  if (projectsAnnouncer) {
    projectsAnnouncer.textContent = willBeOpen
      ? "Nouveau projet affiché"
      : "Projet masqué";
  }
}

// =============================
// 4. Validation du formulaire
// =============================

// Valide un champ donné et met à jour les messages/états
function validateField(field) {
  if (!field || !fields[field.id]) return null;

  const { validate, error: errorEl } = fields[field.id];
  const value = field.value.trim();
  const errorMessage = validate(value);

  if (errorMessage) {
    field.setAttribute("aria-invalid", "true");
    errorEl.textContent = errorMessage;
  } else {
    field.removeAttribute("aria-invalid");
    errorEl.textContent = "";
  }

  return errorMessage;
}

// Affiche un message d'erreur global pour le formulaire
function showGlobalError(msg) {
  if (!formGlobalError) return;
  formGlobalError.hidden = false;
  formGlobalError.textContent = msg;
}

// Efface le message global
function clearGlobalMessage() {
  if (!formGlobalError) return;
  formGlobalError.hidden = true;
  formGlobalError.textContent = "";
}

// Message de succès après envoi
function showFormSuccess() {
  if (!formStatus) return;
  formStatus.textContent = "Message envoyé ✅ Merci pour votre contact.";
  formStatus.setAttribute("tabindex", "-1");
  formStatus.focus();
}

// =============================
// 5. Event handlers (centralisés)
// =============================

// Handler principal pour le scroll (un seul listener pour la fenêtre)
function handleScroll() {
  const scrollY = window.scrollY;
  updateScrollTopVisibility(scrollY);
  updateHeaderOnScroll(scrollY);
}

// Event delegation pour tous les clics du document
function handleClick(event) {
  const target = event.target;

  // 1) Bouton retour en haut (via id)
  if (target.closest("#scrollTopBtn")) {
    event.preventDefault();
    scrollToTop();
    return;
  }

  // 2) Bouton "Afficher plus" projets
  if (target.closest("#btn-show-more")) {
    event.preventDefault();
    toggleExtraProjects();
    return;
  }

  // 3) Liens d'ancre internes (#section) → scroll fluide
  const anchor = target.closest('a[href^="#"]');
  if (anchor) {
    const href = anchor.getAttribute("href");
    // Si href est juste "#", on ne fait rien de spécial
    if (!href || href === "#") return;

    event.preventDefault();
    const targetId = href.slice(1);
    smoothScrollToSection(targetId);
    return;
  }

  // D'autres actions pourront être ajoutées ici plus tard
}

// Gestionnaire global clavier (Enter / Escape)
function handleKeydown(event) {
  // ESCAPE → fermer le projet supplémentaire si ouvert
  if (event.key === "Escape") {
    if (isExtraProjectOpen()) {
      toggleExtraProjects(false);
    }
  }

  // ENTER → ici on pourrait plus tard déclencher des actions
  // selon l'élément focus (data-action, etc.)
  // Pour l'instant, on laisse le comportement natif des boutons / liens.
}

// Gestionnaire de validation à la soumission du formulaire
function handleFormSubmit(event) {
  event.preventDefault();

  clearGlobalMessage();

  let firstInvalid = null;
  let hasError = false;

  // On boucle sur tous les champs définis dans "fields"
  Object.values(fields).forEach(({ el }) => {
    const invalid = validateField(el);
    if (invalid) {
      hasError = true;
      if (!firstInvalid) firstInvalid = el;
    }
  });

  if (hasError) {
    showGlobalError(
      "Le formulaire contient des erreurs, veuillez vérifier les champs en rouge."
    );
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  // Si tout est valide, on simule un "envoi" et on réinitialise
  showFormSuccess();
  if (form) {
    form.reset();
  }
}

// Gestionnaire de validation "en temps réel" via event delegation
function handleFormInput(event) {
  const field = event.target;
  if (!field.id || !fields[field.id]) return;
  validateField(field);
}

function handleFormBlur(event) {
  const field = event.target;
  if (!field.id || !fields[field.id]) return;
  validateField(field);
}

// =============================
// 6. IntersectionObserver
//    (sections + .reveal)
// =============================

function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    const target = entry.target;
    const sectionId = target.id;

    if (entry.isIntersecting) {
      // 1) Annonce de la section (si l'élément a un id)
      if (sectionId) {
        announceVisibleSection(sectionId);
        updateActiveLink(sectionId);
      }

      // 2) Animation d'apparition
      target.classList.add("is-visible");

      // On peut désobserver si on ne veut animer qu'une fois
      // observer.unobserve(target);
    }
  });
}

function initIntersectionObserver() {
  // Si aucune section et aucun élément .reveal → on ne fait rien
  if (!sections.length && !revealElements.length) return;

  const observerOptions = {
    threshold: 0.2,
    rootMargin: "-80px 0px 0px 0px", // pour compenser le header sticky
  };

  const observer = new IntersectionObserver(
    handleIntersection,
    observerOptions
  );

  // Observer toutes les sections
  sections.forEach((section) => observer.observe(section));

  // Observer aussi les éléments .reveal, si tu en utilises
  revealElements.forEach((el) => observer.observe(el));
}

// =============================
// 7. Init : attacher les events
// =============================

function initScrollFeatures() {
  window.addEventListener("scroll", handleScroll);
  // On force un premier appel pour avoir le bon état dès le chargement
  handleScroll();
}

function initClickEvents() {
  document.addEventListener("click", handleClick);
}

function initKeyboardEvents() {
  document.addEventListener("keydown", handleKeydown);
}

function initFormValidation() {
  if (!form) return;

  form.addEventListener("submit", handleFormSubmit);
  form.addEventListener("input", handleFormInput);
  form.addEventListener("blur", handleFormBlur, true);
}

// =============================
// 8. Focus trap (optionnel pour plus tard)
//    -> prêt pour modales / menus
// =============================

function trapFocus(container) {
  const focusableSelectors =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  const focusable = container.querySelectorAll(focusableSelectors);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  container.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

// =============================
// 9. Initialisation globale
// =============================
import "./dom.js"; // garde toute la logique d’événements globaux de Jour 1
import { ProjectCard } from "./components/project-card.js";
import { render } from "./utils/render.js";
import {
  initStore,
  subscribe,
  getVisibleProjects,
  setFilterTag,
  setSearchQuery,
} from "./store.js";

/**
 * Rend la grille des projets à partir du state global.
 */
function renderProjectsGrid() {
  const container = document.querySelector(".projects__list");
  if (!container) return;

  const projects = getVisibleProjects();

  // On vide la grille avant de rerendre
  container.innerHTML = "";

  if (projects.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("projects__empty");
    empty.textContent =
      "Aucun projet ne correspond à ce filtre pour le moment.";
    container.appendChild(empty);
    return;
  }

  projects.forEach((project) => {
    const card = ProjectCard(project);
    render(container, card); // on pourrait passer { clear: false } mais false par défaut
  });
}

/**
 * Initialise les contrôles de filtres (tags, recherche, etc.).
 * On reste dans un esprit event delegation léger.
 */
function initFilters() {
  // Boutons de filtre par tag, ex: <button data-filter-tag="JavaScript">JavaScript</button>
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-filter-tag]");
    if (!btn) return;

    event.preventDefault();

    const tag = btn.dataset.filterTag;
    const normalizedTag = tag === "all" ? null : tag;

    setFilterTag(normalizedTag);

    // Mise à jour visuelle des boutons actifs
    const allButtons = document.querySelectorAll("[data-filter-tag]");
    allButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
  });

  // Champ de recherche, ex: <input type="search" id="project-search" />
  const searchInput = document.querySelector("#project-search");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const value = event.target.value.trim();
      setSearchQuery(value);
    });
  }
}

function initApp() {
  // 1) Initialiser le store
  initStore();

  // 2) Premier rendu de la grille
  renderProjectsGrid();

  // 3) Abonnement : à chaque changement de state, on rerend
  subscribe(() => {
    renderProjectsGrid();
  });

  // 4) Filtres (tag + search)
  initFilters();
  initScrollFeatures();
  initClickEvents();
  initKeyboardEvents();
  initFormValidation();
  initIntersectionObserver();
}

// On attend que le DOM soit prêt
document.addEventListener("DOMContentLoaded", initApp);
