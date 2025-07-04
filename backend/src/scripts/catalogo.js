const { Pool } = require('pg');

const dbClient = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_back',
  password: 'password',
  port: 5432,
});

async function getAllJuegos() {
  const result = await dbClient.query('SELECT * FROM Juegos')
  return result.rows
}

async function getOneJuego(id) {
  const result = await dbClient.query('SELECT * FROM Juegos WHERE id= $1 LIMIT 1', [id])
  return result.rows[0]
}

async function createJuego(Nombre, Año, Desarrolladora, Genero, Consola) {
    const result = await dbClient.query(
        'INSERT INTO Juegos (Nombre, Año, Desarrolladora, Genero, Consola) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [Nombre, Año, Desarrolladora, Genero, Consola])
    return result.rows[0]
}

async function deleteJuego(id) {
    const result = dbClient.query('DELETE FROM juegos WHERE id = $1 RETURNING *', [id])
    if ((await result).rowCount === 0) {
        return undefined
    }
    return result.rows[0]
}

module.exports = {
  getAllJuegos,
  getOneJuego,
  createJuego,
  deleteJuego,
  //updateJuego
}; 