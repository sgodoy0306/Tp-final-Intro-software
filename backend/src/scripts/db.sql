
CREATE TABLE Desarrolladoras (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Anio INTEGER,
    Origen VARCHAR(100),
    Descripcion VARCHAR(100),
    Url VARCHAR(500),
);

CREATE TABLE Consolas (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100),
    Anio INTEGER NOT NULL,
    Descripcion VARCHAR(500),
    Compania VARCHAR(100),
    Url VARCHAR(500),  
);

CREATE TABLE Juegos (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Anio INTEGER,
    Descripcion VARCHAR(100),
    Desarrolladora INTEGER NOT NULL REFERENCES Desarrolladoras(Id), -- foreign key
    Genero VARCHAR(100),
    Url VARCHAR(500),
);

CREATE TABLE Relacion (
    Juego_id INTEGER REFERENCES juegos (Id),
    Consolas_id INTEGER REFERENCES Consolas (Id),
    PRIMARY KEY (juego_id, Consolas_id)
)

-- inserts de ejemplo

INSERT INTO Desarrolladoras (Nombre, Fundacion, "Pais de origen", Fundador, Descripcion)
VALUES 
  ('Nintendo', 1889, 'Japón', 'Fusajiro Yamauchi', 'Pioneros en videojuegos'),
  ('Valve', 1996, 'USA', 'Gabe Newell', 'Creadores de Steam y Half-Life');

INSERT INTO Consolas (Nombre, Año, Compañia, Formatos, Descripcion, País)
VALUES
  ('Nintendo Switch', 2017, 'Nintendo', 'Cartucho', 'Consola híbrida portátil', 'Japón'),
  ('PC', 2000, 'Genérica', 'Digital', 'Computadora personal', 'Global');

INSERT INTO Juegos (Nombre, Año, Desarrolladora, Genero, Consola)
VALUES
  ('The Legend of Zelda: Breath of the Wild', 2017, 1, 'Aventura', 1),
  ('Half-Life 2', 2004, 2, 'FPS', 2),
  ('Portal', 2007, 2, 'Puzzle-FPS', 2);

INSERT INTO Relacion (juego_id, consola_id) 
VALUES (1, 1);