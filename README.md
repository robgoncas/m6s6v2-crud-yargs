# CRUD con Node.js

CRUD es un acrónimo que representa las cuatro operaciones básicas que se pueden realizar en los datos:

- **C**reate (Crear)
- **R**ead (Leer)
- **U**pdate (Actualizar)
- **D**elete (Eliminar)

En este ejemplo, manejaremos un archivo de texto (`usuarios.txt`) que contiene un array de usuarios en formato JSON. Cada usuario tiene los siguientes campos: `nombre`, `email`, `telefono`, `mensaje`.

## Comandos CRUD usando Yargs

1. **Crear un nuevo usuario (`create`)**: Este comando agrega un nuevo usuario al archivo de texto.
2. **Leer usuarios (`read`)**: Este comando lee y muestra todos los usuarios almacenados.
3. **Actualizar un usuario (`update`)**: Este comando actualiza los datos de un usuario existente.
4. **Eliminar un usuario (`delete`)**: Este comando elimina un usuario del archivo.

### Ejemplos de uso en la terminal

- **Crear un usuario**:
  ```bash
  node usuarios.js create --nombre="Ana" --email="ana@example.com" --telefono="123456789" --mensaje="Hola, soy Ana"
  ```


### Código de ejemplo usando `yargs`:

```javascript
const fs = require('fs');
const yargs = require('yargs');

const filePath = 'usuarios.txt';

// Función para leer el archivo de usuarios (sin promises)
const leerUsuarios = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    return [];
  }
};

// Función para escribir en el archivo de usuarios (sin promises)
const escribirUsuarios = (usuarios) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
    console.log('Usuarios guardados correctamente.');
  } catch (error) {
    console.error('Error al escribir el archivo:', error);
  }
};

// Crear un nuevo usuario
const crearUsuario = (usuario) => {
  const usuarios = leerUsuarios();
  usuarios.push(usuario);
  escribirUsuarios(usuarios);
};

// Leer todos los usuarios
const mostrarUsuarios = () => {
  const usuarios = leerUsuarios();
  console.log(usuarios);
};

// Actualizar un usuario por índice
const actualizarUsuario = (indice, nuevoUsuario) => {
  const usuarios = leerUsuarios();
  if (indice >= 0 && indice < usuarios.length) {
    usuarios[indice] = { ...usuarios[indice], ...nuevoUsuario };
    escribirUsuarios(usuarios);
    console.log('Usuario actualizado.');
  } else {
    console.log('Usuario no encontrado.');
  }
};

// Eliminar un usuario por índice
const eliminarUsuario = (indice) => {
  const usuarios = leerUsuarios();
  if (indice >= 0 && indice < usuarios.length) {
    usuarios.splice(indice, 1);
    escribirUsuarios(usuarios);
    console.log('Usuario eliminado.');
  } else {
    console.log('Usuario no encontrado.');
  }
};

// Configuración de comandos
const configCommandCreate = {
  nombre: {
    describe: 'Nombre del usuario',
    demandOption: true,
    type: 'string',
  },
  email: {
    describe: 'Email del usuario',
    demandOption: true,
    type: 'string',
  },
  telefono: {
    describe: 'Teléfono del usuario',
    demandOption: true,
    type: 'string',
  },
  mensaje: {
    describe: 'Mensaje del usuario',
    demandOption: true,
    type: 'string',
  }
};

const configCommandRead = {}; // No requiere configuración específica

const configCommandUpdate = {
  indice: {
    describe: 'Índice del usuario a modificar',
    demandOption: true,
    type: 'number',
  },
  nombre: {
    describe: 'Nuevo nombre del usuario',
    type: 'string',
  },
  email: {
    describe: 'Nuevo email del usuario',
    type: 'string',
  },
  telefono: {
    describe: 'Nuevo teléfono del usuario',
    type: 'string',
  },
  mensaje: {
    describe: 'Nuevo mensaje del usuario',
    type: 'string',
  }
};

const configCommandDelete = {
  indice: {
    describe: 'Índice del usuario a eliminar',
    demandOption: true,
    type: 'number',
  }
};

// Definición de comandos usando yargs
yargs
  .command(
    'create',
    'Crear un nuevo usuario',
    configCommandCreate,
    (argv) => {
      const nuevoUsuario = {
        nombre: argv.nombre,
        email: argv.email,
        telefono: argv.telefono,
        mensaje: argv.mensaje
      };
      crearUsuario(nuevoUsuario);
    }
  )
  .command(
    'read',
    'Mostrar todos los usuarios',
    configCommandRead,
    () => {
      mostrarUsuarios();
    }
  )
  .command(
    'update',
    'Actualizar un usuario',
    configCommandUpdate,
    (argv) => {
      const nuevoUsuario = {
        nombre: argv.nombre,
        email: argv.email,
        telefono: argv.telefono,
        mensaje: argv.mensaje
      };
      actualizarUsuario(argv.indice, nuevoUsuario);
    }
  )
  .command(
    'delete',
    'Eliminar un usuario',
    configCommandDelete,
    (argv) => {
      eliminarUsuario(argv.indice);
    }
  )
  .help()
  .argv;

```

### Explicación del código:

1. **Comando `create`**: 
   - Este comando recibe cuatro argumentos: `nombre`, `email`, `telefono`, y `mensaje`. Utiliza esos datos para crear un nuevo usuario en el archivo.

   - Ejemplo en la terminal:
     ```bash
     node app.js create --nombre="Pedro" --email="pedro@example.com" --telefono="123456789" --mensaje="Hola, soy Pedro"
     ```

2. **Comando `read`**:
   - Muestra todos los usuarios registrados en el archivo.

   - Ejemplo en la terminal:
     ```bash
     node app.js read
     ```

3. **Comando `update`**: 
   - Este comando recibe el `indice` del usuario a modificar y los nuevos valores para las propiedades `nombre`, `email`, `telefono`, y `mensaje`. Modifica solo los valores proporcionados (deja los demás sin cambios).

   - Ejemplo en la terminal:
     ```bash
     node app.js update --indice=0 --nombre="Juan Actualizado"
     ```

4. **Comando `delete`**: 
   - Este comando recibe el `indice` del usuario que se desea eliminar.

   - Ejemplo en la terminal:
     ```bash
     node app.js delete --indice=1
     ```

### Uso del CRUD:

- Este código permite realizar todas las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre un archivo de texto que almacena un arreglo de usuarios en formato JSON.
- Los comandos se ejecutan mediante la terminal, y cada operación se realiza utilizando las funciones de Node.js para la lectura y escritura de archivos (`fs.promises`).

### Configuraciones:

- **`configCommandCreate`**: Define los parámetros necesarios para crear un nuevo usuario.
- **`configCommandRead`**: No requiere configuración adicional, simplemente lee y muestra los usuarios.
- **`configCommandUpdate`**: Permite actualizar datos del usuario basados en su índice en el arreglo.
- **`configCommandDelete`**: Elimina a un usuario específico según su índice.

Este código muestra cómo puedes integrar operaciones básicas CRUD usando `yargs` para gestionar los argumentos de la línea de comandos y `fs.promises` para trabajar con archivos de forma asíncrona.