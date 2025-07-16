// Script para manejar el formulario de desarrolladoras
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const mensaje = document.getElementById("mensaje");

  console.log("🎮 Sistema de administración de desarrolladoras iniciado");
  console.log("📝 Formulario encontrado:", !!form);
  console.log("💬 Elemento de mensaje encontrado:", !!mensaje);

  // Función para configurar contadores de caracteres
  function setupCharacterCounters() {
    const contadores = [
      { inputId: 'dev-name', contadorId: 'contador-nombre', limite: 100 },
      { inputId: 'dev-desc', contadorId: 'contador-descripcion', limite: 300 },
      { inputId: 'dev-logo', contadorId: 'contador-url', limite: 200 }
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

  // Inicializar contadores
  setupCharacterCounters();

  // Verificar conexión con el backend
  checkBackendConnection();

  async function checkBackendConnection() {
    try {
      console.log("🔍 Verificando conexión con el backend...");
      const response = await fetch("http://localhost:8000/api/health");

      if (response.ok) {
        console.log("✅ Conexión establecida con el servidor");
        // Conexión exitosa, pero no mostrar mensaje al usuario
      } else {
        throw new Error(`Servidor respondió con estado: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      showMessage(
        "Error de conexión. Asegúrate de que el servidor esté ejecutándose.",
        "error"
      );
    }
  }

  // Función para mostrar mensajes (igual que en consolas)
  function showMessage(text, type = "info") {
    const messageDiv = document.getElementById("mensaje");

    if (!messageDiv) {
      console.error("❌ No se encontró el elemento de mensaje");
      return;
    }

    console.log("💬 Mostrando mensaje:", text, "tipo:", type);

    // Configurar el mensaje
    messageDiv.textContent = text;

    // Limpiar clases anteriores
    messageDiv.classList.remove(
      "text-green-500",
      "text-red-500",
      "text-yellow-500"
    );

    // Aplicar color según el tipo
    if (type === "success") {
      messageDiv.classList.add("text-green-500");
    } else if (type === "error") {
      messageDiv.classList.add("text-red-500");
    } else {
      messageDiv.classList.add("text-yellow-500");
    }
  }

  // Manejar el envío del formulario
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      console.log("📝 Procesando formulario...");

      // Recopilar datos del formulario
      const formData = {
        nombre: document.getElementById("dev-name").value.trim(),
        fundacion: parseInt(document.getElementById("dev-year").value),
        pais: document.getElementById("dev-country").value.trim(),
        descripcion: document.getElementById("dev-desc").value.trim(),
        url_imagen: document.getElementById("dev-logo").value.trim() || "",
      };

      console.log("📊 Datos del formulario:", formData);

      // Validar datos con mensajes personalizados
      if (!formData.nombre.trim()) {
        showMessage("El nombre de la desarrolladora es obligatorio", "error");
        return;
      }

      if (!formData.fundacion) {
        showMessage("El año de fundación es obligatorio", "error");
        return;
      }

      if (!formData.pais.trim()) {
        showMessage("El país es obligatorio", "error");
        return;
      }

      if (!formData.descripcion.trim()) {
        showMessage("La descripción es obligatoria", "error");
        return;
      }

      if (formData.fundacion < 1800 || formData.fundacion > 2025) {
        showMessage(
          "El año de fundación debe estar entre 1800 y 2025",
          "error"
        );
        return;
      }

      // Mostrar mensaje de carga
      showMessage("Guardando desarrolladora...", "info");

      try {
        console.log("🚀 Enviando datos al servidor...");

        const response = await fetch(
          "http://localhost:8000/api/desarrolladoras",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        console.log(
          `📡 Respuesta del servidor: ${response.status} ${response.statusText}`
        );

        if (response.ok) {
          const result = await response.json();
          console.log("🎉 Desarrolladora creada exitosamente:", result);

          showMessage("Desarrolladora guardada exitosamente!", "success");
          form.reset();
          // Reinicializar contadores después de limpiar el formulario
          setupCharacterCounters();
        } else {
          const errorData = await response.json();
          console.error("❌ Error del servidor:", errorData);
          showMessage(
            "Error al guardar la desarrolladora: " +
              (errorData.error || "Error desconocido"),
            "error"
          );
        }
      } catch (error) {
        console.error("💥 Error de conexión:", error);
        showMessage(
          "Error de conexión. Verifica que el servidor esté ejecutándose.",
          "error"
        );
      }
    });
  } else {
    console.error("❌ No se encontró el formulario en la página");
  }
});