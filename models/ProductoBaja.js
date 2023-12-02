class ProductoBaja{
    constructor(id, data){
        this.bandera=0;
        this.id=id;
        this.nombre=data.nombre;
        this.descripcion=data.descripcion;
        this.precio=data.precio;
        this.fechaEgreso=data.fechaEgreso;
        this.fechaIngreso=data.fechaIngreso;
        this.usuarioBaja=data.usuarioBaja;
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
    set fechaEgreso(fechaEgreso){
        fechaEgreso.length>0? (this._fechaEgreso=fechaEgreso) : (this.bandera=1);
    }
    set fechaIngreso(fechaIngreso){
        fechaIngreso.length>0? (this._fechaIngreso=fechaIngreso) : (this.bandera=1);
    }
    set usuarioBaja(usuarioBaja){
        usuarioBaja.length>0? (this._usuarioBaja=usuarioBaja) : (this.bandera=1);
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
    get fechaEgreso(){
        return this._fechaEgreso;
    }
    get fechaIngreso(){
        return this._fechaIngreso;
    }
    get usuarioBaja(){
        return this._usuarioBaja;
    }


    get obtenerDatos(){
        if(this._id != null)
            return {
                id:this.id,
                nombre:this.nombre,
                descripcion:this.descripcion,
                precio:this.precio,
                fechaEgreso:this.fechaEgreso,
                fechaIngreso:this.fechaIngreso,
                usuarioBaja:this.usuarioBaja
            }
        else{
            return {
                nombre:this.nombre,
                descripcion:this.descripcion,
                precio:this.precio,
                fechaEgreso:this.fechaEgreso,
                fechaIngreso:this.fechaIngreso,
                usuarioBaja:this.usuarioBaja
            }
        }
    }
}

module.exports=ProductoBaja;