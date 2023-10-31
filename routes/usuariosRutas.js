var ruta = require("express").Router();
var {mostrarUsuarios, buscarPorUsuario, filtrarPorNivel} = require("../database/usuariosBD");
const { encriptarPassword, validarPassword} = require("../functions/funcionesPassword");

ruta.get("/",(req,res)=>{
    // if(req.session.usuario){
        res.render("usuarios/inicio");
    // }
    // else{
        // res.render("usuarios/login")
    // }
    
});

ruta.get("/mostrarUsuarios",async (req,res)=>{
    var usuarios = await mostrarUsuarios();
    res.render("usuarios/usuarios",{usuarios});
});

ruta.post("/filtrar",async (req,res)=>{
    if(req.body.nivel == "Mostrar todos"){
        res.redirect("/mostrarUsuarios")
    }
    else{
        var usuarios = await filtrarPorNivel(req.body.nivel);
        res.render("usuarios/usuarios",{usuarios})
    }
    
});

ruta.post("/validarUsuario", async(req,res)=>{
    var user = await buscarPorUsuario(req.body.usuario);
    console.log(user.data());
    try {
        var verificar = await validarPassword(req.body.password,user.data().password,user.data().salt);
    } catch (error) {
        console.log("Usuario no encontrado");
        res.redirect("/")
    }

    if(verificar == true){
        console.log("Usuario verificado");
        req.session.usuario=user.data().usuario;
        res.redirect("/");
    }
    else{
        console.log("Usuario no verificado");
        res.redirect("/");
    }
});

ruta.get("/cerrarSesion",(req,res)=>{
    req.session=null;
    res.redirect("/");
});



module.exports = ruta;