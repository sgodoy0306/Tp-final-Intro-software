document.addEventListener("scroll", function onScroll() {
  const startSection = document.getElementById("start-section");
  const logoContainer = document.getElementById("logo-section");
  if (window.scrollY > 10) {
    startSection.style.opacity = "0";
    logoContainer.style.opacity = "1";
    logoContainer.classList.remove("pointer-events-none");
  } else {
    startSection.style.opacity = "1";
    logoContainer.style.opacity = "1"; // Mostrar el logo al hacer scroll arriba
    logoContainer.classList.remove("pointer-events-none");
  }
});
window.addEventListener("scroll", function () {
  const section = document.getElementById("welcome-section");
  if (window.scrollY > 50) {
    section.classList.remove("opacity-0", "pointer-events-none");
    section.classList.add("opacity-100");
  } else {
    section.classList.add("opacity-0", "pointer-events-none");
    section.classList.remove("opacity-100");
  }
});
function removeCatalogDelays() {
  const items = document.querySelectorAll(".catalog-item");
  items.forEach((item) => {
    item.classList.remove("delay-0", "delay-150", "delay-300", "delay-500");
  });
}
// Llama a esta función después de la animación inicial
document.addEventListener("DOMContentLoaded", () => {
  let animated = false;
  const catalogSection = document.querySelector("#catalog-container");
  if ("IntersectionObserver" in window && catalogSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            setTimeout(removeCatalogDelays, 1000); // Ajusta el tiempo si es necesario
            animated = true;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(catalogSection);
  } else {
    setTimeout(removeCatalogDelays, 1000);
  }
});
// Animación de entrada para los items del catálogo cuando se visualiza el catálogo
function animateCatalogItems() {
  const items = document.querySelectorAll(".catalog-item");
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.remove("opacity-0", "-translate-x-16");
      item.classList.add("opacity-100", "translate-x-0");
    }, i * 150);
  });

  // Animar el botón "CATÁLOGO"
  const catalogButton = document.querySelector(".catalog-button");
  if (catalogButton) {
    setTimeout(() => {
      catalogButton.classList.remove("opacity-0", "translate-y-8");
      catalogButton.classList.add("opacity-100", "translate-y-0");
    }, items.length * 150);
  }
}

// Usar Intersection Observer para detectar cuando el catálogo es visible
document.addEventListener("DOMContentLoaded", () => {
  // Las clases iniciales ya están en el HTML para catalog-button

  const catalogSection = document.querySelector("#catalog-container");
  let animated = false;
  if ("IntersectionObserver" in window && catalogSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animateCatalogItems();
            animated = true;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(catalogSection);
  } else {
    // Fallback: animar inmediatamente si no hay soporte
    animateCatalogItems();
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, i * 90); // efecto escalonado
        }
      });
    },
    { threshold: 0.2 }
  );

  document
    .querySelectorAll(".diagonal-genre")
    .forEach((el) => observer.observe(el));
});
