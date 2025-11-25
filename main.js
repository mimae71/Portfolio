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


// Gestion du formulaire de contact
const form = document.querySelector(".contact__form");
const formStatus = document.querySelector("#form-status");

// Récupération des champs
const inputNom = document.querySelector("#nom");
const inputEmail = document.querySelector("#email");
const inputMessage = document.querySelector("#message");

// Récupération des zones d'erreur
const errorNom = document.querySelector("#nom-error");
const errorEmail = document.querySelector("#email-error");
const errorMessage = document.querySelector("#message-error");

form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();

  // On reset les erreurs avant de revérifier
  clearErrors();

  let isValid = true;
  let firstInvalidField = null;

  // --- Validation Nom ---
  if (!inputNom.value.trim()) {
    showError(inputNom, errorNom, "Le nom est requis.");
    isValid = false;
    firstInvalidField ??= inputNom;
  } else if (inputNom.value.trim().length < 2) {
    showError(inputNom, errorNom, "Le nom doit contenir au moins 2 caractères.");
    isValid = false;
    firstInvalidField ??= inputNom;
  }

  // --- Validation Email ---
  if (!inputEmail.value.trim()) {
    showError(inputEmail, errorEmail, "L’e-mail est requis.");
    isValid = false;
    firstInvalidField ??= inputEmail;
  } else if (!isValidEmail(inputEmail.value.trim())) {
    showError(inputEmail, errorEmail, "Veuillez saisir une adresse e-mail valide.");
    isValid = false;
    firstInvalidField ??= inputEmail;
  }

  // --- Validation Message ---
  if (!inputMessage.value.trim()) {
    showError(inputMessage, errorMessage, "Le message est requis.");
    isValid = false;
    firstInvalidField ??= inputMessage;
  } else if (inputMessage.value.trim().length < 10) {
    showError(
      inputMessage,
      errorMessage,
      "Votre message doit contenir au moins 10 caractères."
    );
    isValid = false;
    firstInvalidField ??= inputMessage;
  }

  if (!isValid) {
    // Focus sur le premier champ en erreur (clavier + SR)
    firstInvalidField.focus();
    formStatus.textContent = ""; // pas de message global si erreurs
    return;
  }

  // Si tout est valide : message de succès
  formStatus.textContent =
    "Message envoyé ✅ Merci pour votre contact.";
  formStatus.setAttribute("tabindex", "-1");
  formStatus.focus();

  form.reset();
}

// --- Fonctions utilitaires ---

function clearErrors() {
  // On enlève aria-invalid et on vide les messages d'erreur
  [inputNom, inputEmail, inputMessage].forEach((field) => {
    field.removeAttribute("aria-invalid");
  });

  [errorNom, errorEmail, errorMessage].forEach((el) => {
    el.textContent = "";
  });
}

function showError(field, errorElement, message) {
  field.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
}

function isValidEmail(value) {
  // Regex simple mais suffisante pour un formulaire classique
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
