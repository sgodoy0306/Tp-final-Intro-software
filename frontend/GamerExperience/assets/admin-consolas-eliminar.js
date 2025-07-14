// -----------------------------_SECCION PARA ELIMINAR CONSOLAS --------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("deleteConsolaForm");
  const mensaje = document.getElementById("mensaje");
  const consolaSelect = document.getElementById("consolaSelect");
  const consolaInfo = document.getElementById("consolaInfo");
  const confirmacion = document.getElementById("confirmacion");
  const confirmarEliminacion = document.getElementById("confirmarEliminacion");
  const eliminarBtn = document.getElementById("eliminarBtn");

  // Solo ejecutar si estamos en la página de eliminar consolas
  if (
    !form ||
    !mensaje ||
    !consolaSelect ||
    !consolaInfo ||
    !confirmacion ||
    !confirmarEliminacion ||
    !eliminarBtn
  )
    return;

  const API_URL = "http://localhost:8000/api/consolas";

  // Función para cargar todas las consolas
  async function cargarConsolas() {
    try {
      // Mostrar mensaje de carga
      mensaje.textContent = "Cargando consolas...";
      mensaje.className = "font-pixel text-center mt-2 text-blue-500";

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const consolas = await response.json();

      console.log("Consolas cargadas:", consolas);

      // Limpiar select
      consolaSelect.innerHTML =
        '<option value="">-- Selecciona una consola --</option>';

      // Agregar opciones
      consolas.forEach((consola) => {
        const option = document.createElement("option");
        option.value = consola.id;
        option.textContent = `${consola.nombre} (${consola.compania})`;
        consolaSelect.appendChild(option);
      });

      // Limpiar mensaje de carga
      mensaje.textContent = "";
      mensaje.className = "font-pixel text-center mt-2";
    } catch (error) {
      console.error("Error cargando consolas:", error);
      mensaje.textContent =
        "Error al cargar las consolas. ¿Está el servidor ejecutándose?";
      mensaje.className = "font-pixel text-center mt-2 text-red-500";
    }
  }

  // Función para mostrar información de la consola seleccionada
  async function mostrarInfoConsola(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const consola = await response.json();

      console.log("Consola seleccionada:", consola);

      // Mostrar información
      document.getElementById("infoNombre").textContent =
        consola.nombre || "";
      document.getElementById("infoAnio").textContent =
        consola.lanzamiento || "";
      document.getElementById("infoCompania").textContent =
        consola.compania || "";
      document.getElementById("infoDescripcion").textContent =
        consola.descripcion || "";

      // Mostrar secciones
      consolaInfo.classList.remove("hidden");
      confirmacion.classList.remove("hidden");

      // Limpiar mensaje
      mensaje.textContent = "";
      mensaje.className = "font-pixel text-center mt-2";
    } catch (error) {
      console.error("Error cargando información de consola:", error);
      mensaje.textContent = "Error al cargar la información de la consola";
      mensaje.className = "font-pixel text-center mt-2 text-red-500";

      // Ocultar secciones
      consolaInfo.classList.add("hidden");
      confirmacion.classList.add("hidden");
    }
  }

  // Event listener para cambio de selección
  consolaSelect.addEventListener("change", function () {
    const id = consolaSelect.value;

    if (!id) {
      // Ocultar información y confirmación
      consolaInfo.classList.add("hidden");
      confirmacion.classList.add("hidden");
      eliminarBtn.disabled = true;
      confirmarEliminacion.checked = false;
      mensaje.textContent = "";
      mensaje.className = "font-pixel text-center mt-2";
      return;
    }

    mostrarInfoConsola(id);
  });

  // Event listener para checkbox de confirmación
  confirmarEliminacion.addEventListener("change", function () {
    eliminarBtn.disabled =
      !confirmarEliminacion.checked || !consolaSelect.value;
  });

  // Event listener para envío del formulario
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = consolaSelect.value;

    if (!id) {
      mensaje.textContent = "Por favor, selecciona una consola";
      mensaje.className = "font-pixel text-center mt-2 text-red-500";
      return;
    }

    if (!confirmarEliminacion.checked) {
      mensaje.textContent =
        "Por favor, confirma que quieres eliminar la consola";
      mensaje.className = "font-pixel text-center mt-2 text-red-500";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        // Intentar leer el error como JSON
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // Si no es JSON, intentar leer como texto
          try {
            const textError = await response.text();
            errorMessage = textError || errorMessage;
          } catch (textError) {
            // Si no se puede leer, usar el mensaje por defecto
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
        }

        throw new Error(errorMessage);
      }

      // Intentar parsear la respuesta como JSON
      let resultado;
      try {
        resultado = await response.json();
      } catch (jsonError) {
        // Si no es JSON, intentar leer como texto
        const textResult = await response.text();
        console.log("Respuesta del servidor (texto):", textResult);

        // Si la respuesta está vacía o es exitosa, considerar como éxito
        if (response.status === 200 || response.status === 204) {
          resultado = { status: "OK", message: "Consola eliminada" };
        } else {
          throw new Error(
            "Respuesta del servidor no es JSON válido: " + textResult
          );
        }
      }

      console.log("Consola eliminada:", resultado);

      // Mostrar mensaje de éxito
      mensaje.textContent = "Consola eliminada correctamente";
      mensaje.className = "font-pixel text-center mt-2 text-green-500";

      // Limpiar formulario
      consolaSelect.value = "";
      consolaInfo.classList.add("hidden");
      confirmacion.classList.add("hidden");
      confirmarEliminacion.checked = false;
      eliminarBtn.disabled = true;

      // Recargar lista de consolas
      await cargarConsolas();
    } catch (error) {
      console.error("Error eliminando consola:", error);
      mensaje.textContent = "Error al eliminar la consola: " + error.message;
      mensaje.className = "font-pixel text-center mt-2 text-red-500";
    }
  });

  // Cargar consolas al iniciar
  cargarConsolas();
});
