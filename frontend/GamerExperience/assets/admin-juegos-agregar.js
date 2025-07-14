// ---------------------SECCION PARA AGREGAR NUEVOS JUEGOS--------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  const API = "http://localhost:8000/api";
  const form = document.querySelector("form");
  const mensaje = document.getElementById("mensaje");

  // Solo ejecutar si estamos en la página de agregar juegos
  if (!form || !mensaje) return;

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
        // Manejar tanto nombres con mayúscula como minúscula
        option.textContent =
          item[textKey] ||
          item[textKey.charAt(0).toUpperCase() + textKey.slice(1)] ||
          item.Nombre ||
          item.nombre;
        select.appendChild(option);
      });
    } catch (error) {
      console.error(`Error al cargar opciones para ${selectId}:`, error);
      mensaje.textContent = `Error al cargar ${selectId}: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
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
    } catch (error) {
      console.error("Error al cargar consolas:", error);
      mensaje.textContent = `Error al cargar consolas: ${error.message}`;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
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

  // Función para crear juego
  async function crearJuego(datosJuego) {
    try {
      console.log("Enviando datos del juego:", datosJuego);

      const response = await fetch(`${API}/juegos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosJuego),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          try {
            errorMessage = (await response.text()) || errorMessage;
          } catch (textError) {
            // Usar mensaje por defecto
          }
        }
        throw new Error(errorMessage);
      }

      const resultado = await response.json();
      console.log("Juego creado exitosamente:", resultado);
      return resultado;
    } catch (error) {
      console.error("Error creando juego:", error);
      throw error;
    }
  }

  // Event listener para el formulario
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtener datos del formulario
    const formData = new FormData(form);
    const consolasSeleccionadas = obtenerConsolasSeleccionadas();

    const datosJuego = {
      nombre: formData.get("nombre-juego").trim(),
      anio: parseInt(formData.get("anio-juego")),
      descripcion: formData.get("descripcion-juego").trim(),
      desarrolladora: parseInt(formData.get("desarrolladora-juego")),
      consolas: consolasSeleccionadas, // Ahora es un array
      genero: formData.get("genero-juego"),
      url_imagen: formData.get("portada-juego").trim(),
    };

    // Validaciones básicas
    if (
      !datosJuego.nombre ||
      !datosJuego.desarrolladora ||
      datosJuego.consolas.length === 0
    ) {
      mensaje.textContent =
        "Por favor, completa todos los campos obligatorios (incluyendo al menos una plataforma)";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    // Validación de límites de caracteres según la base de datos
    if (datosJuego.nombre.length > 100) {
      mensaje.textContent = "El nombre del juego no puede exceder 100 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (datosJuego.descripcion.length > 200) {
      mensaje.textContent = "La descripción no puede exceder 200 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (datosJuego.genero && datosJuego.genero.length > 100) {
      mensaje.textContent = "El género no puede exceder 100 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    if (datosJuego.url_imagen.length > 200) {
      mensaje.textContent = "La URL de la imagen no puede exceder 200 caracteres";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    // Validación de año
    if (
      isNaN(datosJuego.anio) ||
      datosJuego.anio < 1950 ||
      datosJuego.anio > new Date().getFullYear()
    ) {
      mensaje.textContent = "Por favor, ingresa un año válido (1950 - año actual)";
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
      return;
    }

    try {
      // Mostrar mensaje de carga
      mensaje.textContent = "Guardando juego...";
      mensaje.className = "font-pixel text-center mt-4 text-blue-500";

      // Crear el juego
      const resultado = await crearJuego(datosJuego);

      // Mostrar mensaje de éxito
      mensaje.textContent = `Juego guardado exitosamente en ${datosJuego.consolas.length} plataforma(s)!`;
      mensaje.className = "font-pixel text-center mt-4 text-green-500";

      // Limpiar formulario
      form.reset();

      // Limpiar checkboxes de consolas
      const checkboxes = document.querySelectorAll('input[name="consolas"]');
      checkboxes.forEach((cb) => (cb.checked = false));
      actualizarConsolasSeleccionadas();

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        mensaje.textContent = "";
        mensaje.className = "font-pixel text-center mt-4";
      }, 3000);
    } catch (error) {
      mensaje.textContent = "Error al guardar el juego: " + error.message;
      mensaje.className = "font-pixel text-center mt-4 text-red-500";
    }
  });

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

  // Cargar datos iniciales
  populateSelect(`${API}/desarrolladoras`, "desarrolladora-juego");
  populateConsolas();
  setupCharacterCounters();
});
