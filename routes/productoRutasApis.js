var ruta = require("express").Router();
var subirArchivos=require("../middleWares/subirArchivos");
var borrarArchivo=require("../middleWares/borrarArchivos");
var { mostrarProductos,  nuevoProducto,  modificarProducto,  buscarProdPorID,  borrarProducto, filtrarPorCategoria } = require("../database/productosBD");
//const subirArchivos = require("../middlewares/subirArchivos");

ruta.get("/api/mostrarProducto", async (req, res) => {
    var productos = await mostrarProductos();
    //console.log(productos);
    //res.render("usuarios/mostrarProducto", { productos });
    if (productos.length>0)
    res.status(200).json(productos);
    else
    res.status(400).json("No hay productos");
});

ruta.post("/api/nuevoproducto", subirArchivos(), async (req, res) => {
    req.body.foto=req.file.originalname; 
    // console.log(req.body);

    var error = await nuevoProducto(req.body);
    if(error==0){
        res.status(200).json("Producto registrado");
    } 
    else{
        res.status(400).json("datos incorrectos");
    } 
});


ruta.get("/api/buscarProductoPorId/:id", async (req, res) => {
  var product=await buscarProdPorID(req.params.id);
  if (product==""){
      res.status(400).json("No se encontro ese producto");
  }
  else {
      res.status(200).json(product);
  }
});

ruta.post("/api/editarProducto", subirArchivos(),  async (req, res) => {
    var prod = await buscarProdPorID(req.body.id);
    try {
        req.body.foto= req.file.originalname;
        if(req.file)
            borrarArchivo(prod.foto); 
    } catch (error) {
        req.body.foto= prod.foto;
    }
    // console.log(req.body);
    var error = await modificarProducto(req.body);
    if (error==0){
        res.status(200).json("Producto actualizado");
    } 
    else {
        res.status(400).json("Error al actualizar el producto");
    }
});

ruta.get("/api/borrarProducto/:id", async (req, res) => {
    var prod = await buscarProdPorID(req.params.id);
    borrarArchivo(prod.foto);
    var error = await borrarProducto(req.params.id);
    if(error == 0)
        res.status(200).json("Producto borrado");
    else    
        res.status(400).json("Error al borrar el producto");
});

module.exports = ruta;
