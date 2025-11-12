// Sélectionner des éléments

const navLinks = document.querySelectorAll(".nav-link");
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Afficher ou masquer le bouton de défilement vers le haut en fonction de la position de défilement

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
    console.log("scroll");
    
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
    console.log(target);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
