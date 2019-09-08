/*------------------------------------------------------------------------------------*/
/*  IMPORTACIONES
/*------------------------------------------------------------------------------------*/
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/*------------------------------------------------------------------------------------*/
/*  INICIALIZACIÓN DE VARIABLES
/*------------------------------------------------------------------------------------*/
var app = express();

/*------------------------------------------------------------------------------------*/
/*  IMPORTACIÓN DE MODELOS
/*------------------------------------------------------------------------------------*/
var User = require('../models/user');

/*------------------------------------------------------------------------------------*/
/*  DEFINICION DE RUTAS
/*------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------*/
/*  INICIO DE SESIÓN DEL USUARIO
/*------------------------------------------------------------------------------------*/
app.post('/', (request, response) => {
  /*  SE EXTRAE EL CONTENIDO DEL BODY DE LA PETICIÓN    */
  var body = request.body;
  User.findOne({ email: body.email }, (error, user) => {
    if (error) {
      /*  MENSAJE DE ERROR    */
      return response.status(500).json({
        ok: false,
        message: 'Error al obtener el usuario.',
        errors: error
      });
    }
    if (!user) {
      /*  MENSAJE DE ERROR    */
      return response.status(400).json({
        ok: false,
        message: 'Las credenciales no son válidas.',
        errors: error
      });
    }
    if (bcrypt.compareSync(body.password, user.password)) {
      /*  MENSAJE DE ERROR    */
      return response.status(400).json({
        ok: false,
        message: 'Las credenciales no son válidas.',
        errors: error
      });
    }
    var token = jwt.sign({ user: user }, SEED, { expiresIn: 3600 });
    /*  ENVÍO DE INFORMACIÓN    */
    response.status(200).json({
      ok: true,
      user: user,
      token: token
    });
  });
});

/*------------------------------------------------------------------------------------*/
/*  EXPORTACIÓN DEL MODELO
/*------------------------------------------------------------------------------------*/
module.exports = app;
