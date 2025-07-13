// ---------------------------- SECCION PARA EDITAR LAS CONSOLAS -----------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://localhost:8000/api/consolas";
  const form = document.getElementById("editConsolaForm");
  const mensaje = document.getElementById("mensaje");
  const consolaSelect = document.getElementById("consolaSelect");

  // Solo ejecutar si estamos en la página de editar consolas
  if (!form || !mensaje || !consolaSelect) return;

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
        option.textContent = `${consola.nombre || consola.Nombre} (${
          consola.compania || consola.Compania
        })`;
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
      document.getElementById("compania").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("url_imagen").value = "";
      mensaje.textContent = "";
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/${id}`);
      const consola = await res.json();

      // Llenar los campos con los datos de la consola
      document.getElementById("nombre").value =
        consola.nombre || consola.Nombre || "";
      document.getElementById("anio").value =
        consola.anio || consola.Anio || "";
      document.getElementById("compania").value =
        consola.compania || consola.Compania || "";
      document.getElementById("descripcion").value =
        consola.descripcion || consola.Descripcion || "";
      document.getElementById("url_imagen").value =
        consola.url_imagen || consola.URL_IMAGEN || "";

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
      document.getElementById("compania").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("url_imagen").value = "";
    }
  });

  // Manejar el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = consolaSelect.value;
    const nombre = document.getElementById("nombre").value.trim();
    const anio = parseInt(document.getElementById("anio").value.trim());
    const compania = document.getElementById("compania").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
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
        compania,
        descripcion,
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
      document.getElementById("compania").value = "";
      document.getElementById("descripcion").value = "";
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
