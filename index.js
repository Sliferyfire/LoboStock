var express = require("express");
const bodyParser = require('body-parser');
var cors = require("cors");
var path = require("path");
// var session = require("express-session");  Se almacena en el servidor 
var session = require("cookie-session");
require("dotenv").config();
var rutas = require("./routes/usuariosRutas");
var rutasPr = require("./routes/productosRutas");


var app = express();
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(session({
    name: 'session',
    keys: ["ahfhafhafueaf17rbqcb17eb"],
    maxAge: 24 * 60 * 60 * 1000,
    cookie: {
        secure: false,
        httpOnly: true,
      }
}));
app.use("/", express.static(path.join(__dirname,"/web")))
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/icons', express.static(__dirname + '/node_modules/bootstrap-icons/font/fonts'));
app.use('/', rutas);
app.use('/', rutasPr);
  

var port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});

