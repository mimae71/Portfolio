

import { projects as initialProjects } from "./projects-data.js";

// -----------------------------
// État global de l'application
// -----------------------------
let state = {
  projects: initialProjects, // data brute
  filters: {
    tag: null,              // ex: "JavaScript", "React"...
    searchQuery: "",        // pour plus tard
  },
};

// Liste des "abonnés" au store
const listeners = new Set();

/**
 * Permet de récupérer une copie de l'état actuel.
 * On renvoie une shallow copy pour éviter les mutations surprises.
 */
export function getState() {
  return {
    ...state,
    filters: { ...state.filters },
    // projects est un tableau, on peut le copier aussi si tu veux être strict :
    // projects: [...state.projects],
  };
}

/**
 * Met à jour l'état et notifie tous les abonnés.
 * @param {Object|Function} partialOrUpdater - soit un objet partiel, soit une fonction (prevState) => newStatePart.
 */
export function setState(partialOrUpdater) {
  const prevState = getState();

  const partial =
    typeof partialOrUpdater === "function"
      ? partialOrUpdater(prevState)
      : partialOrUpdater;

  // On merge l'état (shallow merge)
  state = {
    ...prevState,
    ...partial,
    filters: {
      ...prevState.filters,
      ...(partial.filters || {}),
    },
  };

  // Notifier les abonnés
  listeners.forEach((listener) => {
    listener(getState());
  });
}

/**
 * S'abonner aux changements de state.
 * @param {Function} listener - callback appelée à chaque setState.
 * @returns {Function} unsubscribe
 */
export function subscribe(listener) {
  listeners.add(listener);

  // On renvoie une fonction pour se désabonner
  return () => {
    listeners.delete(listener);
  };
}

/**
 * (optionnel mais explicite) : initialise le store si tu veux.
 * Ici, il ne fait pas grand-chose, mais il est prêt pour plus tard.
 */
export function initStore() {
  // On pourrait, plus tard, charger des données depuis une API, LocalStorage, etc.
  // Pour l'instant, on considère initialProjects comme source de vérité.
  state = {
    ...state,
    projects: initialProjects,
  };
  return getState();
}

// ==============================
// SELECTEURS & ACTIONS MÉTIER
// ==============================

/**
 * Renvoie la liste des projets filtrés selon l'état (tag, search, etc.).
 */
export function getVisibleProjects() {
  const { projects, filters } = getState();
  const { tag, searchQuery } = filters;

  let filtered = [...projects];

  if (tag) {
    filtered = filtered.filter((project) =>
      (project.tags || []).includes(tag)
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((project) =>
      project.title.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q)
    );
  }

  return filtered;
}

/**
 * Met à jour le filtre "tag" (catégorie / techno).
 */
export function setFilterTag(tag) {
  setState({
    filters: {
      tag,
    },
  });
}

/**
 * Met à jour le filtre "searchQuery".
 */
export function setSearchQuery(query) {
  setState({
    filters: {
      searchQuery: query,
    },
  });
}
