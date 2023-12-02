var ruta = require("express").Router();
var subirArchivo = require("../middleWares/subirArchivos");
var borrarArchivo = require("../middleWares/borrarArchivos");
var { mostrarProductos,  nuevoProducto,  modificarProducto,  buscarProdPorID,  borrarProducto, filtrarPorCategoria } = require("../database/productosBD");
var {productoBaja, mostrarProductosBaja, buscarBajaPorID, borrarBajaProducto} = require("../database/productosBajaBD");
const { encriptarPassword, validarPassword, autorizado} = require("../functions/funcionesPassword");

ruta.get("/mostrarProductos", async (req, res) => {
  var productos = await mostrarProductos();
  res.render("productos/mostrarProductos", { productos });
});

ruta.post("/filtrarProducto", autorizado,async (req,res)=>{
  if(req.body.categoria == "Mostrar todos"){
    res.redirect("/mostrarProductos")
  }
  else{
      var productos = await filtrarPorCategoria(req.body.categoria);
      res.render("productos/mostrarProductos",{productos})
  }
});

ruta.get("/mostrarBajas", async(req,res)=>{
  var prodBajas = await mostrarProductosBaja();
  res.render("productos/mostrarBajas",{prodBajas});
});

ruta.get("/nuevoproducto", async (req, res) => {
  if(req.session.nivel >= 3){
    res.render("productos/nuevoProducto");
  }
  else
    res.redirect("/");
});

ruta.post("/nuevoproducto", subirArchivo(),async(req,res)=>{
  if(req.session.nivel >= 3){
    req.body.foto= req.file.originalname;
    var error = await nuevoProducto(req.body);
    res.redirect("/mostrarProductos")
    console.log(req.body);
  }
  else
    res.redirect("/");
});

// ruta.get("/editarProd/:id", async (req, res) => {
//   if(req.session.nivel >= 2){
//     var product = await buscarPorIDProd(req.params.id);
//     res.render("productos/modificarProducto", { product });
//   }
//   else
//     res.redirect("/");
// });

// ruta.post("/editarProd", async (req, res) => {
//   if(req.session.nivel >= 2){
//     var error = await modificarProducto(req.body);
//     res.redirect("/mostrarProducto");
//   }
//   else
//     res.redirect("/");
// });

ruta.get("/borrarProducto/:id", async(req,res)=>{
  if(req.session.nivel >= 3){
    var prod = await buscarProdPorID(req.params.id);
    borrarArchivo(prod.foto);
    await borrarProducto(req.params.id);
    res.redirect("/mostrarProductos");
  }
  else
    res.redirect("/");
});

ruta.get("/borrarBajaProducto/:id", async(req,res)=>{
  await borrarBajaProducto(req.params.id);
  res.redirect("/mostrarBajas");
});

ruta.get("/editarProducto/:id",async (req,res)=>{
  if(req.session.nivel >= 2){
    var prod = await buscarProdPorID(req.params.id);
    res.render("productos/modificarProducto",{prod})
  }
  else 
    res.redirect("/");
});

ruta.post("/editarProducto",subirArchivo(),async(req,res)=>{
  if(req.session.nivel >= 2){
    var prod = await buscarProdPorID(req.body.id);
    try {
        req.body.foto= req.file.originalname;
        if(req.file)
            borrarArchivo(prod.foto); 
    } catch (error) {
        req.body.foto= prod.foto;
    }
    var error = await modificarProducto(req.body);
    res.redirect("/mostrarProductos")
  }
  else
    res.redirect("/");
});

module.exports = ruta;
