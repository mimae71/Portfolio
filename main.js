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
function handleIntersection(entries) {
  
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.id;
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
const form = document.querySelector(".js-btn-submit").closest("form")
const formStatus = form.querySelector(".form__status")

form.addEventListener("submit", handleSubmit)

function handleSubmit(e) {
  e.preventDefault()
  formStatus.hidden=false; 
  form.reset()
  // alert("Merci! Votre message a été envoyé")
}


// Gestion du bouton "Afficher plus" dans la section Projets
const btnShowMore = document.getElementById("btn-show-more");
const extraProjects = document.getElementById("extra");

btnShowMore.addEventListener("click", () => {
  // const isExpanded = btnShowMore.getAttribute("aria-expanded") === "true";
  // btnShowMore.setAttribute("aria-expanded", String(!isExpanded));
  // extraProjects.hidden = isExpanded;
  const isOpen = extraProjects.hasAttribute("hidden") === false;
  extraProjects.toggleAttribute("hidden");
  btnShowMore.setAttribute("aria-expanded", String(!isOpen));
  btnShowMore.textContent = isOpen ? "Afficher plus" : "Afficher moins";
});