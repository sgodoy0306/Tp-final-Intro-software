// -----------------------------_SECCION PARA ELIMINAR DESARROLLADORAS --------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("deleteDesarrolladoraForm");
  const mensaje = document.getElementById("mensaje");
  const desarrolladoraSelect = document.getElementById("desarrolladoraSelect");
  const desarrolladoraInfo = document.getElementById("desarrolladoraInfo");
  const confirmacion = document.getElementById("confirmacion");
  const confirmarEliminacion = document.getElementById("confirmarEliminacion");
  const eliminarBtn = document.getElementById("eliminarBtn");

  // Solo ejecutar si estamos en la página de eliminar desarrolladoras
  if (!form || !mensaje || !desarrolladoraSelect || !desarrolladoraInfo || !confirmacion || !confirmarEliminacion || !eliminarBtn) return;

  const API_URL = "http://localhost:3000/api/desarrolladoras";

  // Función para cargar todas las desarrolladoras
  async function cargarDesarrolladoras() {
    try {
      // Mostrar mensaje de carga
      mensaje.textContent = "Cargando desarrolladoras...";
      mensaje.className = "font-pixel text-center mt-2 text-blue-500";

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const desarrolladoras = await response.json();

      console.log("Desarrolladoras cargadas:", desarrolladoras);

      // Limpiar select
      desarrolladoraSelect.innerHTML =
        '<option value="">-- Selecciona una desarrolladora --</option>';

      // Agregar opciones
      desarrolladoras.forEach((desarrolladora) => {
        const option = document.createElement("option");
        option.value = desarrolladora.id;
        option.textContent = `${desarrolladora.nombre || desarrolladora.Nombre} (${
          desarrolladora.pais || desarrolladora.Pais
        })`;
        desarrolladoraSelect.appendChild(option);
      });

      // Limpiar mensaje de carga
      mensaje.textContent = "";
      mensaje.className = "font-pixel text-center mt-2";
    } catch (error) {
      console.error("Error cargando desarrolladoras:", error);
      mensaje.textContent =
        "Error al cargar las desarrolladoras. ¿Está el servidor ejecutándose?";
      mensaje.className = "font-pixel text-center mt-2 text-red-500";
    }
  }

  // Función para mostrar información de la desarrolladora seleccionada
  async function mostrarInfoDesarrolladora(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const desarrolladora = await response.json();

      console.log("Desarrolladora seleccionada:", desarrolladora);

      // Mostrar información
      document.getElementById("infoNombre").textContent =
        desarrolladora.nombre || desarrolladora.Nombre || "";
      document.getElementById("infoFundacion").textContent =
        desarrolladora.fundacion || desarrolladora.Fundacion || "";
      document.getElementById("infoPais").textContent =
        desarrolladora.pais || desarrolladora.Pais || "";
      
      // Manejar la imagen
      const urlImagen = desarrolladora.url_imagen || desarrolladora.Url_imagen || "";
      const imagenElement = document.getElementById("infoImagen");
      const imagenError = document.getElementById("infoImagenError");
      
      if (urlImagen) {
        imagenElement.src = urlImagen;
        imagenElement.style.display = "block";
        imagenError.style.display = "none";
        
        // Manejar error de carga de imagen
        imagenElement.onerror = function() {
          imagenElement.style.display = "none";
          imagenError.style.display = "block";
        };
      } else {
        imagenElement.style.display = "none";
        imagenError.style.display = "block";
      }
      
      document.getElementById("infoDescripcion").textContent =
        desarrolladora.descripcion || desarrolladora.Descripcion || "";

      // Mostrar secciones
      desarrolladoraInfo.classList.remove("hidden");
      confirmacion.classList.remove("hidden");

      // Limpiar mensaje
      mensaje.textContent = "";
      mensaje.className = "font-pixel text-center mt-2";
    } catch (error) {
      console.error("Error cargando información de desarrolladora:", error);
      mensaje.textContent = "Error al cargar la información de la desarrolladora";
      mensaje.className = "font-pixel text-center mt-2 text-red-500";

      // Ocultar secciones
      desarrolladoraInfo.classList.add("hidden");
      confirmacion.classList.add("hidden");
    }
  }

  // Event listener para cambio de selección
  desarrolladoraSelect.addEventListener("change", function () {
    const id = desarrolladoraSelect.value;

    if (!id) {
      // Ocultar información y confirmación
      desarrolladoraInfo.classList.add("hidden");
      confirmacion.classList.add("hidden");
      eliminarBtn.disabled = true;
      confirmarEliminacion.checked = false;
      mensaje.textContent = "";
      mensaje.className = "font-pixel text-center mt-2";
      return;
    }

    mostrarInfoDesarrolladora(id);
  });

  // Event listener para checkbox de confirmación
  confirmarEliminacion.addEventListener("change", function () {
    eliminarBtn.disabled =
      !confirmarEliminacion.checked || !desarrolladoraSelect.value;
  });

  // Event listener para envío del formulario
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = desarrolladoraSelect.value;

    if (!id) {
      mensaje.textContent = "Por favor, selecciona una desarrolladora";
      mensaje.className = "font-pixel text-center mt-2 text-red-500";
      return;
    }

    if (!confirmarEliminacion.checked) {
      mensaje.textContent =
        "Por favor, confirma que quieres eliminar la desarrolladora";
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
          resultado = { status: "OK", message: "Desarrolladora eliminada" };
        } else {
          throw new Error(
            "Respuesta del servidor no es JSON válido: " + textResult
          );
        }
      }

      console.log("Desarrolladora eliminada:", resultado);

      // Mostrar mensaje de éxito
      mensaje.textContent = "Desarrolladora eliminada correctamente";
      mensaje.className = "font-pixel text-center mt-2 text-green-500";

      // Limpiar formulario
      desarrolladoraSelect.value = "";
      desarrolladoraInfo.classList.add("hidden");
      confirmacion.classList.add("hidden");
      confirmarEliminacion.checked = false;
      eliminarBtn.disabled = true;

      // Recargar lista de desarrolladoras
      await cargarDesarrolladoras();
    } catch (error) {
      console.error("Error eliminando desarrolladora:", error);
      mensaje.textContent = "Error al eliminar la desarrolladora: " + error.message;
      mensaje.className = "font-pixel text-center mt-2 text-red-500";
    }
  });

  // Cargar desarrolladoras al iniciar
  cargarDesarrolladoras();
});
