// ---------------------SECCION PARA ELIMINAR JUEGOS--------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  const API = "http://localhost:8000/api";
  const infoJuegoEliminar = document.getElementById("info-juego-eliminar");
  const mensaje = document.getElementById("mensaje");
  const juegoSelector = document.getElementById("juego-selector");
  const juegosLista = document.getElementById("juegos-lista");
  const btnEliminar = document.getElementById("btn-eliminar");
  const confirmacionEliminar = document.getElementById("confirmacion-eliminar");
  const checkboxConfirmar = document.getElementById("confirmar-eliminacion");
  let juegoSeleccionado = null;
  let juegosData = [];
  let desarrolladorasData = [];

  // Solo ejecutar si estamos en la página de eliminar juegos
  if (
    !infoJuegoEliminar ||
    !mensaje ||
    !juegoSelector ||
    !juegosLista ||
    !btnEliminar ||
    !checkboxConfirmar
  )
    return;

  // Función para cargar todos los juegos
  async function cargarJuegos() {
    try {
      console.log("Cargando juegos...");
      const response = await fetch(`${API}/juegos`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      juegosData = await response.json();
      console.log("Juegos cargados:", juegosData);
    } catch (error) {
      console.error("Error al cargar juegos:", error);
      mensaje.textContent = `Error al cargar juegos: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
    }
  }

  // Función para cargar todas las desarrolladoras
  async function cargarDesarrolladoras() {
    try {
      console.log("Cargando desarrolladoras...");
      const response = await fetch(`${API}/desarrolladoras`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      desarrolladorasData = await response.json();
      console.log("Desarrolladoras cargadas:", desarrolladorasData);
    } catch (error) {
      console.error("Error al cargar desarrolladoras:", error);
      mensaje.textContent = `Error al cargar desarrolladoras: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
    }
  }

  // Función para obtener el nombre de la desarrolladora por ID
  function obtenerNombreDesarrolladora(desarrolladoraId) {
    if (!desarrolladoraId || !desarrolladorasData.length)
      return "Sin desarrolladora";

    const desarrolladora = desarrolladorasData.find(
      (dev) => dev.id === desarrolladoraId
    );
    return desarrolladora ? desarrolladora.nombre : "Sin desarrolladora";
  }

  // Función para filtrar y mostrar juegos
  function filtrarJuegos(termino) {
    const terminoLower = termino.toLowerCase();

    // Filtrar juegos que contengan el término
    const juegosFiltrados = juegosData.filter((juego) =>
      juego.nombre.toLowerCase().includes(terminoLower)
    );

    // Ordenar por relevancia
    juegosFiltrados.sort((a, b) => {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();

      // Prioridad 1: Coincidencia exacta
      if (nombreA === terminoLower && nombreB !== terminoLower) return -1;
      if (nombreB === terminoLower && nombreA !== terminoLower) return 1;

      // Prioridad 2: Empieza con el término
      const empiezaA = nombreA.startsWith(terminoLower);
      const empiezaB = nombreB.startsWith(terminoLower);

      if (empiezaA && !empiezaB) return -1;
      if (empiezaB && !empiezaA) return 1;

      // Prioridad 3: Posición del término (más cerca del inicio es mejor)
      const posicionA = nombreA.indexOf(terminoLower);
      const posicionB = nombreB.indexOf(terminoLower);

      if (posicionA !== posicionB) return posicionA - posicionB;

      // Prioridad 4: Longitud del nombre (más corto es mejor para coincidencias similares)
      return nombreA.length - nombreB.length;
    });

    // Limitar resultados a 10 para mejorar rendimiento
    const resultadosLimitados = juegosFiltrados.slice(0, 10);

    mostrarListaJuegos(resultadosLimitados, juegosFiltrados.length);
  }

  // Función para mostrar la lista de juegos
  function mostrarListaJuegos(juegos, totalResultados = null) {
    juegosLista.innerHTML = "";

    if (juegos.length === 0) {
      const div = document.createElement("div");
      div.className = "p-3 text-center text-gray-400 text-sm";
      div.textContent = "No se encontraron juegos";
      juegosLista.appendChild(div);
      juegosLista.classList.remove("hidden");
      return;
    }

    // Mostrar información de resultados si hay más de los que se muestran
    if (totalResultados && totalResultados > juegos.length) {
      const infoDiv = document.createElement("div");
      infoDiv.className =
        "p-2 text-center text-amber-300 text-xs border-b border-[#333] mb-2";
      infoDiv.textContent = `Mostrando ${juegos.length} de ${totalResultados} resultados`;
      juegosLista.appendChild(infoDiv);
    }

    const termino = juegoSelector.value.trim();

    juegos.forEach((juego) => {
      const div = document.createElement("div");
      div.className =
        "p-3 bg-[#232222] rounded border border-[#333] cursor-pointer hover:bg-[#2a2929] transition";

      // Resaltar el término buscado en el nombre
      let nombreConResaltado = juego.nombre;
      if (termino.length > 0) {
        const regex = new RegExp(`(${termino})`, "gi");
        nombreConResaltado = juego.nombre.replace(
          regex,
          '<span class="bg-red-500 text-white px-1 rounded">$1</span>'
        );
      }

      div.innerHTML = `
                <div class="font-bold text-amber-50">${nombreConResaltado}</div>
                <div class="text-sm text-amber-300">${juego.anio} - ${
        juego.genero
      }</div>
                <div class="text-xs text-gray-400">${
                  juego.desarrolladora_nombre || "Sin desarrolladora"
                }</div>
            `;

      div.addEventListener("click", () => seleccionarJuego(juego));
      juegosLista.appendChild(div);
    });

    juegosLista.classList.remove("hidden");
  }

  // Función para seleccionar un juego
  async function seleccionarJuego(juego) {
    juegoSeleccionado = juego;
    juegoSelector.value = juego.nombre;
    juegosLista.classList.add("hidden");

    // Habilitar sección de información
    infoJuegoEliminar.classList.remove("opacity-50", "pointer-events-none");

    // Mostrar confirmación de eliminación
    confirmacionEliminar.classList.remove("hidden");

    // Resetear checkbox
    checkboxConfirmar.checked = false;
    btnEliminar.disabled = true;

    // Cargar datos del juego
    await cargarDatosJuego(juego);
  }

  // Función para cargar datos del juego en la información
  async function cargarDatosJuego(juego) {
    try {
      // Obtener datos completos del juego
      const response = await fetch(`${API}/juegos/${juego.id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const juegoCompleto = await response.json();
      console.log("Datos completos del juego:", juegoCompleto);

      // Mostrar información del juego
      document.getElementById("info-nombre").textContent =
        juegoCompleto.nombre || "-";
      document.getElementById("info-anio").textContent =
        juegoCompleto.anio || "-";
      document.getElementById("info-desarrolladora").textContent =
        obtenerNombreDesarrolladora(juegoCompleto.desarrolladora);
      document.getElementById("info-genero").textContent =
        juegoCompleto.genero || "-";
      document.getElementById("info-descripcion").textContent =
        juegoCompleto.descripcion || "-";

      // Mostrar consolas
      if (juegoCompleto.consolas && Array.isArray(juegoCompleto.consolas)) {
        const consolasNombres = juegoCompleto.consolas.map(
          (consola) => consola.nombre
        );
        document.getElementById("info-consolas").textContent =
          consolasNombres.join(", ") || "-";
      } else {
        document.getElementById("info-consolas").textContent = "-";
      }

      // Mostrar portada
      const portadaImg = document.getElementById("info-portada");
      if (juegoCompleto.url_imagen) {
        portadaImg.src = juegoCompleto.url_imagen;
        portadaImg.classList.remove("hidden");
      } else {
        portadaImg.classList.add("hidden");
      }
    } catch (error) {
      console.error("Error al cargar datos del juego:", error);
      mensaje.textContent = `Error al cargar datos del juego: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
    }
  }

  // Función para eliminar juego
  async function eliminarJuego(juegoId) {
    try {
      console.log("Eliminando juego con ID:", juegoId);

      const response = await fetch(`${API}/juegos/${juegoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error("Error detallado del servidor:", errorData);
        } catch (jsonError) {
          try {
            const textError = await response.text();
            errorMessage = textError || errorMessage;
            console.error("Error como texto:", textError);
          } catch (textError) {
            // Usar mensaje por defecto
          }
        }
        throw new Error(errorMessage);
      }

      const resultado = await response.json();
      console.log("Juego eliminado exitosamente:", resultado);
      return resultado;
    } catch (error) {
      console.error("Error eliminando juego:", error);
      throw error;
    }
  }

  // Función para limpiar estado inicial
  function limpiarEstadoInicial() {
    // Limpiar el input de búsqueda
    juegoSelector.value = "";

    // Limpiar selección de juego
    juegoSeleccionado = null;

    // Ocultar lista de juegos
    juegosLista.classList.add("hidden");

    // Desabilitar sección de información
    infoJuegoEliminar.classList.add("opacity-50", "pointer-events-none");

    // Ocultar confirmación de eliminación
    confirmacionEliminar.classList.add("hidden");

    // Resetear checkbox
    checkboxConfirmar.checked = false;
    btnEliminar.disabled = true;

    // Limpiar información del juego
    document.getElementById("info-nombre").textContent = "-";
    document.getElementById("info-anio").textContent = "-";
    document.getElementById("info-desarrolladora").textContent = "-";
    document.getElementById("info-genero").textContent = "-";
    document.getElementById("info-descripcion").textContent = "-";
    document.getElementById("info-consolas").textContent = "-";
    document.getElementById("info-portada").classList.add("hidden");

    // Limpiar mensaje
    mensaje.textContent = "";
    mensaje.className = "font-pixel text-center mt-4";
  }

  // Event listener para el checkbox de confirmación
  checkboxConfirmar.addEventListener("change", function () {
    btnEliminar.disabled = !this.checked;
  });

  // Event listener para el botón de eliminar
  btnEliminar.addEventListener("click", async function () {
    if (!juegoSeleccionado) {
      mensaje.textContent = "Por favor, selecciona un juego para eliminar";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (!checkboxConfirmar.checked) {
      mensaje.textContent = "Por favor, confirma que quieres eliminar el juego";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    try {
      // Mostrar mensaje de carga
      mensaje.textContent = "Eliminando juego...";
      mensaje.className = "font-pixel text-center mt-4 text-yellow-500";

      // Eliminar el juego
      const resultado = await eliminarJuego(juegoSeleccionado.id);

      // Mostrar mensaje de éxito
      mensaje.textContent = "Juego eliminado exitosamente!";
      mensaje.className = "font-pixel text-center mt-4 text-green-500";

      // Limpiar estado después de eliminar
      limpiarEstadoInicial();

      // Recargar lista de juegos
      await cargarJuegos();

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        mensaje.textContent = "";
        mensaje.className = "font-pixel text-center mt-4";
      }, 3000);
    } catch (error) {
      mensaje.textContent = "Error al eliminar el juego: " + error.message;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
    }
  });

  // Event listener para el buscador de juegos
  juegoSelector.addEventListener("input", function (e) {
    const termino = e.target.value.trim();

    if (termino.length >= 1) {
      filtrarJuegos(termino);
    } else {
      juegosLista.classList.add("hidden");
    }

    // Si se borra el contenido, limpiar selección
    if (termino === "") {
      limpiarEstadoInicial();
    }
  });

  // Cerrar lista al hacer clic fuera
  document.addEventListener("click", function (e) {
    if (!juegoSelector.contains(e.target) && !juegosLista.contains(e.target)) {
      juegosLista.classList.add("hidden");
    }
  });

  // Inicializar estado
  limpiarEstadoInicial();

  // Cargar datos iniciales
  (async () => {
    await cargarDesarrolladoras();
    await cargarJuegos();
  })();
});
