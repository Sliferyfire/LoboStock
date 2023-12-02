var conexion=require("./conexion").conexionprb;
var ProductoBaja=require("../models/ProductoBaja");
var {buscarProdPorID, modificarProducto, borrarProducto} = require("../database/productosBD");

async function mostrarProductosBaja(){
    var prods=[];
    try{
        var productos = await conexion.get();
        productos.forEach(producto => {
            var prod=new ProductoBaja(producto.id, producto.data());
            if (prod.bandera == 0){
                prods.push(prod.obtenerDatos);
            }
        });
    }
    catch(err){
        console.log("Error al recuperar productos de la BD: " + err);
    }
    return prods;
}
 
async function buscarBajaPorID(id){
    var prod;
    try {
        var producto=await conexion.doc(id).get();
        var productoObjeto = new ProductoBaja(producto.id,producto.data());
        if (productoObjeto.bandera == 0){   
            prod = productoObjeto.obtenerDatos;
        }
    } 
    catch (err) {
        console.log("Error al recuperar el producto: " + err);
    }
    return prod;    
}

async function productoBaja(id,usr){
    
    var producto = await buscarProdPorID(id);
    var fechaActual = new Date();
    var año = fechaActual.getFullYear();
    var mes = fechaActual.getMonth() + 1;
    var dia = fechaActual.getDate();
    producto.fechaEgreso = año + '-' + mes + '-' + dia
    var newStock = producto.stock - 1;
    producto.stock = newStock.toString();
    producto.usuarioBaja=usr;

    if(newStock == 0){
        var prodborrado = await borrarProducto(producto.id);
    }
    else {
        var modprod = await modificarProducto(producto);
    }

    var prod = new ProductoBaja(null,producto);
    var error = 1;
    if (prod.bandera == 0){
        try {
            await conexion.doc().set(prod.obtenerDatos);

            console.log("Baja de producto registrada");
            error = 0; 
        } 
        catch (err) {
            console.log("Error al dar de baja el producto: " + err);
        }
    }
    return error;
}

async function borrarBajaProducto(id){
    var error = 1;
    var prod = await buscarBajaPorID(id)
    if(prod!=undefined){
        try {
            await conexion.doc(id).delete();
            console.log("Registro de baja borrado");
            error = 0;
        } 
        catch (err) {
            console.log("Error al borrar al registro de baja: "+err);    
        }
    }
    return error;
}


module.exports={
    mostrarProductosBaja,
    buscarBajaPorID,
    productoBaja,
    borrarBajaProducto,
}