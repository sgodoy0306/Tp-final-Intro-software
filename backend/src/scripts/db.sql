
CREATE TABLE Desarrolladoras (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Fundacion INTEGER NOT NULL,
    "Pais de origen" VARCHAR(100),
    Fundador VARCHAR(1000),
    Descripcion VARCHAR(100)
);

CREATE TABLE Consolas (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100),
    Año INTEGER NOT NULL,
    Compañia VARCHAR(100),
    Formatos VARCHAR(100) NOT NULL, 
    Descripcion VARCHAR(1000),
    País VARCHAR(100) NOT NULL
);

CREATE TABLE Juegos (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Año INTEGER,
    Desarrolladora INTEGER NOT NULL REFERENCES Desarrolladoras(Id), -- foreign key
    Genero VARCHAR(100),
    Consola INTEGER NOT NULL REFERENCES Consolas(Id) -- foreign key
);

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
