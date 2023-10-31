var ruta = require("express").Router();
var { mostrarProductos,  nuevoProducto,  modificarProducto,  buscarPorIDProd,  borrarProducto } = require("../database/productosBD");

ruta.get("/mostrarProductos", async (req, res) => {
  var productos = await mostrarProductos();
  console.log(productos);
  res.render("productos/mostrarProductos", { productos });
});





module.exports = ruta;





