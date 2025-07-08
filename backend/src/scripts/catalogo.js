const { Pool } = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_back',
  password: 'password',
  port: 5432,
});


// Juegos

async function getAllJuegos() {
  const result = await dbClient.query('SELECT * FROM Juegos')
  return result.rows
}

async function getOneJuego(id) {
  const result = await dbClient.query('SELECT * FROM Juegos WHERE id= $1 LIMIT 1', [id])
  return result.rows[0]
}

async function createJuego(Nombre, Anio, Desarrolladora, Genero, Consola) {
    const result = await dbClient.query(
        'INSERT INTO Juegos (Nombre, Anio, Desarrolladora, Genero) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [Nombre, Anio, Desarrolladora, Genero])
      for (const consola of Consola) { 
        await dbClient.query(
          'INSERT INTO Relacion (Juego_id, Consola_id) VALUES ($1, $2)',
          [result.rows[0].id, consola])
      }
    return result.rows[0]
}

async function deleteJuego(id) {
    await dbClient.query('DELETE FROM Relacion WHERE juego_id = $1', [id])
    const result = dbClient.query('DELETE FROM juegos WHERE id = $1 RETURNING *', [id])
    if ((await result).rowCount === 0) {
        return undefined
    }
    return result.rows[0]
}

async function updateJuego(id, Nombre, Anio, Desarrolladora, Genero, Consola) {
    const result = await dbClient.query(
        'UPDATE Juegos SET Nombre = $2, Anio = $3, Desarrolladora = $4, Genero = $5 WHERE id = $6 RETURNING *',
        [id, Nombre, Anio, Desarrolladora, Genero])
    for (const consola of Consola) {
      await dbClient.query('UPDATE Relacion SET Consola_id = $2 WHERE Juego_id = $1', [id, consola])
    }
    if (result.rowCount === 0) {
        return undefined
    }
    return result.rows[0]
}

module.exports = {
  getAllJuegos,
  getOneJuego,
  createJuego,
  deleteJuego,
  updateJuego
}; 


// Consolas

async function getAllConsolas() {
  const result = await dbClient.query('SELECT * FROM Consolas')
  return result.rows
}

async function getOneConsola(id) {
  const result = await dbClient.query('SELECT * FROM Consolas WHERE id= $1 LIMIT 1', [id])
  return result.rows[0]
}

async function createConsola(Nombre, Anio, Compania, Formatos, Descripcion) {
    const result = await dbClient.query(
        'INSERT INTO Consolas (Nombre, Anio, Compania, Formatos, Descripcion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [Nombre, Anio, Compania, Formatos, Descripcion])
    return result.rows[0]
}

async function deleteConsola(id) {
    const result = await dbClient.query('DELETE FROM Consolas WHERE id = $1 RETURNING *', [id])
    if (result.rowCount === 0) {
        return undefined
    }
    await dbClient.query('DELETE FROM Relacion WHERE Consolas_id = $1', [id])
    return result.rows[0]
}

async function updateConsola(id, Nombre, Anio, Compania, Formatos, Descripcion) {
    const result = await dbClient.query(
        'UPDATE Consolas SET Nombre = $2, Anio = $3, Compania = $4, Formatos = $5, Descripcion = $6 WHERE id = $1 RETURNING *',
        [id, Nombre, Anio, Compania, Formatos, Descripcion])
    if (result.rowCount === 0) {
        return undefined
    }
    return result.rows[0]
}

module.exports = {
  getAllConsolas,
  getOneConsola,
  createConsola,
  deleteConsola,
  updateConsola
};