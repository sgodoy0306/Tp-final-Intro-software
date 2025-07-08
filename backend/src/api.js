const express = require("express")

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

const {
  getAllJuegos,
  getOneJuego,
  createJuego,
  deleteJuego,
  updateJuego
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

app.put("/api/juegos", async (req, res) => {
  if (!req.body.nombre || !req.body.desarrolladora || !req.body.consola) {
    return res.status(400).json({ error: "Faltan datos para crear el juego" })
  }
  const nuevoJuego = await createJuego(req.body.nombre, req.body.anio, req.body.desarrolladora, req.body.genero, req.body.ventas)
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

app.put("/api/juegos/:id", async (req, res) => {
  const juego = await updateJuego(req.params.id, req.body.nombre, req.body.anio, req.body.desarrolladora, req.body.genero, req.body.ventas)
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

app.put("/api/consolas", async (req, res) => {
  if (!req.body.nombre || !req.body.formato) {
    return res.status(400).json({ error: "Faltan datos para crear la consola" })
  }
  const nuevaConsola = await createConsola(req.body.nombre, req.body.anio, req.body.compania, req.body.formato, req.body.descripcion)
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

app.put("/api/consolas/:id", async (req, res) => {
  const consola = await updateConsola(req.params.id, req.body.nombre, req.body.anio, req.body.compania, req.body.formato, req.body.descripcion)
  if (!consola) {
    return res.status(404).json({ error: "Consola no encontrada" })
  }
  res.json(consola)
})