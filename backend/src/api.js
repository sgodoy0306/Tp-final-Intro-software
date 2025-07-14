require('dotenv').config({ path: __dirname + '/.env' });

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const {
  getAllJuegos,
  getOneJuego,
  createJuego,
  deleteJuego,
  updateJuego,
  getAllConsolas,
  getOneConsola,
  createConsola,
  deleteConsola,
  updateConsola,
  getAllDesarrolladoras,
  getOneDesarrolladora,
  createDesarrolladora,
  deleteDesarrolladora,
  updateDesarrolladora,
} = require("./scripts/catalogo.js");

// Health route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on PORT: ", PORT);
});

// Juegos

app.get("/api/juegos", async (req, res) => {
  const juegos = await getAllJuegos();
  res.json(juegos);
});

app.get("/api/juegos/:id", async (req, res) => {
  const juego = await getOneJuego(req.params.id);
  if (!juego) {
    return res.status(404).json({ error: "Juego no encontrado" });
  }
  res.json(juego);
});

app.post("/api/juegos", async (req, res) => {
  try {
    // Validaciones básicas
    if (!req.body.nombre) {
      return res.status(400).json({ error: "El nombre del juego es obligatorio" });
    }
    
    if (!req.body.descripcion) {
      return res.status(400).json({ error: "La descripción del juego es obligatoria" });
    }
    
    if (!req.body.desarrolladora) {
      return res.status(400).json({ error: "La desarrolladora es obligatoria" });
    }
    
    if (!req.body.genero) {
      return res.status(400).json({ error: "El género es obligatorio" });
    }
    
    // Validaciones de longitud según la base de datos
    if (req.body.nombre.length > 100) {
      return res.status(400).json({ error: "El nombre del juego no puede exceder 100 caracteres" });
    }
    
    if (req.body.descripcion.length > 200) {
      return res.status(400).json({ error: "La descripción no puede exceder 200 caracteres" });
    }
    
    if (req.body.genero.length > 100) {
      return res.status(400).json({ error: "El género no puede exceder 100 caracteres" });
    }
    
    if (req.body.url_imagen && req.body.url_imagen.length > 200) {
      return res.status(400).json({ error: "La URL de la imagen no puede exceder 200 caracteres" });
    }

    const nuevoJuego = await createJuego(
      req.body.nombre,
      req.body.anio,
      req.body.descripcion,
      req.body.desarrolladora,
      req.body.genero,
      req.body.url_imagen,
      req.body.consolas
    );
    
    if (!nuevoJuego) {
      return res.status(500).json({ error: "Error interno al crear el juego" });
    }
    
    res.json(nuevoJuego);
  } catch (error) {
    console.error("Error en POST /api/juegos:", error);
    
    // Manejo específico de errores de PostgreSQL
    if (error.code) {
      switch (error.code) {
        case '23502': // NOT NULL violation
          return res.status(400).json({ error: "Faltan campos obligatorios en la base de datos" });
        case '23505': // Unique violation
          return res.status(400).json({ error: "Ya existe un juego con ese nombre" });
        case '23503': // Foreign key violation
          return res.status(400).json({ error: "La desarrolladora seleccionada no existe" });
        case '22001': // String data right truncation
          return res.status(400).json({ error: "Uno de los campos excede el límite de caracteres permitido" });
        default:
          return res.status(500).json({ error: `Error de base de datos: ${error.message}` });
      }
    }
    
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.delete("/api/juegos/:id", async (req, res) => {
  const juego = await deleteJuego(req.params.id);
  if (!juego) {
    return res.status(404).json({ error: "Juego id: " + id + " not found" });
  }
  res.json({ status: "OK", juegoEliminado: juego });
});

app.put("/api/juegos/:id", async (req, res) => {
  try {
    console.log("PUT /api/juegos/:id - Datos recibidos:", {
      id: req.params.id,
      body: req.body
    });

    // Validaciones básicas
    if (!req.body.nombre) {
      return res.status(400).json({ error: "El nombre del juego es obligatorio" });
    }
    
    if (!req.body.descripcion) {
      return res.status(400).json({ error: "La descripción del juego es obligatoria" });
    }
    
    if (!req.body.desarrolladora) {
      return res.status(400).json({ error: "La desarrolladora es obligatoria" });
    }
    
    if (!req.body.genero) {
      return res.status(400).json({ error: "El género es obligatorio" });
    }
    
    // Validaciones de longitud según la base de datos
    if (req.body.nombre.length > 100) {
      return res.status(400).json({ error: "El nombre del juego no puede exceder 100 caracteres" });
    }
    
    if (req.body.descripcion.length > 200) {
      return res.status(400).json({ error: "La descripción no puede exceder 200 caracteres" });
    }
    
    if (req.body.genero.length > 100) {
      return res.status(400).json({ error: "El género no puede exceder 100 caracteres" });
    }
    
    if (req.body.url_imagen && req.body.url_imagen.length > 200) {
      return res.status(400).json({ error: "La URL de la imagen no puede exceder 200 caracteres" });
    }

    console.log("PUT /api/juegos/:id - Validaciones pasadas, llamando updateJuego");

    const juego = await updateJuego(
      req.params.id,
      req.body.nombre,
      req.body.anio,
      req.body.descripcion,
      req.body.desarrolladora,
      req.body.genero,
      req.body.url_imagen,
      req.body.consolas
    );
    
    console.log("PUT /api/juegos/:id - Resultado de updateJuego:", juego);
    
    if (!juego) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    
    res.json(juego);
  } catch (error) {
    console.error("Error detallado en PUT /api/juegos:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      where: error.where
    });
    
    // Manejo específico de errores de PostgreSQL
    if (error.code) {
      switch (error.code) {
        case '23502': // NOT NULL violation
          return res.status(400).json({ error: "Faltan campos obligatorios en la base de datos" });
        case '23505': // Unique violation
          return res.status(400).json({ error: "Ya existe un juego con ese nombre" });
        case '23503': // Foreign key violation
          return res.status(400).json({ error: "La desarrolladora seleccionada no existe" });
        case '22001': // String data right truncation
          return res.status(400).json({ error: "Uno de los campos excede el límite de caracteres permitido" });
        default:
          return res.status(500).json({ error: `Error de base de datos: ${error.message}` });
      }
    }
    
    return res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
});

// Consolas

app.get("/api/consolas", async (req, res) => {
  const consolas = await getAllConsolas();
  res.json(consolas);
});

app.get("/api/consolas/:id", async (req, res) => {
  const consola = await getOneConsola(req.params.id);
  if (!consola) {
    return res.status(404).json({ error: "Consola no encontrada" });
  }
  res.json(consola);
});

app.post("/api/consolas", async (req, res) => {
  if (
    !req.body.nombre ||
    !req.body.anio ||
    !req.body.descripcion ||
    !req.body.compania ||
    !req.body.url_imagen
  ) {
    return res
      .status(400)
      .json({ error: "Faltan datos para crear la consola" });
  }
  const nuevaConsola = await createConsola(
    req.body.nombre,
    req.body.anio,
    req.body.descripcion,
    req.body.compania,
    req.body.url_imagen
  );
  if (!nuevaConsola) {
    return res.status(500).json({ error: "Error al crear la consola" });
  }
  res.json(nuevaConsola);
});

app.delete("/api/consolas/:id", async (req, res) => {
  const consola = await deleteConsola(req.params.id);
  if (!consola) {
    return res.status(404).json({ error: "Consola no encontrada" });
  }
  res.json({ status: "OK", consolaEliminada: consola });
});

app.put("/api/consolas/:id", async (req, res) => {
  const consola = await updateConsola(
    req.params.id,
    req.body.nombre,
    req.body.anio,
    req.body.descripcion,
    req.body.compania,
    req.body.url_imagen
  );
  if (!consola) {
    return res.status(404).json({ error: "Consola no encontrada" });
  }
  res.json(consola);
});

// Desarrolladoras

app.get("/api/desarrolladoras", async (req, res) => {
  const desarrolladoras = await getAllDesarrolladoras();
  res.json(desarrolladoras);
});

app.get("/api/desarrolladoras/:id", async (req, res) => {
  const desarrolladora = await getOneDesarrolladora(req.params.id);
  if (!desarrolladora) {
    return res.status(404).json({ error: "Desarrolladora no encontrada" });
  }
  res.json(desarrolladora);
});

app.post("/api/desarrolladoras", async (req, res) => {
  if (!req.body.nombre || !req.body.fundacion) {
    return res
      .status(400)
      .json({ error: "Faltan datos para crear la desarrolladora" });
  }
  const nuevaDesarrolladora = await createDesarrolladora(
    req.body.nombre,
    req.body.fundacion,
    req.body.pais,
    req.body.descripcion,
    req.body.url_imagen
  );
  if (!nuevaDesarrolladora) {
    return res.status(500).json({ error: "Error al crear la desarrolladora" });
  }
  res.json(nuevaDesarrolladora);
});

app.delete("/api/desarrolladoras/:id", async (req, res) => {
  const desarrolladora = await deleteDesarrolladora(req.params.id);
  if (!desarrolladora) {
    return res.status(404).json({ error: "Desarrolladora no encontrada" });
  }
  res.json({ status: "OK", desarrolladoraEliminada: desarrolladora });
});

app.put("/api/desarrolladoras/:id", async (req, res) => {
  const desarrolladora = await updateDesarrolladora(
    req.params.id,
    req.body.nombre,
    req.body.fundacion,
    req.body.pais,
    req.body.descripcion,
    req.body.url_imagen
  );
  if (!desarrolladora) {
    return res.status(404).json({ error: "Desarrolladora no encontrada" });
  }
  res.json(desarrolladora);
});
