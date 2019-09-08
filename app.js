/*------------------------------------------------------------------------------------*/
/*  IMPORTACIÓN DE LIBRERÍAS
/*------------------------------------------------------------------------------------*/
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

/*------------------------------------------------------------------------------------*/
/*  IMPORTACIÓN DE RUTAS
/*------------------------------------------------------------------------------------*/
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

/*------------------------------------------------------------------------------------*/
/*  INICIALIZACIÓN DE VARIABLES
/*------------------------------------------------------------------------------------*/
var app = express();

/*------------------------------------------------------------------------------------*/
/*  CONFIGURACIÓN DE LA LIBRERÍA BODY PARSER
/*------------------------------------------------------------------------------------*/

/*  CONVERTIR A application/x-www-form-urlencoded   */
app.use(bodyParser.urlencoded({ extended: false }));

/*  CONVERTIR A application/json   */
app.use(bodyParser.json());

/*------------------------------------------------------------------------------------*/
/*  CONEXIÓN CON LA BASE D DATOS
/*------------------------------------------------------------------------------------*/
mongoose.connection.openUri(
  'mongodb://localhost:27017/hospital_db',
  { useNewUrlParser: true },
  (error, response) => {
    if (error) throw error;
    console.log('database online');
  }
);

/*------------------------------------------------------------------------------------*/
/*  ESCUCHA DE PETICIONES
/*------------------------------------------------------------------------------------*/
app.listen(3000, () => {
  console.log('server online');
});

/*------------------------------------------------------------------------------------*/
/*  DEFINICION DE RUTAS
/*------------------------------------------------------------------------------------*/
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', mainRoutes);
