// ---------------------------- SECCION PARA EDITAR LAS DESARROLLADORAS -----------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://localhost:8000/api/desarrolladoras";
  const form = document.getElementById("editDesarrolladoraForm");
  const mensaje = document.getElementById("mensaje");
  const desarrolladoraSelect = document.getElementById("desarrolladoraSelect");

  // Solo ejecutar si estamos en la página de editar desarrolladoras
  if (!form || !mensaje || !desarrolladoraSelect) return;

  console.log("🎮 Sistema de edición de desarrolladoras iniciado");

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

  // Cargar opciones de desarrolladoras al iniciar
  async function cargarDesarrolladoras() {
    try {
      console.log("📋 Cargando lista de desarrolladoras...");
      const res = await fetch(apiUrl);
      const desarrolladoras = await res.json();

      desarrolladoraSelect.innerHTML =
        '<option value="">-- Selecciona una desarrolladora --</option>';

      desarrolladoras.forEach((desarrolladora) => {
        const option = document.createElement("option");
        option.value = desarrolladora.id;
        option.textContent = `${
          desarrolladora.nombre || desarrolladora.Nombre
        } (${desarrolladora.pais || desarrolladora.Pais})`;
        desarrolladoraSelect.appendChild(option);
      });

      console.log(`✅ Cargadas ${desarrolladoras.length} desarrolladoras`);
    } catch (err) {
      mensaje.textContent = "Error al cargar desarrolladoras";
      mensaje.classList.add("text-red-500");
      console.error("❌ Error cargando desarrolladoras:", err);
    }
  }

  // Al cambiar la selección, carga los datos de la desarrolladora
  desarrolladoraSelect.addEventListener("change", async () => {
    const id = desarrolladoraSelect.value;

    if (!id) {
      // Limpiar todos los campos
      document.getElementById("nombre").value = "";
      document.getElementById("fundacion").value = "";
      document.getElementById("pais").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("url_imagen").value = "";
      mensaje.textContent = "";
      mensaje.classList.remove("text-red-500", "text-green-500");
      return;
    }

    try {
      console.log(`🔍 Cargando datos de desarrolladora ID: ${id}`);
      const res = await fetch(`${apiUrl}/${id}`);
      const desarrolladora = await res.json();

      // Llenar los campos con los datos de la desarrolladora
      document.getElementById("nombre").value =
        desarrolladora.nombre || desarrolladora.Nombre || "";
      document.getElementById("fundacion").value =
        desarrolladora.fundacion || desarrolladora.Fundacion || "";
      document.getElementById("pais").value =
        desarrolladora.pais || desarrolladora.Pais || "";
      document.getElementById("descripcion").value =
        desarrolladora.descripcion || desarrolladora.Descripcion || "";
      document.getElementById("url_imagen").value =
        desarrolladora.url_imagen || desarrolladora.URL_IMAGEN || "";

      // Actualizar contadores después de llenar los campos
      setupCharacterCounters();

      mensaje.textContent = "";
      mensaje.classList.remove("text-red-500", "text-green-500");

      console.log("✅ Datos cargados exitosamente:", desarrolladora);
    } catch (err) {
      mensaje.textContent = "Error al cargar los datos de la desarrolladora";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      console.error("❌ Error cargando desarrolladora:", err);

      // Limpiar campos en caso de error
      document.getElementById("nombre").value = "";
      document.getElementById("fundacion").value = "";
      document.getElementById("pais").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("url_imagen").value = "";
      
      // Actualizar contadores después de limpiar
      setupCharacterCounters();
    }
  });

  // Manejar el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = desarrolladoraSelect.value;
    const nombre = document.getElementById("nombre").value.trim();
    const fundacion = parseInt(
      document.getElementById("fundacion").value.trim()
    );
    const pais = document.getElementById("pais").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const url_imagen = document.getElementById("url_imagen").value.trim();

    // Validaciones personalizadas
    if (!id) {
      mensaje.textContent = "Por favor, selecciona una desarrolladora";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    if (!nombre) {
      mensaje.textContent = "El nombre de la desarrolladora es obligatorio";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    if (!fundacion) {
      mensaje.textContent = "El año de fundación es obligatorio";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    if (fundacion < 1800 || fundacion > 2025) {
      mensaje.textContent = "El año de fundación debe estar entre 1800 y 2025";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    if (!pais) {
      mensaje.textContent = "El país es obligatorio";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    if (!descripcion) {
      mensaje.textContent = "La descripción es obligatoria";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
      return;
    }

    // Mostrar mensaje de guardando
    mensaje.textContent = "Guardando cambios...";
    mensaje.classList.remove("text-red-500", "text-green-500");
    mensaje.classList.add("text-yellow-500");

    try {
      console.log("💾 Guardando cambios para desarrolladora ID:", id);

      const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          fundacion,
          pais,
          descripcion,
          url_imagen,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        mensaje.textContent = "Desarrolladora actualizada exitosamente!";
        mensaje.classList.remove("text-red-500", "text-yellow-500");
        mensaje.classList.add("text-green-500");

        console.log("✅ Desarrolladora actualizada:", result);

        // Actualizar la opción en el select
        const selectedOption = desarrolladoraSelect.querySelector(
          `option[value="${id}"]`
        );
        if (selectedOption) {
          selectedOption.textContent = `${nombre} (${pais})`;
        }
      } else {
        const errorData = await response.json();
        mensaje.textContent =
          "Error al actualizar la desarrolladora: " +
          (errorData.error || "Error desconocido");
        mensaje.classList.remove("text-green-500", "text-yellow-500");
        mensaje.classList.add("text-red-500");
        console.error("❌ Error del servidor:", errorData);
      }
    } catch (error) {
      mensaje.textContent =
        "Error de conexión. Verifica que el servidor esté ejecutándose.";
      mensaje.classList.remove("text-green-500", "text-yellow-500");
      mensaje.classList.add("text-red-500");
      console.error("💥 Error de conexión:", error);
    }
  });

  // Inicializar cargando las desarrolladoras
  cargarDesarrolladoras();
});