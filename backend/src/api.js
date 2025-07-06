const express = require("express")

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

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
  updateDesarrolladora
} = require("./scripts/catalogo")

// Health route
app.get("/api/health", (req, res) => {
    res.json({ status: "OK" })
})

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT)
})

// Juegos

app.get("/api/juegos", async (req, res) => {
    const juegos = await getAllJuegos()
    res.json(juegos)
})

app.get("/api/juegos/:id", async (req, res) => {
    const juego = await getOneJuego(req.params.id)
    if (!juego) {
        return res.status(404).json({ error: "Juego no encontrado" })
    }
    res.json(juego)
})

app.post("/api/juegos", async (req, res) => {
  if (!req.body.nombre || !req.body.desarrolladora || !req.body.consola) {
    return res.status(400).json({ error: "Faltan datos para crear el juego" })
  }
  const nuevoJuego = await createJuego(req.body.nombre, req.body.año, req.body.desarrolladora, req.body.genero, req.body.ventas)
  if (!nuevoJuego) {
    return res.status(500).json({ error: "Error al crear el juego" })
  }
  res.json(nuevoJuego)
})

app.delete("/api/juegos/:id", async (req, res) => {
  const juego = await deleteJuego(req.params.id)
  if (!juego) {
    return res.status(404).json({ error: "Juego id: " + id + " not found" })
  }
  res.json({ status: "OK", juegoEliminado: juego })
})

app.post("/api/juegos/:id", async (req, res) => {
  const juego = await updateJuego(req.params.id, req.body.nombre, req.body.año, req.body.desarrolladora, req.body.genero, req.body.ventas)
  if (!juego) {
    return res.status(404).json({ error: "Juego no encontrado" })
  }
  res.json(juego)
})

// Consolas

app.get("/api/consolas", async (req, res) => {
    const consolas = await getAllConsolas()
    res.json(consolas)
})

app.get("/api/consolas/:id", async (req, res) => {
    const consola = await getOneConsola(req.params.id)
    if (!consola) {
        return res.status(404).json({ error: "Consola no encontrada" })
    }
    res.json(consola)
})

app.post("/api/consolas", async (req, res) => {
  if (!req.body.nombre || !req.body.formato) {
    return res.status(400).json({ error: "Faltan datos para crear la consola" })
  }
  const nuevaConsola = await createConsola(req.body.nombre, req.body.año, req.body.compañia, req.body.formato, req.body.descripcion)
  if (!nuevaConsola) {
    return res.status(500).json({ error: "Error al crear la consola" })
  }
  res.json(nuevaConsola)
})

app.delete("/api/consolas/:id", async (req, res) => {
  const consola = await deleteConsola(req.params.id)
  if (!consola) {
    return res.status(404).json({ error: "Consola no encontrada" })
  }
  res.json({ status: "OK", consolaEliminada: consola })
})

app.post("/api/consolas/:id", async (req, res) => {
  const consola = await updateConsola(req.params.id, req.body.nombre, req.body.año, req.body.compañia, req.body.formato, req.body.descripcion)
  if (!consola) {
    return res.status(404).json({ error: "Consola no encontrada" })
  }
  res.json(consola)
})

// Desarrolladoras

app.get("/api/desarrolladoras", async (req, res) => {
  const desarrolladoras = await getAllDesarrolladoras()
  res.json(desarrolladoras)
})

app.get("/api/desarrolladoras/:id", async (req, res) => {
  const desarrolladora = await getOneDesarrolladora(req.params.id)
  if (!desarrolladora) {
    return res.status(404).json({ error: "Desarrolladora no encontrada" })
  }
  res.json(desarrolladora)
})

app.post("/api/desarrolladoras", async (req, res) => {
  if (!req.body.nombre || !req.body.fundacion) {
    return res.status(400).json({ error: "Faltan datos para crear la desarrolladora" })
  }
  const nuevaDesarrolladora = await createDesarrolladora(
    req.body.nombre,
    req.body.fundacion,
    req.body.origen,
    req.body.fundador,
    req.body.descripcion
  )
  if (!nuevaDesarrolladora) {
    return res.status(500).json({ error: "Error al crear la desarrolladora" })
  }
  res.json(nuevaDesarrolladora)
})

app.delete("/api/desarrolladoras/:id", async (req, res) => {
  const desarrolladora = await deleteDesarrolladora(req.params.id)
  if (!desarrolladora) {
    return res.status(404).json({ error: "Desarrolladora no encontrada" })
  }
  res.json({ status: "OK", desarrolladoraEliminada: desarrolladora })
})

app.post("/api/desarrolladoras/:id", async (req, res) => {
  const desarrolladora = await updateDesarrolladora(
    req.params.id,
    req.body.nombre,
    req.body.fundacion,
    req.body.origen,
    req.body.fundador,
    req.body.descripcion
  )
  if (!desarrolladora) {
    return res.status(404).json({ error: "Desarrolladora no encontrada" })
  }
  res.json(desarrolladora)
})