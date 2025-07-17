// Variables globales
let todosLosJuegos = [];
let juegosFiltrados = [];
let todasLasConsolas = [];
let todasLasDesarrolladoras = [];

// Elementos del DOM
const juegosList = document.getElementById("juegosList");
const loadingIndicator = document.getElementById("loadingIndicator");
const noResults = document.getElementById("noResults");
const currentCount = document.getElementById("currentCount");
const toggleFiltersBtn = document.getElementById("toggleFilters");
const filtersContainer = document.getElementById("filtersContainer");

// Elementos del modal
const juegoModal = document.getElementById("juegoModal");
const cerrarModalBtn = document.getElementById("cerrarModal");
const cerrarModal2Btn = document.getElementById("cerrarModal2");

// Filtros
const searchInput = document.getElementById("searchInput");
const consolaFilter = document.getElementById("consolaFilter");
const desarrolladoraFilter = document.getElementById("desarrolladoraFilter");
const generoFilter = document.getElementById("generoFilter");
const clearFiltersBtn = document.getElementById("clearFilters");

// Event listeners
document.addEventListener("DOMContentLoaded", inicializarPagina);
searchInput.addEventListener("input", filtrarJuegos);
consolaFilter.addEventListener("change", filtrarJuegos);
desarrolladoraFilter.addEventListener("change", filtrarJuegos);
generoFilter.addEventListener("change", filtrarJuegos);
clearFiltersBtn.addEventListener("click", limpiarFiltros);
toggleFiltersBtn.addEventListener("click", toggleFiltros);

// Event listeners del modal
cerrarModalBtn.addEventListener("click", cerrarModal);
cerrarModal2Btn.addEventListener("click", cerrarModal);
juegoModal.addEventListener("click", (e) => {
  if (e.target === juegoModal) cerrarModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});

// Función principal de inicialización
async function inicializarPagina() {
  try {
    showLoading();
    await Promise.all([
      cargarJuegos(),
      cargarConsolas(),
      cargarDesarrolladoras(),
    ]);
    poblarFiltros();
    aplicarFiltrosURL(); // Aplicar filtros desde URL si existen
    filtrarJuegos(); // Mostrar todos los juegos inicialmente
    hideLoading();
  } catch (error) {
    console.error("Error al inicializar la página:", error);
    mostrarError("Error al cargar los datos. Por favor, recarga la página.");
    hideLoading();
  }
}

// Funciones de carga de datos
async function cargarJuegos() {
  try {
    const response = await fetch("https://tp-final-intro-software.onrender.com/api/juegos");
    if (!response.ok) throw new Error("Error al obtener juegos");
    todosLosJuegos = await response.json();
    console.log("Juegos cargados:", todosLosJuegos.length);
  } catch (error) {
    console.error("Error cargando juegos:", error);
    throw error;
  }
}

async function cargarConsolas() {
  try {
    const response = await fetch("https://tp-final-intro-software.onrender.com/api/consolas");
    if (!response.ok) throw new Error("Error al obtener consolas");
    todasLasConsolas = await response.json();
    console.log("Consolas cargadas:", todasLasConsolas.length);
  } catch (error) {
    console.error("Error cargando consolas:", error);
    throw error;
  }
}

async function cargarDesarrolladoras() {
  try {
    const response = await fetch("https://tp-final-intro-software.onrender.com/api/desarrolladoras");
    if (!response.ok) throw new Error("Error al obtener desarrolladoras");
    todasLasDesarrolladoras = await response.json();
    console.log("Desarrolladoras cargadas:", todasLasDesarrolladoras.length);
  } catch (error) {
    console.error("Error cargando desarrolladoras:", error);
    throw error;
  }
}

