const { Pool } = require("pg");

const dbClient = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Juegos

async function getAllJuegos() {
  const result = await dbClient.query(`
    SELECT
      juegos.id,
      juegos.nombre,
      juegos.anio,
      juegos.descripcion,
      juegos.genero,
      juegos.url_imagen,
      juegos.desarrolladora, -- ID de la desarrolladora
      desarrolladoras.nombre AS nombre_desarrolladora,
      consolas.id AS consola_id,
      consolas.nombre AS consola_nombre
    FROM juegos
    JOIN desarrolladoras ON juegos.desarrolladora = desarrolladoras.id
    LEFT JOIN relacion ON juegos.id = relacion.juego_id
    LEFT JOIN consolas ON relacion.consola_id = consolas.id
    ORDER BY juegos.id;
  `);

  const juegosMap = {};

  result.rows.forEach((row) => {
    if (!juegosMap[row.id]) {
      juegosMap[row.id] = {
        id: row.id,
        nombre: row.nombre,
        anio: row.anio,
        descripcion: row.descripcion,
        genero: row.genero,
        url_imagen: row.url_imagen,
        desarrolladora: row.desarrolladora, // ID de la desarrolladora
        desarrolladora_nombre: row.nombre_desarrolladora, // Nombre de la desarrolladora
        consolas: [],
      };
    }
    if (row.consola_id) {
      juegosMap[row.id].consolas.push({
        id: row.consola_id,
        nombre: row.consola_nombre,
      });
    }
  });

  return Object.values(juegosMap);
}

async function getOneJuego(id) {
  const result = await dbClient.query(
    `SELECT 
       juegos.*, 
       desarrolladoras.nombre AS nombre_desarrolladora
     FROM juegos
     JOIN desarrolladoras ON juegos.desarrolladora = desarrolladoras.id
     WHERE juegos.id = $1
     LIMIT 1`,
    [id]
  );

  if (result.rowCount === 0) return undefined;

  const juego = result.rows[0];

  // Mantener el ID de la desarrolladora en el campo desarrolladora
  // y agregar el nombre en un campo separado para referencia
  juego.desarrolladora_nombre = juego.nombre_desarrolladora;
  delete juego.nombre_desarrolladora;

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
  anio,
  descripcion,
  desarrolladora,
  genero,
  url_imagen,
  consolas
) {
  const result = await dbClient.query(
    "INSERT INTO juegos (nombre, anio, descripcion, desarrolladora, genero, url_imagen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [nombre, anio, descripcion, desarrolladora, genero, url_imagen]
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
  anio,
  descripcion,
  desarrolladora,
  genero,
  url_imagen,
  consolas
) {
  try {
    console.log("updateJuego - Parámetros recibidos:", {
      id,
      nombre,
      anio,
      descripcion,
      desarrolladora,
      genero,
      url_imagen,
      consolas
    });

    // Iniciar transacción
    await dbClient.query('BEGIN');

    // Actualizar el juego
    const result = await dbClient.query(
      "UPDATE juegos SET nombre = $2, anio = $3, descripcion = $4, desarrolladora = $5, genero = $6, url_imagen = $7 WHERE id = $1 RETURNING *",
      [id, nombre, anio, descripcion, desarrolladora, genero, url_imagen]
    );

    console.log("updateJuego - Resultado de UPDATE:", result);

    if (result.rowCount === 0) {
      await dbClient.query('ROLLBACK');
      return undefined;
    }

    // Manejar las consolas si se proporcionan
    if (consolas) {
      console.log("updateJuego - Actualizando relaciones de consolas");
      
      // Eliminar relaciones existentes
      await dbClient.query("DELETE FROM relacion WHERE juego_id = $1", [id]);
      
      // Agregar nuevas relaciones
      if (Array.isArray(consolas)) {
        for (const consolaId of consolas) {
          console.log("updateJuego - Insertando relación con consola ID:", consolaId);
          await dbClient.query(
            "INSERT INTO relacion (juego_id, consola_id) VALUES ($1, $2)",
            [id, consolaId]
          );
        }
      } else {
        console.log("updateJuego - Insertando relación única con consola ID:", consolas);
        await dbClient.query(
          "INSERT INTO relacion (juego_id, consola_id) VALUES ($1, $2)",
          [id, consolas]
        );
      }
    }

    // Confirmar transacción
    await dbClient.query('COMMIT');
    
    console.log("updateJuego - Transacción completada exitosamente");
    return result.rows[0];
    
  } catch (error) {
    console.error("updateJuego - Error en la transacción:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail
    });
    
    // Rollback en caso de error
    try {
      await dbClient.query('ROLLBACK');
    } catch (rollbackError) {
      console.error("updateJuego - Error en rollback:", rollbackError);
    }
    
    throw error;
  }
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

async function createConsola(nombre, anio, descripcion, compania, url_imagen) {
  const result = await dbClient.query(
    "INSERT INTO consolas (nombre, lanzamiento, descripcion, compania, url_imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre, anio, descripcion, compania, url_imagen]
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
  anio,
  descripcion,
  compania,
  url_imagen
) {
  const result = await dbClient.query(
    "UPDATE consolas SET nombre = $2, lanzamiento = $3, descripcion = $4, compania = $5, url_imagen = $6 WHERE id = $1 RETURNING *",
    [id, nombre, anio, descripcion, compania, url_imagen]
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
