var conexion=require("./conexion").conexionpr;
var Producto=require("../models/Producto");

async function mostrarProductos(){
    var prods=[];
    try{
        var productos = await conexion.get();
        // console.log(productos.nombre);
        productos.forEach(producto => {
            var prod=new Producto(producto.id, producto.data());
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
 
async function buscarProdPorID(id){
    var prod;
    try {
        var producto=await conexion.doc(id).get();
        var productoObjeto = new Producto(producto.id,producto.data());
        if (productoObjeto.bandera == 0){   
            prod = productoObjeto.obtenerDatos;
        }
    } 
    catch (err) {
        console.log("Error al recuperar el producto: " + err);
    }
    return prod;    
}

async function nuevoProducto(datos){
    var fechaActual = new Date();
    var año = fechaActual.getFullYear();
    var mes = fechaActual.getMonth() + 1;
    var dia = fechaActual.getDate();
    datos.fechaIngreso = año + '-' + mes + '-' + dia
    datos.fechaEgreso = '0001-01-01'

    var prod = new Producto(null,datos);
    var error = 1;
    if (prod.bandera == 0){
        try {
            await conexion.doc().set(prod.obtenerDatos);

            console.log("Producto insertado a la BD");
            error = 0;
        } 
        catch (err) {
            console.log("Error al capturar el nuevo producto: " + err);
        }
    }
    return error;
}

async function modificarProducto(datos){
    var error = 1; 
    var respuestaBuscar = await buscarProdPorID(datos.id);
    if(respuestaBuscar!=undefined){
        var prod = new Producto(datos.id,datos);
        if (prod.bandera == 0){
            try {
                await conexion.doc(prod.id).set(prod.obtenerDatos);
                console.log("Producto actualizado"); 
                error = 0;
            } 
            catch (err) {
                console.log("Error al modificar el producto: "+err);    
            }
        }
    }
    return error;
}

async function borrarProducto(id){
    var error = 1;
    var prod = await buscarProdPorID(id)
    if(prod!=undefined){
        try {
            await conexion.doc(id).delete();
            console.log("Producto borrado");
            error = 0;
        } 
        catch (err) {
            console.log("Error al borrar al producto: "+err);    
        }
    }
    return error;
}

async function filtrarPorCategoria(categoria){
    const prods = conexion;
    var data=[];
    const snapshot = await prods.where('categoria', '==', categoria).get();
    if (snapshot.empty) {
        console.log('No se encontraron documentos');
        return;
    }  
    snapshot.forEach(doc => {
        var prod=new Producto(doc.id, doc.data());
        if (prod.bandera==0){
            data.push(prod.obtenerDatos);
        }
    });
    return data;
}


module.exports={
    mostrarProductos,
    buscarProdPorID,
    nuevoProducto,
    modificarProducto,
    borrarProducto,
    filtrarPorCategoria,
}