// ---------------------------- SECCION PARA EDITAR LAS CONSOLAS -----------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://localhost:8000/api/consolas";
  const form = document.getElementById("editConsolaForm");
  const mensaje = document.getElementById("mensaje");
  const consolaSelect = document.getElementById("consolaSelect");

  // Solo ejecutar si estamos en la página de editar consolas
  if (!form || !mensaje || !consolaSelect) return;

  // Función para configurar contadores de caracteres
  function setupCharacterCounters() {
    const contadores = [
      { inputId: 'nombre', contadorId: 'contador-nombre', limite: 100 },
      { inputId: 'descripcion', contadorId: 'contador-descripcion', limite: 300 },
      { inputId: 'url_imagen', contadorId: 'contador-url', limite: 200 }
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

  // Cargar opciones de consolas al iniciar
  async function cargarConsolas() {
    try {
      const res = await fetch(apiUrl);
      const consolas = await res.json();
      consolaSelect.innerHTML =
        '<option value="">-- Selecciona una consola --</option>';
      consolas.forEach((consola) => {
        const option = document.createElement("option");
        option.value = consola.id;
        option.textContent = `${consola.nombre} (${consola.compania})`;
        consolaSelect.appendChild(option);
      });
    } catch (err) {
      mensaje.textContent = "Error al cargar consolas";
      mensaje.classList.add("text-red-500");
      console.error("Error cargando consolas:", err);
    }
  }

  // Al cambiar la selección, carga los datos de la consola
  consolaSelect.addEventListener("change", async () => {
    const id = consolaSelect.value;
    if (!id) {
      // Limpiar todos los campos
      document.getElementById("nombre").value = "";
      document.getElementById("anio").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("compania").value = "";
      document.getElementById("url_imagen").value = "";
      mensaje.textContent = "";
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/${id}`);
      const consola = await res.json();

      // Debug: mostrar la estructura de datos de la consola
      console.log("Datos de la consola:", consola);
      console.log("Campos disponibles:", Object.keys(consola));

      // Llenar los campos con los datos de la consola
      document.getElementById("nombre").value =
        consola.nombre || "";
      document.getElementById("anio").value =
        consola.lanzamiento || "";
      document.getElementById("descripcion").value =
        consola.descripcion || "";
      document.getElementById("compania").value =
        consola.compania || "";
      document.getElementById("url_imagen").value =
        consola.url_imagen || "";

      // Actualizar contadores después de llenar los campos
      setupCharacterCounters();

      mensaje.textContent = "";
      mensaje.classList.remove("text-red-500", "text-green-500");
    } catch (err) {
      mensaje.textContent = "Error al cargar los datos de la consola";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      console.error("Error cargando consola:", err);

      // Limpiar campos en caso de error
      document.getElementById("nombre").value = "";
      document.getElementById("anio").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("compania").value = "";
      document.getElementById("url_imagen").value = "";
      
      // Actualizar contadores después de limpiar
      setupCharacterCounters();
    }
  });

  // Manejar el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = consolaSelect.value;
    const nombre = document.getElementById("nombre").value.trim();
    const anio = parseInt(document.getElementById("anio").value.trim());
    const descripcion = document.getElementById("descripcion").value.trim();
    const compania = document.getElementById("compania").value.trim();
    const url_imagen = document.getElementById("url_imagen").value.trim();

    // Validaciones
    if (!id) {
      mensaje.textContent = "Por favor, selecciona una consola";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    if (!nombre || !compania || !anio) {
      mensaje.textContent = "Por favor, completa todos los campos obligatorios";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    if (isNaN(anio) || anio < 1900 || anio > new Date().getFullYear()) {
      mensaje.textContent = "Por favor, ingresa un año válido";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    try {
      const requestData = {
        nombre,
        anio,
        descripcion,
        compania,
        url_imagen,
      };

      console.log("Enviando datos:", requestData);

      const res = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        let errorMessage = `Error ${res.status}: ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          try {
            errorMessage = await res.text();
          } catch (textError) {
            errorMessage = `Error ${res.status}: ${res.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const consolaActualizada = await res.json();
      mensaje.textContent = "Consola actualizada correctamente";
      mensaje.classList.remove("text-red-500");
      mensaje.classList.add("text-green-500");

      // Vaciar los campos después de editar
      document.getElementById("nombre").value = "";
      document.getElementById("anio").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("compania").value = "";
      document.getElementById("url_imagen").value = "";
      consolaSelect.value = "";

      // Recargar la lista de consolas para reflejar los cambios
      await cargarConsolas();

      console.log("Consola actualizada:", consolaActualizada);
    } catch (err) {
      mensaje.textContent = "Error al actualizar la consola: " + err.message;
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      console.error("Error actualizando consola:", err);
    }
  });

  // Inicializar cargando las consolas
  cargarConsolas();
});