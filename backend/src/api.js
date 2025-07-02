const express = require("express")

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

const {
  getAllJuegos,
  getOneJuego,
  createJuego,
  deleteJuego
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
  const nuevoJuego = await createJuego(req.body.nombre, req.body.año, req.body.desarrolladora, req.body.genero, req.body.consola)
  if (!nuevoJuego) {
    return res.status(500).json({ error: "Error al crear el juego" })
  }
  res.json(nuevoJuego)
})

app.delete("/api/juegos/:id", async (req, res) => {
  const juego = await deleteJuego(req.params.id)
  if (!juego) {
    return res.status(404).json({ error: "Personake id: " + id + " not found" })
  }
  res.json({ status: "OK", juegoEliminado: juego })
})
