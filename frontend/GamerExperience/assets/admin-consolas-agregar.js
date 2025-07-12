// ---------------------SECCION PARA AGREGAR NUEVAS CONSOLAS--------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const mensaje = document.getElementById("mensaje");

  // Solo ejecutar si estamos en la página de agregar consolas
  if (!form || !mensaje) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const formData = {
      nombre: document.getElementById("platform-name").value,
      año: parseInt(document.getElementById("platform-year").value),
      descripcion: document.getElementById("platform-desc").value,
      compañia: document.getElementById("company-name").value,
      formato: document.getElementById("platform-year").value,
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
