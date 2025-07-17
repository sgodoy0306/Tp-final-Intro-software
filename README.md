# Trabajo Final - Introducción al Desarrollo de Software - Camejo | 1C 2025 | FIUBA

**Integrantes del grupo:**
- Agustín Iván Gutiérrez Abad
- Santiago Godoy
- Fausto Giannotti

## Objetivo
Demostrar la comprensión de los conceptos vistos en clase y la habilidad para aplicarlos en la resolución de problemas, junto con el desarrollo de una idea creativa y propia.

## Acerca del proyecto
A través de una API REST, este proyecto permite gestionar un catálogo de juegos inspirado en los 2000s y los títulos más icónicos de esa época. Las entidades principales son **juegos**, **consolas** y **desarrolladoras**, y para cada una se implementan las operaciones *CRUD* (Crear, Leer, Actualizar, Eliminar).

Las desarrolladoras se vinculan a los juegos mediante una *foreign key*, y los juegos se asocian a sus consolas compatibles mediante una tabla de relación. Desde el frontend, se puede visualizar el catálogo de juegos y filtrarlo por cualquiera de los campos, incluyendo consolas compatibles y desarrolladoras.

Todo el entorno de ejecución está definido con Docker, lo que facilita tanto la configuración como el despliegue.

---

## Como ejecutar

Desde la carpeta del proyecto:
```bash
make run
```

Para frenar:
```bash
make stop
```

Para frenar y eliminar todo lo almacenado en la base de datos:
```bash
make kill
```

Para levantar el backend y frontend por separado:
```bash
make run-backend
make run-frontend
```

En caso de necesitar usar sudo para npm install, hacer:
```bash
cd ./backend && sudo npm install
cd ./frontend && sudo npm install
``` 





