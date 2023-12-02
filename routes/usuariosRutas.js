var ruta = require("express").Router();
var {mostrarUsuarios, buscarPorUsuario, filtrarPorNivel, nuevoUsuario, buscarPorID, borrarUsuario, modificarUsuario} = require("../database/usuariosBD");
var {mostrarProductos, filtrarPorCategoria} = require("../database/productosBD");
var {productoBaja, mostrarProductosBaja} = require("../database/productosBajaBD");
const { encriptarPassword, validarPassword, autorizado} = require("../functions/funcionesPassword");

ruta.get("/",async (req,res)=>{
    if(req.session.usuario){
        var productos = await mostrarProductos();
        res.render("usuarios/inicio",{productos}); 
    }
    else{
        res.render("usuarios/login")
    }
});

ruta.get("/mostrarUsuarios", autorizado,async (req,res)=>{
    if(req.session.nivel == 4){
        var usuarios = await mostrarUsuarios();
        res.render("usuarios/usuarios",{usuarios, menu:("menu"+req.session.nivel)});
    }
    else
        res.redirect("/");
});

ruta.get("/nuevousuario", autorizado,(req,res)=>{
    if(req.session.nivel == 4)
        res.render("usuarios/nuevoUsuario");
    else
        res.redirect("/");
});

ruta.post("/nuevousuario", autorizado, async(req, res)=>{
    if(req.session.nivel == 4){
       var user = await buscarPorUsuario(req.body.usuario);
        try {
            if(user.data().usuario === req.body.usuario){
                console.log("Ya existe el usuario");
                mensaje = "INVALID USER"
                res.render("usuarios/popup/wrong", {mensaje, foto:req.session.foto});
            }
        } 
        catch (error) {
            var error = await nuevoUsuario(req.body);
            res.render("usuarios/popup/success");
        } 
    }
    else
        res.redirect("/");
    
});

ruta.get("/borrar/:id", autorizado, async(req,res)=>{
    if(req.session.nivel == 4){
       var usr = await buscarPorID(req.params.id);
        await borrarUsuario(req.params.id);
        res.redirect("/mostrarUsuarios");
        //res.end(); 
    }
    else
        res.redirect("/");
});

ruta.get("/editar/:id", autorizado,async (req,res)=>{
    if(req.session.nivel == 4){
        var user = await buscarPorID(req.params.id);
        res.render("usuarios/modificar",{user})
    }
    else
        res.redirect("/");
});

ruta.post("/editar", autorizado, async(req,res)=>{   
    if(req.session.nivel == 4){
        var error = await modificarUsuario(req.body);
        res.redirect("/mostrarUsuarios");
    } 
    else
        res.redirect("/");
});

//-------------------------------------------------------------------------------------------------

ruta.get("/bajaProducto/:id", autorizado, async(req,res)=>{
    var usr = await productoBaja(req.params.id,req.session.usuario);
    res.redirect("/");
});

ruta.post("/filtrarProductoInicio", autorizado,async (req,res)=>{
    if(req.body.categoria == "Mostrar todos"){
      res.redirect("/")
    }
    else{
        var productos = await filtrarPorCategoria(req.body.categoria);
        res.render("usuarios/inicio",{productos})
    }
  });

ruta.post("/filtrar", autorizado,async (req,res)=>{
    if(req.body.nivel == "Mostrar todos"){
        res.redirect("/mostrarUsuarios")
    }
    else{
        var usuarios = await filtrarPorNivel(req.body.nivel);
        res.render("usuarios/usuarios",{usuarios})
    }
});

ruta.get("/validarUsuario", (req,res)=>{
    res.redirect("/");
});

ruta.post("/validarUsuario", async(req,res)=>{
    var mensaje;
    var user = await buscarPorUsuario(req.body.usuario);
    try {
        var verificar = await validarPassword(req.body.password,user.data().password,user.data().salt);
    } catch (error) {
        console.log("Usuario no encontrado");
        mensaje = "INVALID USER"
        res.render("usuarios/popup/wrong",{mensaje, foto:req.session.foto})
        return;
    }
    if(verificar == true){
        console.log("Usuario verificado");
        req.session.foto=user.data().foto;
        req.session.usuario=user.data().usuario;
        req.session.nivel=user.data().nivel;
        if(user.data().admin == true){
            console.log("Admin");
            req.session.admin=req.session.usuario;
        }
        else{
            console.log("Usuario");
            req.session.usuario=req.session.usuario;
        }
        res.render("usuarios/popup/success"),{foto:req.session.foto};
    }
    else{
        console.log("Password incorrecto");
        mensaje = "INVALID PASSWORD"
        res.render("usuarios/popup/wrong", {mensaje,foto:req.session.foto});
    }
});

ruta.get("/cerrarSesion",(req,res)=>{
    req.session=null;
    res.redirect("/");
});

ruta.get("/success",(req,res)=>{
    // console.log("-------------------");
    // console.log(req.session.usuario);
    // console.log("-------------------");
    res.redirect("/") 
});

ruta.get("/wrong", (req,res)=>{
    res.redirect("back")
});


module.exports = ruta;