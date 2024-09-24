const fs = require('fs');
const yargs = require('yargs');

const filePath = 'usuarios.txt';

//OUTPUT TXT
const leerUsuarios = () => {
    try {
        let data = fs.readFileSync(filePath, 'utf8');
        if(data.trim()== ""){
            return [];
        } else{
            return JSON.parse(data);
        }

    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return [];
    }
};

//INPUT TXT
const escribirUsuarios = (usuarios) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(usuarios , null, 2));
        console.log('Usuarios guardados correctamente.');
    } catch (error) {
        console.error('Error al escribir el archivo:', error);
    }
};

//CREATE
const crearUsuario = (usuario) => {
    const usuarios = leerUsuarios();
    usuarios.push(usuario);
    escribirUsuarios(usuarios);
};

//READ
const mostrarUsuarios = () => {
    const usuarios = leerUsuarios();
    console.log(usuarios);
};

//UPDATE
const actualizarUsuario = (indice, nuevoUsuario) => {

    const usuarios = leerUsuarios();

    if (indice >= 0 && indice < usuarios.length) {
        //SOBREESCRIBIENDO EL USUARIO COMPLETO
        usuarios[indice] = { ...usuarios[indice], ...nuevoUsuario };
        escribirUsuarios(usuarios);
        console.log('Usuario actualizado.');

    } else {
        console.log('Usuario no encontrado.');
    }

};

//DELETE
const eliminarUsuario = (indice) => {
    const usuarios = leerUsuarios();

    if (indice >= 0 && indice < usuarios.length) {
        //BUSCA ELEMENTO CON INDICE Y ELIMINA X ELEMENTOS DESDE SU APARICIÓN
        usuarios.splice(indice, 1);
        escribirUsuarios(usuarios);
        console.log('Usuario eliminado.');

    } else {
        console.log('Usuario no encontrado.');
    }
};

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

//No requiere configuración
const configCommandRead = {}; 

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

//Definición de comandos usando yargs
yargs
    .command('create',
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
    .command('read','Mostrar todos los usuarios',configCommandRead,
        () => {
            mostrarUsuarios();
        }
    )
    .command('update',
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
    .command('delete',
        'Eliminar un usuario',
        configCommandDelete,
        (argv) => {
            eliminarUsuario(argv.indice);
        }
    )
    .help()
    .alias('h','help')
    .argv;
