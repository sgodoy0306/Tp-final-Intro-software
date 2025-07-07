create table desarrolladoras (
id serial primary key, 
Nombre VARCHAR(100) not null,
Fundacion INTEGER not null,
Pais VARCHAR(100) not null,
Descripcion VARCHAR(100),
URL_IMAGEN VARCHAR(200))


create table consolas(
id serial primary key,
Nombre varchar(100) not null, 
Fundacion INTEGER not null,
Descripcion VARCHAR(100),
Compañia VARCHAR(100),
URL_IMAGEN VARCHAR(200))

create table juegos(
id serial primary key,
Nombre varchar(100) not null, 
Descripcion VARCHAR(100),
Desarrolladora integer not null references desarrolladoras(id),
Consolas integer not null references consolas(id),
Genero Varchar(100),
URL_IMAGEN VARCHAR(200))

CREATE TABLE Relacion (
    juego_id INTEGER REFERENCES juegos (Id),
    consolas_id INTEGER REFERENCES Consolas (Id),
    PRIMARY KEY (juego_id, Consolas_id)
)

INSERT INTO desarrolladoras (Nombre, Fundacion, Pais, Descripcion, URL_IMAGEN) VALUES
('Nintendo', 1889, 'Japón', 'Pionera en videojuegos', 'https://ejemplo.com/nintendo.png'),
('Sony Interactive Entertainment', 1993, 'Japón', 'División de videojuegos de Sony', 'https://ejemplo.com/sony.png'),
('Valve Corporation', 1996, 'Estados Unidos', 'Desarrolladora de Steam y juegos icónicos', 'https://ejemplo.com/valve.png'),
('Rockstar Games', 1998, 'Estados Unidos', 'Famosos por GTA', 'https://ejemplo.com/rockstar.png'),
('CD Projekt', 1994, 'Polonia', 'Desarrolladora de The Witcher', 'https://ejemplo.com/cdprojekt.png');

INSERT INTO consolas (Nombre, Fundacion, Descripcion, Compañia, URL_IMAGEN) VALUES
('Nintendo Switch', 2017, 'Consola híbrida portátil', 'Nintendo', 'https://ejemplo.com/switch.png'),
('PlayStation 4', 2013, 'Consola de octava generación', 'Sony', 'https://ejemplo.com/ps4.png'),
('Xbox One', 2013, 'Consola de Microsoft', 'Microsoft', 'https://ejemplo.com/xboxone.png'),
('Steam Deck', 2022, 'Consola portátil de Valve', 'Valve', 'https://ejemplo.com/steamdeck.png'),
('PlayStation 5', 2020, 'Consola de nueva generación', 'Sony', 'https://ejemplo.com/ps5.png');

INSERT INTO juegos (Nombre, Descripcion, Desarrolladora, Consolas, Genero, URL_IMAGEN) VALUES
('The Legend of Zelda: Breath of the Wild', 'Aventura en mundo abierto', 1, 1, 'Aventura', 'https://ejemplo.com/zelda.png'),
('God of War', 'Acción y mitología nórdica', 2, 2, 'Acción', 'https://ejemplo.com/godofwar.png'),
('Grand Theft Auto V', 'Acción y mundo abierto', 4, 3, 'Acción', 'https://ejemplo.com/gta.png'),
('The Witcher 3: Wild Hunt', 'RPG en mundo abierto', 5, 2, 'RPG', 'https://ejemplo.com/witcher3.png'),
('Half-Life: Alyx', 'Shooter en VR', 3, 4, 'Shooter', 'https://ejemplo.com/alyx.png');

INSERT INTO Relacion (juego_id, consolas_id) VALUES
(1, 1), -- Zelda en Switch
(2, 2), -- God of War en PS4
(3, 2), -- GTA V en PS4
(3, 3), -- GTA V en Xbox One
(4, 2), -- Witcher 3 en PS4
(4, 3), -- Witcher 3 en Xbox One
(4, 1), -- Witcher 3 en Switch
(5, 4), -- Half-Life Alyx en Steam Deck
(5, 3), -- Half-Life Alyx en Xbox One
(5, 2); -- Half-Life Alyx en PS4




