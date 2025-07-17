CREATE TABLE desarrolladoras (
  id SERIAL PRIMARY KEY, 
  nombre VARCHAR(100) NOT NULL,
  fundacion INTEGER NOT NULL,
  pais VARCHAR(100) NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  url_imagen VARCHAR(200) NOT NULL
);

CREATE TABLE consolas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL, 
  lanzamiento INTEGER NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  compania VARCHAR(100) NOT NULL,
  url_imagen VARCHAR(200) NOT NULL
);

CREATE TABLE juegos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  anio INTEGER NOT NULL,
  descripcion VARCHAR(200),
  desarrolladora INTEGER NOT NULL REFERENCES desarrolladoras(id),
  genero VARCHAR(100) NOT NULL,
  url_imagen VARCHAR(200) NOT NULL
);

CREATE TABLE relacion (
  juego_id INTEGER REFERENCES juegos(id),
  consola_id INTEGER REFERENCES consolas(id),
  PRIMARY KEY (juego_id, consola_id)
);

-------------------- Insertar datos de ejemplo -------------------- 

INSERT INTO desarrolladoras (nombre, fundacion, pais, descripcion, url_imagen) VALUES
('HAL Laboratory, Inc.', 1980, 'Japón', 'Desarrolladora japonesa conocida por la saga Kirby y Smash Bros.', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/HAL_Laboratory_Logo.svg/1200px-HAL_Laboratory_Logo.svg.png'),
('Capcom', 1979, 'Japón', 'Famosa por Resident Evil y Street Fighter.', 'https://static.wikia.nocookie.net/zombie/images/9/9f/Capcom-logo.jpg/revision/latest?cb=20131129210442&path-prefix=es'),
('Nintendo EAD', 1983, 'Japón', 'División interna de Nintendo.', 'https://yt3.googleusercontent.com/HNg_MA3lYwk6JCHxftRxRUAcMFK0334jI3-G-ERWMnTe5vIT1fORQ2er531XI_eCnMl4v_Wtk38=s900-c-k-c0x00ffffff-no-rj'),
('Retro Studios', 1998, 'EEUU', 'Estudio responsable de Metroid Prime.', 'https://media.licdn.com/dms/image/v2/C4E0BAQHistACZInGyQ/company-logo_200_200/company-logo_200_200/0/1644979244458/retro_studios_logo?e=2147483647&v=beta&t=_j0H8BhPFvHZvTtFHbiuHT5LAH7qj99jadPN-1kkpIg'),
('Rockstar North', 1984, 'Escocia', 'Creador de la saga GTA.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_cSEt3lZHuWZu8Cc9mO0lw-02fjDZClgPCg&s'),
('Konami', 1969, 'Japón', 'Metal Gear, Castlevania.', 'https://yt3.googleusercontent.com/ytc/AIdro_l69Fpcktv0EgP7H7dj9WUSYoUGiWc2SQmGfaGDdjrF9Y0=s900-c-k-c0x00ffffff-no-rj'),
('Square Enix', 2003, 'Japón', 'Final Fantasy y Dragon Quest.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcQaGBmKRoT3P6_eyMKjoCXMNrOpcWMvxgGg&s'),
('Santa Monica Studio', 1999, 'EEUU', 'Creador de God of War.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJCn9XkB2-RCWJhZESQwsh4k-koqjbK8CL3Q&s'),
('Team ICO', 1997, 'Japón', 'Shadow of the Colossus.', 'https://upload.wikimedia.org/wikipedia/commons/9/99/Ico-logo.svg'),
('Bungie', 1991, 'EEUU', 'Halo.', 'https://static.wikia.nocookie.net/bungie/images/a/af/2560px-Bungie_Logo_-_Official.jpg/revision/latest?cb=20240414211930'),
('Bizarre Creations', 1988, 'Reino Unido', 'Project Gotham Racing.', 'https://upload.wikimedia.org/wikipedia/en/9/98/Bizarre_creations_logo.png'),
('Team Ninja', 1995, 'Japón', 'Ninja Gaiden, Dead or Alive.', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/Team_Ninja.svg/640px-Team_Ninja.svg.png'),
('Oddworld Inhabitants', 1994, 'EEUU', 'Oddworld.', 'https://upload.wikimedia.org/wikipedia/en/1/1b/OddworldInhabitants.png'),
('Lionhead Studios', 1997, 'Reino Unido', 'Fable.', 'https://upload.wikimedia.org/wikipedia/en/d/dc/Lionhead_Studios_Logo.png');


INSERT INTO consolas (nombre, lanzamiento, descripcion, compania, url_imagen) VALUES
('GameCube', 2001, 'Consola de Nintendo de sexta generación.', 'Nintendo', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRDXIG25QQp1_Si5a9fQPgrZ9b4b2bcqdqeg&s'),
('PlayStation 2', 2000, 'Consola más vendida de la historia.', 'Sony', 'https://logos-world.net/wp-content/uploads/2023/03/PS2-Symbol.png'),
('Xbox', 2001, 'Primera consola de Microsoft.', 'Microsoft', 'https://assets.turbologo.com/blog/es/2019/11/19132903/xbox-logo-cover.jpg');

INSERT INTO juegos (nombre, anio, descripcion, desarrolladora, genero, url_imagen) VALUES
('Super Smash Bros. Melee', 2001, 'Juego de lucha crossover.', 1, 'lucha', 'https://ssb.wiki.gallery/images/5/55/SsbmBoxart.jpg'),
('Resident Evil 4', 2005, 'Survival horror revolucionario.', 2, 'survival-horror', 'https://upload.wikimedia.org/wikipedia/en/d/d9/Resi4-gc-cover.jpg'),
('The Legend of Zelda: The Wind Waker', 2003, 'Aventura en un vasto océano.', 3, 'aventura', 'https://assets1.ignimgs.com/2019/06/04/legend-of-zelda-the-wind-waker---button-1559683061504.jpg'),
('Metroid Prime', 2002, 'Shooter en primera persona.', 4, 'shooter', 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000063709/32b85837beea0eee31220a59e247219662de4011f7a8c18fce61cf99a4933eb7'),
('Grand Theft Auto: San Andreas', 2004, 'Sandbox criminal.', 5, 'accion', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBVU04u_5Uo8doQHNGGNeD83A4lfYPd764TA&s'),
('Metal Gear Solid 2: Sons of Liberty', 2001, 'Juego de espionaje.', 6, 'accion', 'https://upload.wikimedia.org/wikipedia/en/6/6a/Metalgear2boxart.jpg'),
('Final Fantasy X', 2001, 'RPG japonés clásico.', 7, 'rpg', 'https://upload.wikimedia.org/wikipedia/en/a/a7/Ffxboxart.jpg'),
('God of War', 2005, 'Acción mitológica.', 8, 'accion', 'https://upload.wikimedia.org/wikipedia/en/b/b5/God_of_War_%282005%29_cover.jpg'),
('Shadow of the Colossus', 2005, 'Aventura épica.', 9, 'aventura', 'https://upload.wikimedia.org/wikipedia/en/f/f8/Shadow_of_the_Colossus_%282005%29_cover.jpg'),
('Halo: Combat Evolved', 2001, 'Shooter espacial.', 10, 'shooter', 'https://upload.wikimedia.org/wikipedia/en/8/80/Halo_-_Combat_Evolved_%28XBox_version_-_box_art%29.jpg'),
('Project Gotham Racing', 2001, 'Juego de carreras.', 11, 'carreras', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/Project_Gotham_Racing_Coverart.png/250px-Project_Gotham_Racing_Coverart.png'),
('Dead or Alive 3', 2001, 'Juego de lucha.', 12, 'lucha', 'https://upload.wikimedia.org/wikipedia/en/2/26/Dead_or_Alive_3_cover_art.png'),
('Oddworld: Munch''s Oddysee', 2001, 'Plataformas con puzzles.', 13, 'plataformas', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/20/Oddworld_-_Munch%27s_Oddysee_Coverart.png/250px-Oddworld_-_Munch%27s_Oddysee_Coverart.png'),
('Fable', 2004, 'RPG con elecciones.', 14, 'rpg', 'https://m.media-amazon.com/images/I/91VQbs2RLFL._UF1000,1000_QL80_.jpg'),
('Ninja Gaiden', 2004, 'Juego de acción hardcore.', 12, 'accion', 'https://image.api.playstation.com/vulcan/ap/rnd/202102/2510/O2Fyg2CRPDIQ5B1QYX4LZrF8.png');

-- Super Smash Bros. Melee - GameCube
INSERT INTO relacion VALUES (1, 1);

-- Resident Evil 4 - PlayStation 2, GameCube
INSERT INTO relacion VALUES (2, 2);
INSERT INTO relacion VALUES (2, 1);

-- Zelda Wind Waker - GameCube
INSERT INTO relacion VALUES (3, 1);

-- Metroid Prime - GameCube
INSERT INTO relacion VALUES (4, 1);

-- GTA San Andreas - PlayStation 2, Xbox
INSERT INTO relacion VALUES (5, 2);
INSERT INTO relacion VALUES (5, 3);

-- Metal Gear Solid 2 - PlayStation 2, Xbox
INSERT INTO relacion VALUES (6, 2);
INSERT INTO relacion VALUES (6, 3);

-- Final Fantasy X - PlayStation 2
INSERT INTO relacion VALUES (7, 2);

-- God of War - PlayStation 2
INSERT INTO relacion VALUES (8, 2);

-- Shadow of the Colossus - PlayStation 2
INSERT INTO relacion VALUES (9, 2);

-- Halo - Xbox
INSERT INTO relacion VALUES (10, 3);

-- Project Gotham Racing - Xbox
INSERT INTO relacion VALUES (11, 3);

-- Dead or Alive 3 - Xbox
INSERT INTO relacion VALUES (12, 3);

-- Oddworld: Munch's Oddysee - Xbox
INSERT INTO relacion VALUES (13, 3);

-- Fable - Xbox
INSERT INTO relacion VALUES (14, 3);

-- Ninja Gaiden - Xbox
INSERT INTO relacion VALUES (15, 3);
