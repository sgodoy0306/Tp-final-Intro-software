// ---------------------SECCION PARA EDITAR JUEGOS--------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  const API = "http://localhost:8000/api";
  const form = document.getElementById("form-editar");
  const mensaje = document.getElementById("mensaje");
  const juegoSelector = document.getElementById("juego-selector");
  const juegosLista = document.getElementById("juegos-lista");
  let juegoSeleccionado = null;
  let juegosData = [];

  // Solo ejecutar si estamos en la página de editar juegos
  if (!form || !mensaje || !juegoSelector || !juegosLista) return;

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
      return juegosData;
    } catch (error) {
      console.error("Error al cargar juegos:", error);
      mensaje.textContent = `Error al cargar juegos: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      throw error;
    }
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
          '<span class="bg-amber-500 text-[#131212] px-1 rounded">$1</span>'
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

    // Habilitar formulario
    form.classList.remove("opacity-50", "pointer-events-none");

    // Cargar datos del juego en el formulario
    await cargarDatosJuego(juego);
  }

  // Función para cargar datos del juego en el formulario
  async function cargarDatosJuego(juego) {
    try {
      // Obtener datos completos del juego
      const response = await fetch(`${API}/juegos/${juego.id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const juegoCompleto = await response.json();
      console.log("Datos completos del juego:", juegoCompleto);

      // Llenar campos del formulario
      document.getElementById("nombre-juego").value =
        juegoCompleto.nombre || "";
      document.getElementById("anio-juego").value = juegoCompleto.anio || "";
      document.getElementById("descripcion-juego").value =
        juegoCompleto.descripcion || "";
      document.getElementById("portada-juego").value =
        juegoCompleto.url_imagen || "";

      // Para la desarrolladora, usar el campo desarrolladora (que es el ID)
      const desarrolladoraId = juegoCompleto.desarrolladora;
      if (desarrolladoraId) {
        // Función para intentar establecer la desarrolladora con reintentos
        const establecerDesarrolladora = (intentos = 0) => {
          const desarrolladoraSelect = document.getElementById(
            "desarrolladora-juego"
          );
          
          // Verificar si las opciones están cargadas (más de la opción por defecto)
          if (desarrolladoraSelect.options.length <= 1 && intentos < 10) {
            setTimeout(() => establecerDesarrolladora(intentos + 1), 100);
            return;
          }
          
          desarrolladoraSelect.value = desarrolladoraId;
          
          // Verificar si el valor se estableció correctamente
          if (desarrolladoraSelect.value !== desarrolladoraId.toString()) {
            console.warn("No se pudo establecer la desarrolladora:", desarrolladoraId);
            console.log("Opciones disponibles:", Array.from(desarrolladoraSelect.options).map(opt => ({ value: opt.value, text: opt.text })));
            
            // Intentar buscar por valor string
            desarrolladoraSelect.value = desarrolladoraId.toString();
            
            if (desarrolladoraSelect.value !== desarrolladoraId.toString()) {
              console.error("La desarrolladora no existe en las opciones disponibles");
            }
          } else {
            console.log("Desarrolladora establecida correctamente:", desarrolladoraId);
          }
        };
        
        establecerDesarrolladora();
      }

      // Para el género, usar el valor directamente
      const genero = juegoCompleto.genero;
      if (genero) {
        const generoSelect = document.getElementById("genero-juego");
        generoSelect.value = genero;
      }

      // Limpiar todas las consolas primero
      const checkboxes = document.querySelectorAll('input[name="consolas"]');
      checkboxes.forEach((cb) => (cb.checked = false));

      // Marcar consolas seleccionadas
      if (juegoCompleto.consolas && Array.isArray(juegoCompleto.consolas)) {
        juegoCompleto.consolas.forEach((consola) => {
          const checkbox = document.getElementById(`consola-${consola.id}`);
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      }

      // Actualizar la visualización de consolas seleccionadas
      actualizarConsolasSeleccionadas();

      // Verificar que los datos se hayan cargado correctamente después de un breve retraso
      setTimeout(() => {
        console.log("Datos del formulario después de cargar:", {
          nombre: document.getElementById("nombre-juego").value,
          anio: document.getElementById("anio-juego").value,
          desarrolladora: document.getElementById("desarrolladora-juego").value,
          genero: document.getElementById("genero-juego").value,
          consolas: obtenerConsolasSeleccionadas(),
        });
      }, 100);
    } catch (error) {
      console.error("Error al cargar datos del juego:", error);
      mensaje.textContent = `Error al cargar datos del juego: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
    }
  }

  // Función para poblar selects desde la API
  async function populateSelect(
    url,
    selectId,
    textKey = "nombre",
    valueKey = "id"
  ) {
    try {
      console.log(`Cargando datos desde: ${url}`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Datos cargados para ${selectId}:`, data);

      const select = document.getElementById(selectId);

      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item[valueKey];
        option.textContent =
          item[textKey] ||
          item[textKey.charAt(0).toUpperCase() + textKey.slice(1)] ||
          item.Nombre ||
          item.nombre;
        select.appendChild(option);
      });
      
      console.log(`Select ${selectId} poblado con ${data.length} opciones`);
      return data;
    } catch (error) {
      console.error(`Error al cargar opciones para ${selectId}:`, error);
      mensaje.textContent = `Error al cargar ${selectId}: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      throw error;
    }
  }

  // Función para poblar checkboxes de consolas
  async function populateConsolas() {
    try {
      console.log("Cargando consolas...");
      const response = await fetch(`${API}/consolas`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const consolas = await response.json();
      console.log("Consolas cargadas:", consolas);

      const container = document.getElementById("consolas-container");
      container.innerHTML = "";

      consolas.forEach((consola) => {
        const div = document.createElement("div");
        div.className = "flex items-center gap-2";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `consola-${consola.id}`;
        checkbox.name = "consolas";
        checkbox.value = consola.id;
        checkbox.className = "w-4 h-4 accent-amber-500";

        const label = document.createElement("label");
        label.htmlFor = `consola-${consola.id}`;
        label.textContent = consola.nombre || consola.Nombre;
        label.className = "text-amber-50 cursor-pointer flex-1";

        // Event listener para actualizar la lista de seleccionadas
        checkbox.addEventListener("change", actualizarConsolasSeleccionadas);

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
      });

      actualizarConsolasSeleccionadas();
      console.log(`Consolas cargadas: ${consolas.length} opciones`);
      return consolas;
    } catch (error) {
      console.error("Error al cargar consolas:", error);
      mensaje.textContent = `Error al cargar consolas: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      throw error;
    }
  }

  // Función para actualizar la lista de consolas seleccionadas
  function actualizarConsolasSeleccionadas() {
    const checkboxes = document.querySelectorAll(
      'input[name="consolas"]:checked'
    );
    const divSeleccionadas = document.getElementById("consolas-seleccionadas");

    if (checkboxes.length === 0) {
      divSeleccionadas.textContent = "Ninguna plataforma seleccionada";
      divSeleccionadas.className = "text-sm text-amber-300 mt-1";
    } else {
      const nombres = Array.from(checkboxes).map((cb) => {
        const label = document.querySelector(`label[for="${cb.id}"]`);
        return label.textContent;
      });
      divSeleccionadas.textContent = `Seleccionadas: ${nombres.join(", ")}`;
      divSeleccionadas.className = "text-sm text-green-400 mt-1";
    }
  }

  // Función para obtener consolas seleccionadas
  function obtenerConsolasSeleccionadas() {
    const checkboxes = document.querySelectorAll(
      'input[name="consolas"]:checked'
    );
    return Array.from(checkboxes).map((cb) => parseInt(cb.value));
  }

  // Función para actualizar juego
  async function actualizarJuego(datosJuego) {
    try {
      console.log("actualizarJuego - Enviando datos:", datosJuego);
      console.log("actualizarJuego - ID del juego:", juegoSeleccionado.id);

      const response = await fetch(`${API}/juegos/${juegoSeleccionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosJuego),
      });

      console.log("actualizarJuego - Respuesta del servidor:", response);
      console.log("actualizarJuego - Status:", response.status);

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log("actualizarJuego - Error JSON:", errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          try {
            const errorText = await response.text();
            console.log("actualizarJuego - Error texto:", errorText);
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.log("actualizarJuego - Error al leer respuesta:", textError);
            // Usar mensaje por defecto
          }
        }
        throw new Error(errorMessage);
      }

      const resultado = await response.json();
      console.log("Juego actualizado exitosamente:", resultado);
      return resultado;
    } catch (error) {
      console.error("Error actualizando juego:", error);
      throw error;
    }
  }

  // Event listener para el formulario
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!juegoSeleccionado) {
      mensaje.textContent = "Por favor, selecciona un juego para editar";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    // Obtener datos del formulario
    const formData = new FormData(form);
    const consolasSeleccionadas = obtenerConsolasSeleccionadas();

    const datosJuego = {
      nombre: formData.get("nombre-juego").trim(),
      anio: parseInt(formData.get("anio-juego")),
      descripcion: formData.get("descripcion-juego").trim(),
      desarrolladora: parseInt(formData.get("desarrolladora-juego")),
      consolas: consolasSeleccionadas,
      genero: formData.get("genero-juego"),
      url_imagen: formData.get("portada-juego").trim(),
    };

    // Validaciones más estrictas
    if (!datosJuego.nombre || datosJuego.nombre.length < 2) {
      mensaje.textContent =
        "El nombre del juego debe tener al menos 2 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (datosJuego.nombre.length > 100) {
      mensaje.textContent = "El nombre del juego no puede exceder 100 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (!datosJuego.descripcion || datosJuego.descripcion.length < 10) {
      mensaje.textContent = "La descripción debe tener al menos 10 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (datosJuego.descripcion.length > 200) {
      mensaje.textContent = "La descripción no puede exceder 200 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (!datosJuego.desarrolladora || isNaN(datosJuego.desarrolladora)) {
      mensaje.textContent = "Por favor, selecciona una desarrolladora válida";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (!datosJuego.consolas || datosJuego.consolas.length === 0) {
      mensaje.textContent = "Por favor, selecciona al menos una consola";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (!datosJuego.genero) {
      mensaje.textContent = "Por favor, selecciona un género";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (!datosJuego.url_imagen || !datosJuego.url_imagen.startsWith("http")) {
      mensaje.textContent = "Por favor, ingresa una URL válida para la portada";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (datosJuego.url_imagen.length > 200) {
      mensaje.textContent = "La URL de la imagen no puede exceder 200 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (
      isNaN(datosJuego.anio) ||
      datosJuego.anio < 1950 ||
      datosJuego.anio > new Date().getFullYear()
    ) {
      mensaje.textContent = "Por favor, ingresa un año válido";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    try {
      // Mostrar mensaje de carga
      mensaje.textContent = "Actualizando juego...";
      mensaje.className = "font-pixel text-center mt-4 text-blue-500";

      // Actualizar el juego
      const resultado = await actualizarJuego(datosJuego);

      // Mostrar mensaje de éxito
      mensaje.textContent = "Juego actualizado exitosamente!";
      mensaje.className = "font-pixel text-center mt-4 text-green-500";

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        mensaje.textContent = "";
        mensaje.className = "font-pixel text-center mt-4";
      }, 3000);
    } catch (error) {
      mensaje.textContent = "Error al actualizar el juego: " + error.message;
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

  // Función para limpiar y resetear el estado inicial
  function limpiarEstadoInicial() {
    // Limpiar el input de búsqueda
    juegoSelector.value = "";

    // Limpiar selección de juego
    juegoSeleccionado = null;

    // Ocultar lista de juegos
    juegosLista.classList.add("hidden");

    // Desabilitar formulario
    form.classList.add("opacity-50", "pointer-events-none");

    // Limpiar formulario
    form.reset();

    // Resetear selects a su valor por defecto
    document.getElementById("desarrolladora-juego").selectedIndex = 0;
    document.getElementById("genero-juego").selectedIndex = 0;

    // Limpiar checkboxes de consolas
    const checkboxes = document.querySelectorAll('input[name="consolas"]');
    checkboxes.forEach((cb) => (cb.checked = false));

    // Actualizar estado de consolas seleccionadas
    actualizarConsolasSeleccionadas();

    // Limpiar mensaje
    mensaje.textContent = "";
    mensaje.className = "font-pixel text-center mt-4";
  }

  // Función para actualizar contadores de caracteres
  function setupCharacterCounters() {
    const contadores = [
      { inputId: 'nombre-juego', contadorId: 'contador-nombre', limite: 100 },
      { inputId: 'descripcion-juego', contadorId: 'contador-descripcion', limite: 200 },
      { inputId: 'portada-juego', contadorId: 'contador-url', limite: 200 }
    ];

    contadores.forEach(({ inputId, contadorId, limite }) => {
      const input = document.getElementById(inputId);
      const contador = document.getElementById(contadorId);
      
      if (input && contador) {
        function actualizarContador() {
          const length = input.value.length;
          contador.textContent = `${length}/${limite} caracteres`;
          
          // Cambiar color según la proximidad al límite
          if (length > limite * 0.9) {
            contador.className = "text-xs text-red-400 text-right";
          } else if (length > limite * 0.7) {
            contador.className = "text-xs text-yellow-400 text-right";
          } else {
            contador.className = "text-xs text-amber-300 text-right";
          }
        }

        input.addEventListener('input', actualizarContador);
        input.addEventListener('keyup', actualizarContador);
        input.addEventListener('paste', () => setTimeout(actualizarContador, 0));
        
        // Inicializar contador
        actualizarContador();
      }
    });
  }

  // Limpiar estado inicial primero
  limpiarEstadoInicial();

  // Inicialización secuencial para asegurar que los datos estén disponibles
  async function inicializarFormulario() {
    try {
      // Cargar desarrolladoras y consolas primero
      await populateSelect(`${API}/desarrolladoras`, "desarrolladora-juego");
      await populateConsolas();
      
      // Configurar contadores de caracteres
      setupCharacterCounters();
      
      // Cargar juegos al final
      await cargarJuegos();
      
      console.log("Formulario inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar formulario:", error);
      mensaje.textContent = "Error al cargar los datos iniciales";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
    }
  }

  // Inicializar formulario
  inicializarFormulario();

  // También limpiar cuando se muestra la página (incluyendo navegación hacia atrás/adelante)
  window.addEventListener("pageshow", function (event) {
    // Si la página viene del cache (navegación hacia atrás), también limpiar
    if (event.persisted) {
      limpiarEstadoInicial();
    }
  });
});