// Función para aplicar filtros desde URL
function aplicarFiltrosURL() {
  const urlParams = new URLSearchParams(window.location.search);

  const genero = urlParams.get("genero");
  const consola = urlParams.get("consola");
  const desarrolladora = urlParams.get("desarrolladora");
  const busqueda = urlParams.get("busqueda");

  if (genero) {
    generoFilter.value = genero;
  }
  if (consola) {
    consolaFilter.value = consola;
  }
  if (desarrolladora) {
    desarrolladoraFilter.value = desarrolladora;
  }
  if (busqueda) {
    searchInput.value = busqueda;
  }
}
// Función para poblar los filtros
function poblarFiltros() {
  // Poblar filtro de consolas
  consolaFilter.innerHTML = '<option value="">Todas las consolas</option>';
  todasLasConsolas.forEach((consola) => {
    const option = document.createElement("option");
    option.value = consola.id;
    option.textContent = consola.nombre || consola.Nombre;
    consolaFilter.appendChild(option);
  });

  // Poblar filtro de desarrolladoras
  desarrolladoraFilter.innerHTML =
    '<option value="">Todas las desarrolladoras</option>';
  todasLasDesarrolladoras.forEach((dev) => {
    const option = document.createElement("option");
    option.value = dev.id;
    option.textContent = dev.nombre || dev.Nombre;
    desarrolladoraFilter.appendChild(option);
  });

  // Poblar filtro de géneros dinámicamente desde los juegos
  const generosUnicos = [...new Set(todosLosJuegos.map(juego => juego.genero || juego.Genero).filter(genero => genero))];
  generoFilter.innerHTML = '<option value="">Todos los géneros</option>';
  generosUnicos.sort().forEach((genero) => {
    const option = document.createElement("option");
    option.value = genero;
    option.textContent = genero;
    generoFilter.appendChild(option);
  });
}

// Función principal de filtrado
function filtrarJuegos() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const consolaId = consolaFilter.value;
  const desarrolladoraId = desarrolladoraFilter.value;
  const genero = generoFilter.value;

  juegosFiltrados = todosLosJuegos.filter((juego) => {
    // Filtro por nombre
    const nombreCoincide =
      !searchTerm ||
      (juego.nombre || juego.Nombre || "").toLowerCase().includes(searchTerm);

    // Filtro por desarrolladora
    const desarrolladoraCoincide =
      !desarrolladoraId ||
      (juego.desarrolladora || juego.Desarrolladora) == desarrolladoraId;

    // Filtro por género
    const generoCoincide = !genero || (juego.genero || juego.Genero) === genero;

    // Filtro por consola (más complejo porque es una relación many-to-many)
    let consolaCoincide = !consolaId;
    if (consolaId && juego.consolas) {
      // Si el juego tiene un array de consolas
      if (Array.isArray(juego.consolas)) {
        consolaCoincide = juego.consolas.some(
          (consola) => (consola.id || consola) == consolaId
        );
      } else {
        // Si es un string o ID simple
        consolaCoincide = juego.consolas == consolaId;
      }
    }

    return (
      nombreCoincide &&
      desarrolladoraCoincide &&
      generoCoincide &&
      consolaCoincide
    );
  });

  mostrarJuegos();
  actualizarContador();
}

