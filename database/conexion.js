var admin=require("firebase-admin");
var keys=require("../Keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});
var micuenta=admin.firestore();
var conexion=micuenta.collection("usuarios"); 
var conexionpr=micuenta.collection("productos"); 

module.exports=conexion;