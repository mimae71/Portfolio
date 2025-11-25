// Sélectionner des éléments

const navLinks = document.querySelectorAll(".nav__link");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const sections = document.querySelectorAll("section");

// Afficher ou masquer le bouton de défilement vers le haut en fonction de la position de défilement

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
    
    } else {    
    scrollTopBtn.classList.remove("show");
    }
});

// scroll vers le haut
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
// Défilment fluide pour les ancres
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});





// --- Fonction : mise à jour de l'état du lien actif ---
function updateActiveLink(visibleSectionId) {
  navLinks.forEach(link => {
    const targetId = link.getAttribute("href").slice(1); // enlève le '#'
    const isActive = targetId === visibleSectionId;

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
    link.classList.toggle("nav__link-active", isActive);
  });
}

// --- Fonction : callback de l'observateur ---
const navAnnouncer = document.getElementById("nav-announcer");

function handleIntersection(entries) {
  
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.id;

      navAnnouncer.textContent = `Section ${sectionId} affichée`;

      updateActiveLink(sectionId);
    }
  });
}

// --- Création de l'observateur ---
const observerOptions = {
  threshold: 0.6, // section visible à 60%
  rootMargin: "-80px 0px 0px 0px" // ajustement pour le décalage du header
};

const observer = new IntersectionObserver(handleIntersection, observerOptions);

// --- Activation de l'observation pour chaque section ---
sections.forEach(section => observer.observe(section));


// --- Récupération du formulaire et champ statut ---
const form = document.querySelector(".contact__form");
const formStatus = document.querySelector("#form-status");
const formGlobalError = document.querySelector("#form-global-error");

// --- Récupération des champs ---
const fields = {
  nom: {
    el: document.querySelector("#nom"),
    error: document.querySelector("#nom-error"),
    validate: (value) => {
      if (!value) return "Le nom est requis.";
      if (value.length < 2) return "Le nom doit contenir au moins 2 caractères.";
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

// --- Validation EN TEMPS RÉEL ---
Object.values(fields).forEach(({ el }) => {
  el.addEventListener("input", () => validateField(el));
  el.addEventListener("blur", () => validateField(el));
});

// --- Soumission du formulaire ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  clearGlobalMessage();
  let firstInvalid = null;
  let hasError = false;

  Object.values(fields).forEach(({ el }) => {
    const invalid = validateField(el);
    if (invalid && !firstInvalid) firstInvalid = el;
    if (invalid) hasError = true;
  });

  if (hasError) {
    showGlobalError("Le formulaire contient des erreurs, veuillez vérifier les champs en rouge.");
    firstInvalid.focus();
    return;
  }

  // Si tout est bon →
  formStatus.textContent = "Message envoyé ✅ Merci pour votre contact.";
  formStatus.setAttribute("tabindex", "-1");
  formStatus.focus();
  form.reset();
});

// --- Valide un champ et met à jour les messages/états ---
function validateField(field) {
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

// --- Message global ---
function showGlobalError(msg) {
  formGlobalError.hidden = false;
  formGlobalError.textContent = msg;
}

function clearGlobalMessage() {
  formGlobalError.hidden = true;
  formGlobalError.textContent = "";
}




// Gestion du bouton "Afficher plus" dans la section Projets
const btnShowMore = document.getElementById("btn-show-more");
const extraWrapper = document.getElementById("extra-wrapper");
const announcer = document.getElementById("projects-announcer");

btnShowMore.addEventListener("click", () => {
  const isOpen = !extraWrapper.hasAttribute("hidden");

  // Toggle de l'affichage
  extraWrapper.toggleAttribute("hidden");

  // Mise à jour ARIA
  btnShowMore.setAttribute("aria-expanded", String(!isOpen));

  // Texte du bouton
  btnShowMore.textContent = isOpen ? "Afficher plus" : "Afficher moins";

  // Annonce pour lecteur d’écran
  announcer.textContent = isOpen
    ? "Projet masqué"
    : "Nouveau projet affiché";
});
