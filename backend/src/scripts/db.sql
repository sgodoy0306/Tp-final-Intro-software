CREATE TABLE desarrolladoras (
  id SERIAL PRIMARY KEY, 
  nombre VARCHAR(100) NOT NULL,
  fundacion INTEGER NOT NULL,
  pais VARCHAR(100) NOT NULL,
  descripcion VARCHAR(200),
  url_imagen VARCHAR(200)
);

CREATE TABLE consolas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL, 
  lanzamiento INTEGER NOT NULL,
  descripcion VARCHAR(200),
  compania VARCHAR(100),
  url_imagen VARCHAR(200)
);

CREATE TABLE juegos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  anio INTEGER NOT NULL,
  descripcion VARCHAR(200),
  desarrolladora INTEGER NOT NULL REFERENCES desarrolladoras(id),
  genero VARCHAR(100),
  url_imagen VARCHAR(200)
);

CREATE TABLE relacion (
  juego_id INTEGER REFERENCES juegos(id),
  consola_id INTEGER REFERENCES consolas(id),
  PRIMARY KEY (juego_id, consola_id)
);

INSERT INTO desarrolladoras (nombre, fundacion, pais, descripcion, url_imagen) VALUES
('Nintendo', 1889, 'Japón', 'Pionera en videojuegos', 'https://ejemplo.com/nintendo.png'),
('Sony Interactive Entertainment', 1993, 'Japón', 'División de videojuegos de Sony', 'https://ejemplo.com/sony.png'),
('Valve Corporation', 1996, 'Estados Unidos', 'Desarrolladora de Steam y juegos icónicos', 'https://ejemplo.com/valve.png'),
('Rockstar Games', 1998, 'Estados Unidos', 'Famosos por GTA', 'https://ejemplo.com/rockstar.png'),
('CD Projekt', 1994, 'Polonia', 'Desarrolladora de The Witcher', 'https://ejemplo.com/cdprojekt.png');

INSERT INTO consolas (nombre, lanzamiento, descripcion, compania, url_imagen) VALUES
('Nintendo Switch', 2017, 'Consola híbrida portátil', 'Nintendo', 'https://ejemplo.com/switch.png'),
('PlayStation 4', 2013, 'Consola de octava generación', 'Sony', 'https://ejemplo.com/ps4.png'),
('Xbox One', 2013, 'Consola de Microsoft', 'Microsoft', 'https://ejemplo.com/xboxone.png'),
('Steam Deck', 2022, 'Consola portátil de Valve', 'Valve', 'https://ejemplo.com/steamdeck.png'),
('PlayStation 5', 2020, 'Consola de nueva generación', 'Sony', 'https://ejemplo.com/ps5.png');

INSERT INTO juegos (nombre, anio, descripcion, desarrolladora, genero, url_imagen) VALUES
('The Legend of Zelda: Breath of the Wild', 2017, 'Aventura en mundo abierto', 1, 'Aventura', 'https://ejemplo.com/zelda.png'),
('God of War', 2018, 'Acción y mitología nórdica', 2, 'Acción', 'https://ejemplo.com/godofwar.png'),
('Grand Theft Auto V', 2013, 'Acción y mundo abierto', 4, 'Acción', 'https://ejemplo.com/gta.png'),
('The Witcher 3: Wild Hunt', 2015, 'RPG en mundo abierto', 5, 'RPG', 'https://ejemplo.com/witcher3.png'),
('Half-Life: Alyx', 2020, 'Shooter en VR', 3, 'Shooter', 'https://ejemplo.com/alyx.png');

INSERT INTO relacion (juego_id, consola_id) VALUES
(1, 1),
(2, 2),
(3, 2),
(3, 3),
(4, 2),
(4, 3),
(4, 1),
(5, 4),
(5, 3),
(5, 2);