const { Pool } = require("pg");

const dbClient = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_back",
  password: "password",
  port: 5432,
});

// Juegos

async function getAllJuegos() {
  const result = await dbClient.query("SELECT * FROM juegos");
  return result.rows;
}

async function getOneJuego(id) {
  const result = await dbClient.query(
    "SELECT * FROM juegos WHERE id = $1 LIMIT 1",
    [id]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const juego = result.rows[0];

  // Seleccionar consolas compatibles:
  // 1ero selecciona filas donde relacion.juego_id = id (i.e. compatibles)
  // 2do, selecciona consolas.nombre donde relacion.consola_id = consolas.id
  // devuelve un array de objetos con id y nombre de la consola
  const consolasCompatibles = await dbClient.query(
    `SELECT
    consolas.nombre AS consola,
    consolas.id AS id
    FROM relacion
    JOIN consolas ON relacion.consola_id = consolas.id
    WHERE relacion.juego_id = $1`,
    [id]
  );

  juego.consolas = consolasCompatibles.rows.map((row) => ({
    id: row.id,
    nombre: row.consola,
  }));

  return juego;
}

// consolas puede ser un array de ids o un solo id
async function createJuego(
  nombre,
  descripcion,
  desarrolladora,
  genero,
  url_imagen,
  consolas
) {
  const result = await dbClient.query(
    "INSERT INTO juegos (nombre, descripcion, desarrolladora, genero, url_imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre, descripcion, desarrolladora, genero, url_imagen]
  );
  // Relacionar con consolas
  if (Array.isArray(consolas)) {
    for (const consolaId of consolas) {
      await dbClient.query(
        "INSERT INTO relacion (juego_id, consola_id) VALUES ($1, $2)",
        [result.rows[0].id, consolaId]
      );
    }
  } else if (consolas) {
    await dbClient.query(
      "INSERT INTO relacion (juego_id, consola_id) VALUES ($1, $2)",
      [result.rows[0].id, consolas]
    );
  }
  return result.rows[0];
}

async function deleteJuego(id) {
  await dbClient.query("DELETE FROM relacion WHERE juego_id = $1", [id]);
  const result = await dbClient.query(
    "DELETE FROM juegos WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

async function updateJuego(
  id,
  nombre,
  descripcion,
  desarrolladora,
  genero,
  url_imagen,
  consolas
) {
  const result = await dbClient.query(
    "UPDATE juegos SET nombre = $2, descripcion = $3, desarrolladora = $4, genero = $5, url_imagen = $6 WHERE id = $1 RETURNING *",
    [id, nombre, descripcion, desarrolladora, genero, url_imagen]
  );
  if (consolas) {
    await dbClient.query("DELETE FROM relacion WHERE juego_id = $1", [id]);
    if (Array.isArray(consolas)) {
      for (const consolaId of consolas) {
        await dbClient.query(
          "INSERT INTO relacion (juego_id, consola_id) VALUES ($1, $2)",
          [id, consolaId]
        );
      }
    } else {
      await dbClient.query(
        "INSERT INTO relacion (juego_id, consola_id) VALUES ($1, $2)",
        [id, consolas]
      );
    }
  }
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

// Consolas

async function getAllConsolas() {
  const result = await dbClient.query("SELECT * FROM consolas");
  return result.rows;
}

async function getOneConsola(id) {
  const result = await dbClient.query(
    "SELECT * FROM consolas WHERE id = $1 LIMIT 1",
    [id]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const consola = result.rows[0];

  // Seleccionar juegos compatibles:
  // 1ero selecciona filas donde relacion.consola_id = id (i.e. compatibles)
  // 2do, selecciona juegos.nombre donde relacion.juego_id = juegos.id
  // devuelve un array de objetos con id y nombre de los juegos
  const juegosCompatibles = await dbClient.query(
    `SELECT 
    juegos.nombre AS juego,
    juegos.id AS id
    FROM relacion
    JOIN juegos ON relacion.juego_id = juegos.id
    WHERE relacion.consola_id = $1`,
    [id]
  );

  consola.juegos = juegosCompatibles.rows.map((row) => ({
    id: row.id,
    nombre: row.juego,
  }));

  return consola;
}

async function createConsola(
  nombre,
  lanzamiento,
  descripcion,
  compania,
  url_imagen
) {
  const result = await dbClient.query(
    "INSERT INTO consolas (nombre, lanzamiento, descripcion, compania, url_imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre, lanzamiento, descripcion, compania, url_imagen]
  );
  return result.rows[0];
}

async function deleteConsola(id) {
  await dbClient.query("DELETE FROM relacion WHERE consola_id = $1", [id]);
  const result = await dbClient.query(
    "DELETE FROM consolas WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

async function updateConsola(
  id,
  nombre,
  lanzamiento,
  descripcion,
  compania,
  url_imagen
) {
  const result = await dbClient.query(
    "UPDATE consolas SET nombre = $2, lanzamiento = $3, descripcion = $4, compania = $5, url_imagen = $6 WHERE id = $1 RETURNING *",
    [id, nombre, lanzamiento, descripcion, compania, url_imagen]
  );
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

// Desarrolladoras

async function getAllDesarrolladoras() {
  const result = await dbClient.query("SELECT * FROM desarrolladoras");
  return result.rows;
}

async function getOneDesarrolladora(id) {
  const result = await dbClient.query(
    "SELECT * FROM desarrolladoras WHERE id = $1 LIMIT 1",
    [id]
  );
  return result.rows[0];
}

async function createDesarrolladora(
  nombre,
  fundacion,
  pais,
  descripcion,
  url_imagen
) {
  const result = await dbClient.query(
    "INSERT INTO desarrolladoras (nombre, fundacion, pais, descripcion, url_imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre, fundacion, pais, descripcion, url_imagen]
  );
  return result.rows[0];
}

async function deleteDesarrolladora(id) {
  const result = await dbClient.query(
    "DELETE FROM desarrolladoras WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

async function updateDesarrolladora(
  id,
  nombre,
  fundacion,
  pais,
  descripcion,
  url_imagen
) {
  const result = await dbClient.query(
    "UPDATE desarrolladoras SET nombre = $2, fundacion = $3, pais = $4, descripcion = $5, url_imagen = $6 WHERE id = $1 RETURNING *",
    [id, nombre, fundacion, pais, descripcion, url_imagen]
  );
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

module.exports = {
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
};
