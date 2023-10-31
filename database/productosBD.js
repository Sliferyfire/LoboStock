var conexionpr=require("./conexion").conexionpr;
var Producto=require("../models/Producto");

async function mostrarProductos(){
    var products=[];
    try{
        var productos=await conexionpr.get(); 
        console.log(productos.id);
        productos.forEach(producto =>{
            var product=new Producto(producto.id, producto.data());
            if (product.bandera==0){
                products.push(product.obtenerDatosProd);
            }
        });
    }
    catch(err){
        console.log("Error al recuperar producto de la BD "+err);
    }
    return products;
}

async function buscarPorIDProd(id){
    var product;
    //console.log(id);
    try{
        var producto=await conexionpr.doc(id).get();
        var productoObjeto=new Producto(producto.id, producto.data());
        if (productoObjeto.bandera==0){
            product=productoObjeto.obtenerDatosProd;
        }
    }
    catch(err){
        console.log("Error al recuperar al producto "+ err);
    }
    return product;
}

async function nuevoProducto(datos){
    var product=new Producto(null,datos);
    var error=1;
    if (product.bandera==0){
        try{
            await conexionpr.doc().set(product.obtenerDatosProd);
            console.log("Producto insertado a la BD ");   
            error=0;
        }
        catch(err){
            console.log("Error al capturar el nuevo producto " +err);
        }
    }
    return error;
}

async function modificarProducto(datos){
    var error=1;
    var respuestaBuscar= await buscarPorIDProd (datos.id);
    if (respuestaBuscar != undefined){
        var product=new Producto(datos.id, datos);
        var error=1;
        if (product.bandera==0){
            try{
                await conexionpr.doc(product.id).set(product.obtenerDatosProd);
                console.log("Registro actualizado ");
                error=0;
            }
            catch(err){
                console.log("Error al modificar al producto "+err);
            }
        }
    }
    return error;
}

async function borrarProducto(id){
    var error=1;
    var product = await buscarPorIDProd(id);
    if (product!=undefined){
        try{
            await conexionpr.doc(id).delete();
            console.log("Registro borrado ");
            error=0;
        }
        catch{
            console.log("Error al borrar al producto "+err);
        }
        return error;
    }
}

module.exports={
    mostrarProductos,
    buscarPorIDProd,
    nuevoProducto,
    modificarProducto,
    borrarProducto
}