// Función para mostrar los juegos
function mostrarJuegos() {
  if (juegosFiltrados.length === 0) {
    juegosList.style.display = "none";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  juegosList.style.display = "grid";
  juegosList.classList.add("grid"); // Agregar la clase grid cuando se muestra

  juegosList.innerHTML = "";

  juegosFiltrados.forEach((juego) => {
    const juegoCard = crearTarjetaJuego(juego);
    juegosList.appendChild(juegoCard);
  });
}

// Función para crear una tarjeta de juego
function crearTarjetaJuego(juego) {
  const card = document.createElement("div");
  card.className =
    "bg-[#181612]/80 backdrop-blur-md rounded-2xl border border-[#23201c] shadow-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:border-yellow-400 cursor-pointer";

  // Agregar evento click para abrir modal
  card.addEventListener("click", () => mostrarDetallesJuego(juego));

  // Obtener información de la desarrolladora
  const desarrolladora = todasLasDesarrolladoras.find(
    (dev) => dev.id === (juego.desarrolladora || juego.Desarrolladora)
  );

  // Obtener información de las consolas
  let consolasTexto = "No disponible";
  if (juego.consolas && Array.isArray(juego.consolas)) {
    consolasTexto = juego.consolas
      .map((consola) => consola.nombre || consola.Nombre || consola)
      .join(", ");
  }

  card.innerHTML = `
        <div class="relative">
            <img 
                src="${
                  juego.url_imagen ||
                  juego.URL_IMAGEN ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }" 
                alt="${juego.nombre || juego.Nombre}"
                class="w-full h-48 object-cover"
                onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
            >
            <div class="absolute top-2 right-2 bg-black/80 text-yellow-400 px-2 py-1 rounded text-sm font-pixel">
                ${juego.anio || juego.Anio || "N/A"}
            </div>
            <div class="absolute bottom-2 right-2 bg-blue-600/80 text-white px-2 py-1 rounded text-xs font-pixel">
                Click para ver detalles
            </div>
        </div>
        
        <div class="p-4">
            <h3 class="text-xl font-pixel font-bold text-yellow-400 mb-2 truncate">
                ${juego.nombre || juego.Nombre}
            </h3>
            
            <div class="space-y-2 text-sm">
                <div class="flex items-center">
                    <span class="text-green-400 font-pixel w-20">Género:</span>
                    <span class="text-gray-300 font-pixel">${
                      juego.genero || juego.Genero || "N/A"
                    }</span>
                </div>
                
                <div class="flex items-center">
                    <span class="text-green-400 font-pixel w-20">Dev:</span>
                    <span class="text-gray-300 font-pixel truncate">${
                      desarrolladora
                        ? desarrolladora.nombre || desarrolladora.Nombre
                        : "N/A"
                    }</span>
                </div>
                
                <div class="flex items-start">
                    <span class="text-green-400 font-pixel w-20 mt-1">Consolas:</span>
                    <span class="text-gray-300 font-pixel text-xs leading-tight">${consolasTexto}</span>
                </div>
            </div>
        </div>
    `;

  return card;
}

// Función para actualizar el contador de resultados
function actualizarContador() {
  currentCount.textContent = juegosFiltrados.length;
}

// Función para limpiar todos los filtros
function limpiarFiltros() {
  searchInput.value = "";
  consolaFilter.value = "";
  desarrolladoraFilter.value = "";
  generoFilter.value = "";
  filtrarJuegos();
}

// Función para toggle de filtros en móvil
function toggleFiltros() {
  const isHidden = filtersContainer.classList.contains("hidden");

  if (isHidden) {
    filtersContainer.classList.remove("hidden");
    filtersContainer.classList.add("block");
    toggleFiltersBtn.textContent = "OCULTAR FILTROS";
    toggleFiltersBtn.classList.remove(
      "bg-green-600",
      "hover:bg-green-700",
      "border-green-500"
    );
    toggleFiltersBtn.classList.add(
      "bg-red-600",
      "hover:bg-red-700",
      "border-red-500"
    );
  } else {
    filtersContainer.classList.remove("block");
    filtersContainer.classList.add("hidden");
    toggleFiltersBtn.textContent = "MOSTRAR FILTROS";
    toggleFiltersBtn.classList.remove(
      "bg-red-600",
      "hover:bg-red-700",
      "border-red-500"
    );
    toggleFiltersBtn.classList.add(
      "bg-green-600",
      "hover:bg-green-700",
      "border-green-500"
    );
  }
}

// Funciones del modal
function mostrarDetallesJuego(juego) {
  // Obtener información de la desarrolladora
  const desarrolladora = todasLasDesarrolladoras.find(
    (dev) => dev.id === (juego.desarrolladora || juego.Desarrolladora)
  );

  // Llenar la información básica
  document.getElementById("modalTitulo").textContent =
    juego.nombre || juego.Nombre || "Sin título";
  document.getElementById("modalImagen").src =
    juego.url_imagen ||
    juego.URL_IMAGEN ||
    "https://via.placeholder.com/400x300?text=No+Image";
  document.getElementById("modalImagen").alt =
    juego.nombre || juego.Nombre || "";
  document.getElementById("modalAnio").textContent =
    juego.anio || juego.Anio || "No disponible";
  document.getElementById("modalGenero").textContent =
    juego.genero || juego.Genero || "No disponible";
  document.getElementById("modalDescripcion").textContent =
    juego.descripcion || juego.Descripcion || "No hay descripción disponible";

  // Llenar información de la desarrolladora
  if (desarrolladora) {
    document.getElementById("modalDesarrolladoraNombre").textContent =
      desarrolladora.nombre || desarrolladora.Nombre || "No disponible";
    document.getElementById("modalDesarrolladoraFundacion").textContent =
      desarrolladora.fundacion || desarrolladora.Fundacion || "No disponible";
    document.getElementById("modalDesarrolladoraPais").textContent =
      desarrolladora.pais || desarrolladora.Pais || "No disponible";
  } else {
    document.getElementById("modalDesarrolladoraNombre").textContent =
      "No disponible";
    document.getElementById("modalDesarrolladoraFundacion").textContent =
      "No disponible";
    document.getElementById("modalDesarrolladoraPais").textContent =
      "No disponible";
  }

  // Llenar las consolas
  const consolasContainer = document.getElementById("modalConsolas");
  consolasContainer.innerHTML = "";

  if (
    juego.consolas &&
    Array.isArray(juego.consolas) &&
    juego.consolas.length > 0
  ) {
    juego.consolas.forEach((consola) => {
      // Buscar información completa de la consola
      const consolaCompleta = todasLasConsolas.find(
        (c) =>
          c.id === (consola.id || consola) ||
          (c.nombre || c.Nombre) ===
            (consola.nombre || consola.Nombre || consola)
      );

      const consolaElement = document.createElement("div");
      consolaElement.className =
        "bg-black/50 p-3 rounded border border-gray-600 text-center cursor-pointer hover:bg-gray-700/50 hover:border-yellow-400 transition-all duration-200 transform hover:scale-105";

      // Agregar evento click para filtrar por esta consola
      consolaElement.addEventListener("click", () => {
        // Cerrar el modal
        cerrarModal();

        // Aplicar filtro de consola
        const consolaId = consola.id || consolaCompleta?.id;
        if (consolaId) {
          consolaFilter.value = consolaId;
          filtrarJuegos();

          // Scroll suave hacia arriba para ver los resultados
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });

      consolaElement.innerHTML = `
                <div class="text-white font-pixel text-sm font-bold">
                    ${consola.nombre || consola.Nombre || consola}
                </div>
                ${
                  consolaCompleta
                    ? `
                    <div class="text-xs text-gray-400 font-pixel mt-1">
                        ${consolaCompleta.anio || consolaCompleta.Anio || ""}
                    </div>
                `
                    : ""
                }
                <div class="text-xs text-blue-400 font-pixel mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click para filtrar
                </div>
            `;

      // Agregar clases para el efecto hover del texto
      consolaElement.classList.add("group");

      consolasContainer.appendChild(consolaElement);
    });
  } else {
    const noConsolasElement = document.createElement("div");
    noConsolasElement.className =
      "col-span-2 bg-black/50 p-3 rounded border border-gray-600 text-center";
    noConsolasElement.innerHTML = `
            <div class="text-gray-400 font-pixel text-sm">
                No hay información de consolas disponible
            </div>
        `;
    consolasContainer.appendChild(noConsolasElement);
  }

  // Mostrar el modal
  juegoModal.classList.remove("hidden");
  juegoModal.classList.add("flex");
  document.body.style.overflow = "hidden"; // Prevenir scroll del body
}

function cerrarModal() {
  juegoModal.classList.add("hidden");
  juegoModal.classList.remove("flex");
  document.body.style.overflow = "auto"; // Restaurar scroll del body
}

// Funciones de utilidad para loading y errores
function showLoading() {
  loadingIndicator.style.display = "block";
  juegosList.style.display = "none";
  noResults.style.display = "none";
}

function hideLoading() {
  loadingIndicator.style.display = "none";
}

function mostrarError(mensaje) {
  noResults.style.display = "block";
  noResults.innerHTML = `
        <div class="bg-red-900/80 backdrop-blur-md rounded-2xl p-8 border border-red-700 inline-block">
            <p class="text-2xl font-pixel text-red-400 mb-4">Error</p>
            <p class="text-gray-300 font-pixel">${mensaje}</p>
        </div>
    `;
}

// Función para depuración
function debugInfo() {
  console.log("Total juegos:", todosLosJuegos.length);
  console.log("Juegos filtrados:", juegosFiltrados.length);
  console.log("Consolas:", todasLasConsolas.length);
  console.log("Desarrolladoras:", todasLasDesarrolladoras.length);
}

// Exportar función de debug para uso en consola
window.debugJuegos = debugInfo;
