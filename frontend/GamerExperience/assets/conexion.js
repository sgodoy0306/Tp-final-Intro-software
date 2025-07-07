// Esta seccion agrega los botones de la pagina principal en el menu de consolas y catalogo
document.addEventListener("DOMContentLoaded", async () => {
  const platformsContainer = document.getElementById("platforms-buttons");
  if (!platformsContainer) return;

  try {
    const response = await fetch("http://localhost:3000/api/consolas");
    const consolas = await response.json();

    consolas.forEach((consola) => {
      const a = document.createElement("a");
      a.href = "#";
      a.className =
        "flex-1 min-w-36 max-w-xs w-full h-24 sm:h-32 bg-black rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#444,0_8px_0_0_#000] border-2 border-gray-400 hover:border-green-400 active:shadow-none active:translate-y-1 transition-all duration-150 cursor-pointer select-none relative overflow-hidden opacity-0 -translate-x-16 delay-0 catalog-item hover:flex-2 hover:delay-0 hover:duration-200";
      a.innerHTML = `
                <img src="${consola.url_imagen || consola.URL_IMAGEN}" alt="${
        consola.nombre || consola.Nombre
      }" class="object-contain h-16 sm:h-20">
            `;
      platformsContainer.appendChild(a);
    });
  } catch (error) {
    platformsContainer.innerHTML =
      "<p class='text-red-500'>No se pudieron cargar las consolas.</p>";
  }
});

// esta seccion es para la seccion admin de las consolas, es la que agrega consolas nuevas

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const formData = {
      nombre: document.getElementById("platform-name").value,
      año: parseInt(document.getElementById("platform-year").value),
      descripcion: document.getElementById("platform-desc").value,
      compañia: document.getElementById("company-name").value,
      formato: document.getElementById("platform-year").value, // Se usa el año como formato
      url_imagen: document.getElementById("platform-logo").value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/consolas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Consola guardada exitosamente!");
        form.reset(); // Limpiar el formulario
      } else {
        const error = await response.json();
        alert(
          "Error al guardar la consola: " + (error.error || "Error desconocido")
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Error de conexión. Asegúrate de que el servidor esté ejecutándose."
      );
    }
  });
});
