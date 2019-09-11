/*====================================================================================*/
/*  IMPORTACIÓN DE LIBRERÍAS
/*====================================================================================*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
/*====================================================================================*/
/*  IMPORTACIÓN DE RUTAS
/*====================================================================================*/
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const imagesRoutes = require('./routes/images');
/*====================================================================================*/
/*  INICIALIZACIÓN DE VARIABLES
/*====================================================================================*/
const app = express();
/*====================================================================================*/
/*  CONFIGURACIÓN DEL CORS Y LOS HEADERS
/*====================================================================================*/
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Token'
  );
  response.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, DELETE, OPTIONS'
  );
  response.header('Allow', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});
/*====================================================================================*/
/*  CONFIGURACIÓN DE LA LIBRERÍA BODY PARSER
/*====================================================================================*/
/*----------------------------------------------------------------------------------*/
/*  Compatibilidad con application/x-www-form-urlencoded.
/*----------------------------------------------------------------------------------*/
app.use(bodyParser.urlencoded({ extended: false }));
/*----------------------------------------------------------------------------------*/
/*  Compatibilidad con application/json.
/*----------------------------------------------------------------------------------*/
app.use(bodyParser.json());
/*====================================================================================*/
/*  CONEXIÓN CON LA BASE DE DATOS
/*====================================================================================*/
mongoose.connection.openUri(
  'mongodb://localhost:27017/hospital_db',
  { useCreateIndex: true, useNewUrlParser: true },
  (error, response) => {
    if (error) throw error;
    console.log('database online');
  }
);
/*====================================================================================*/
/*  ESCUCHA DE PETICIONES
/*====================================================================================*/
app.listen(3000, () => {
  console.log('server online');
});
/*====================================================================================*/
/*  DEFINICION DE RUTAS
/*====================================================================================*/
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/doctors', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', imagesRoutes);
app.use('/', mainRoutes);
