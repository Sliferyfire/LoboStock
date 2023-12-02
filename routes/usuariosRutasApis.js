var ruta=require("express").Router();
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUsuario, buscarPorUsuario, filtrarPorNivel} = require("../database/usuariosBD");
const subirArchivos = require("../middleWares/subirArchivos");

ruta.get("/api/mostrarUsuarios", async(req, res)=>{
    var usuarios = await mostrarUsuarios();
    //console.log(usuarios);
    //res.render("usuarios/mostrar",{usuarios});
    if (usuarios.length>0)
        res.status(200).json(usuarios);
    else
        res.status(400).json("No hay usuarios");
    
});

ruta.post("/api/nuevousuario", async(req, res)=>{
    //console.log(req.body);
    // req.body.foto=req.file.originalname; 
    var error = await nuevoUsuario(req.body);
    if(error==0){
        res.status(200).json("Usuario registrado");
    } 
    else{
        res.status(400).json("datos incorrectos");
    }
});

ruta.get("/api/buscarUsuarioPorId/:id",async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    if (user==""){
        res.status(400).json("No se encontro ese usuario");
    }
    else {
        res.status(200).json(user);
    }
});

ruta.post("/api/editarUsuario", async(req, res)=>{
    // req.body.foto=req.file.originalname; 
    var error=await modificarUsuario(req.body);
    if (error==0){
        res.status(200).json("Usuario actualizado");
    } 
    else {
        res.status(400).json("Error al actualizar el usuario");
    }
});

ruta.get("/api/borrarUsuario/:id", async(req, res)=>{
    var error = await borrarUsuario(req.params.id);
    if (error==0){
        res.status(200).json("Registro borradoo");
    }
    else {
        res.status(400).json("Error al borrar el usuario");
    }
});

module.exports=ruta;