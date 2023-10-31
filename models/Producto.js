class Producto{
    constructor(id, data){
        this.bandera=0;
        this.id=id;
        this.nombre=data.nombre;
        this.descripcion=data.descripcion;
        this.precio=data.precio;
        this.foto=data.foto;
        this.fechaEgreso=data.fechaEgreso;
        this.fechaIngreso=data.fechaIngreso;
        this.stock=data.stock;
    }
    set id(id){
        if(id!=null){
            id.length>0?(this._id=id) : (this.bandera=1);
        }
    }
    set nombre(nombre){
        nombre.length>0? (this._nombre=nombre) : (this.bandera=1);
    }
    set descripcion(descripcion){
        descripcion.length>0? (this._descripcion=descripcion) : (this.bandera=1);
    }
    set precio(precio){
        precio.length>0? (this._precio=precio) : (this.bandera=1);
    }
    set foto(foto){
        foto.length>0? (this._foto=foto) : (this.bandera=1);
    }
    set fechaEgreso(fechaEgreso){
        fechaEgreso.length>0? (this._fechaEgreso=fechaEgreso) : (this.bandera=1);
    }
    set fechaIngreso(fechaIngreso){
        fechaIngreso.length>0? (this._fechaIngreso=fechaIngreso) : (this.bandera=1);
    }
    set stock(stock){
        stock.length>0? (this._stock=stock) : (this.bandera=1);
    }


    get id(){
        return this._id;
    }
    get nombre(){
        return this._nombre;
    }
    get descripcion(){
        return this._descripcion;
    }
    get precio(){
        return this._precio;
    }
    get foto(){
        return this._foto;
    }
    get fechaEgreso(){
        return this._fechaEgreso;
    }
    get fechaIngreso(){
        return this._fechaIngreso;
    }
    get stock(){
        return this._stock;
    }


    get obtenerDatosProd(){
        if(this._id != null)
            return {
                id:this.id,
                nombre:this.nombre,
                descripcion:this.descripcion,
                precio:this.precio,
                foto:this.foto,
                fechaEgreso:this.fechaEgreso,
                fechaIngreso:this.fechaIngreso,
                stock:this.stock
            }
        else{
            return {
                nombre:this.nombre,
                descripcion:this.descripcion,
                precio:this.precio,
                foto:this.foto,
                fechaEgreso:this.fechaEgreso,
                fechaIngreso:this.fechaIngreso,
                stock:this.stock
            }
        }
    }
}

module.exports=Producto;