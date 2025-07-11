// Script para manejar el formulario de desarrolladoras
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const mensaje = document.getElementById("mensaje");
  
  console.log("🎮 Sistema de administración de desarrolladoras iniciado");
  console.log("📝 Formulario encontrado:", !!form);
  console.log("💬 Elemento de mensaje encontrado:", !!mensaje);
  
  // Verificar conexión con el backend
  checkBackendConnection();
  
  async function checkBackendConnection() {
    try {
      console.log("🔍 Verificando conexión con el backend...");
      const response = await fetch("http://localhost:3000/api/health");
      
      if (response.ok) {
        console.log("✅ Conexión establecida con el servidor");
        // Conexión exitosa, pero no mostrar mensaje al usuario
      } else {
        throw new Error(`Servidor respondió con estado: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      showMessage("Error de conexión. Asegúrate de que el servidor esté ejecutándose.", "error");
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
    messageDiv.classList.remove("text-green-500", "text-red-500", "text-yellow-500");
    
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
        url_imagen: document.getElementById("dev-logo").value.trim() || ""
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
        showMessage("El año de fundación debe estar entre 1800 y 2025", "error");
        return;
      }
      
      // Mostrar mensaje de carga
      showMessage("Guardando desarrolladora...", "info");
      
      try {
        console.log("🚀 Enviando datos al servidor...");
        
        const response = await fetch("http://localhost:3000/api/desarrolladoras", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        
        console.log(`📡 Respuesta del servidor: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const result = await response.json();
          console.log("🎉 Desarrolladora creada exitosamente:", result);
          
          showMessage("Desarrolladora guardada exitosamente!", "success");
          form.reset();
          
        } else {
          const errorData = await response.json();
          console.error("❌ Error del servidor:", errorData);
          showMessage("Error al guardar la desarrolladora: " + (errorData.error || "Error desconocido"), "error");
        }
        
      } catch (error) {
        console.error("💥 Error de conexión:", error);
        showMessage("Error de conexión. Verifica que el servidor esté ejecutándose.", "error");
      }
    });
  } else {
    console.error("❌ No se encontró el formulario en la página");
  }
});
