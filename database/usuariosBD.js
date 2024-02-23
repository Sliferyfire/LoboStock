var conexion=require("./conexion").conexion;
var {encriptarPassword} = require("../functions/funcionesPassword");
var Usuario=require("../models/Usuario");

async function mostrarUsuarios(){
    var users=[];
    try{
        var usuarios=await conexion.get(); 
        //console.log(usuarios);
        usuarios.forEach((usuario) =>{
            var user=new Usuario(usuario.id, usuario.data());
            if (user.bandera==0){
                users.push(user.obtenerDatos);
            }
        });
    }
    catch(err){
        console.log("Error al recuperar usuarios de la BD "+err);
    }
    return users;
}

async function buscarPorID(id){
    var user;
    //console.log(id);
    try{
        var usuario=await conexion.doc(id).get();
        var usuarioObjeto=new Usuario(usuario.id, usuario.data());
        if (usuarioObjeto.bandera==0){
            user=usuarioObjeto.obtenerDatos;
        }
    }
    catch(err){
        console.log("Error al recuperar al usuario "+ err);
    }
    return user;
}

async function buscarPorUsuario(usuario){  
    var data={};
    const users = conexion;
    const snapshot = await users.where('usuario', '==', usuario).get();
    if (snapshot.empty) {
        console.log('No se encontraron documentos');
        return;
    }  
    snapshot.forEach(doc => {
        data=doc
    });
    return data;
}

async function nuevoUsuario(datos){
    console.log("Datos recibidos por la funcion: ");
    console.log(datos);
    var {hash,salt}= encriptarPassword(datos.password);
    datos.password = hash;
    datos.salt = salt;
    datos.admin = false;
    var user = new Usuario(null,datos);
    var error = 1;
    if (user.bandera == 0){
        try {
            await conexion.doc().set(user.obtenerDatos);
            console.log("Usuario insertado a la BD");
            error = 0;
        } 
        catch (err) {
            console.log("Error al capturar el nuevo usuario: " + err);
        }
    }
    return error;
}

async function modificarUsuario(datos) {
    console.log(datos);
    var error = 1;
    var respuestaBuscar = await buscarPorID(datos.id);
    if (respuestaBuscar != undefined) {
        if (datos.password == '' || datos.password == undefined || datos.password == null) {
            var pass = respuestaBuscar; // Se corrige la asignación de la variable "pass"
            datos.password = pass.password;
            datos.salt = pass.salt;
            // console.log('Password viejo: ----------->' + datos.password);
        } else {
            var { salt, hash } = encriptarPassword(datos.password);
            datos.password = hash;
            datos.salt = salt;
            // console.log('Password nuevo: ----------->' + datos.password);
        }
        var user = new Usuario(datos.id, datos); // Se asume que la clase Usuario recibe el id y los datos
        if (user.bandera == 0) {
            try {
                await conexion.doc(user.id).set(user.obtenerDatos);
                console.log("Registro actualizado");
                error = 0;
            } catch (err) {
                console.log("Error al modificar al usuario: " + err);
            }
        }
    }
    return error;
}


async function borrarUsuario(id){
    var error=1;
    var user = await buscarPorID(id);
    if (user != undefined){
        try {
            await conexion.doc(id).delete();
            console.log("Registro borrado");
            error=0;
        } 
        catch (err) {
            console.log("Error al borrar al usuario: "+err);    
        }
    }
    return error;
}

async function filtrarPorNivel(nivel){
    const users = conexion;
    var data=[];
    const snapshot = await users.where('nivel', '==', nivel).get();
    if (snapshot.empty) {
        console.log('No se encontraron documentos');
        return;
    }  
    snapshot.forEach(doc => {
        var user=new Usuario(doc.id, doc.data());
        if (user.bandera==0){
            data.push(user.obtenerDatos);
        }
    });
    return data;
}



module.exports={
    mostrarUsuarios,
    buscarPorID,
    buscarPorUsuario,
    nuevoUsuario,
    modificarUsuario,
    borrarUsuario,
    filtrarPorNivel
}