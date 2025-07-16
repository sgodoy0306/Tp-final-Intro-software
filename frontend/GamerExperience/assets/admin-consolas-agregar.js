// ---------------------SECCION PARA AGREGAR NUEVAS CONSOLAS--------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const mensaje = document.getElementById("mensaje");

  // Solo ejecutar si estamos en la página de agregar consolas
  if (!form || !mensaje) return;

  // Función para configurar contadores de caracteres
  function setupCharacterCounters() {
    const contadores = [
      { inputId: 'platform-name', contadorId: 'contador-nombre', limite: 100 },
      { inputId: 'platform-desc', contadorId: 'contador-descripcion', limite: 300 },
      { inputId: 'platform-logo', contadorId: 'contador-url', limite: 200 }
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

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const formData = {
      nombre: document.getElementById("platform-name").value,
      anio: parseInt(document.getElementById("platform-year").value),
      descripcion: document.getElementById("platform-desc").value,
      compania: document.getElementById("company-name").value,
      url_imagen: document.getElementById("platform-logo").value,
    };

    try {
      const response = await fetch("http://localhost:8000/api/consolas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        mensaje.textContent = "Consola guardada exitosamente!";
        mensaje.classList.remove("text-red-500");
        mensaje.classList.add("text-green-500");
        console.log(result);
        form.reset(); // Limpiar el formulario
        // Reinicializar contadores después de limpiar el formulario
        setupCharacterCounters();
      } else {
        const error = await response.json();
        mensaje.textContent =
          "Error al guardar la consola: " +
          (error.error || "Error desconocido");
        mensaje.classList.remove("text-green-500");
        mensaje.classList.add("text-red-500");
      }
    } catch (error) {
      console.error("Error:", error);
      mensaje.textContent =
        "Error de conexión. Asegúrate de que el servidor esté ejecutándose.";
      mensaje.classList.remove("text-green-500");
      mensaje.classList.add("text-red-500");
    }
  });
});