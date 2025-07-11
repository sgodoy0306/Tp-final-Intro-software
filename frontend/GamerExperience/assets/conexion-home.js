//-------------------------- SECCION AGREGAR LOS BOTONES DE CONSOLAS EN LA PAGINA PRINCIPAL -------------------
document.addEventListener("DOMContentLoaded", async () => {
  const platformsContainer = document.getElementById("platforms-buttons");
  if (!platformsContainer) return;

  try {
    const response = await fetch("http://localhost:3000/api/consolas");
    const consolas = await response.json();

    consolas.forEach((consola) => {
      const a = document.createElement("a");
      a.href = `./juegos.html?consola=${consola.id}`;
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
