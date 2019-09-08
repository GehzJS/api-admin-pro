/*------------------------------------------------------------------------------------*/
/*  IMPORTACIONES
/*------------------------------------------------------------------------------------*/
var express = require('express');
var bcrypt = require('bcryptjs');
var auth = require('../middlewares/auth');

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
/*  LISTAR USUARIOS
/*------------------------------------------------------------------------------------*/
app.get('/', (request, response) => {
  /*  BÚSQUEDA DE USUARIOS    */
  User.find({}, (error, users) => {
    if (error) {
      /*  MENSAJE DE ERROR    */
      return response.status(500).json({
        ok: false,
        message: 'Error al obtener los usuarios.',
        errors: error
      });
    }
    /*  ENVÍO DE INFORMACIÓN    */
    response.status(200).json({
      ok: true,
      users: users
    });
  });
});

/*------------------------------------------------------------------------------------*/
/*  AGREGAR UN USUARIO
/*------------------------------------------------------------------------------------*/
app.post('/', auth.verifyToken, (request, response) => {
  if (request.length == undefined) {
    /*  MENSAJE DE ERROR    */
    return response.status(500).json({
      ok: false,
      message: 'No hay datos que guardar.'
    });
  }
  /*  SE EXTRAE EL CONTENIDO DEL BODY DE LA PETICIÓN    */
  var body = request.body;
  /*  SE INSTANCIAN LOS ATRIBUTOS DEL MODELO    */
  var user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    image: body.image,
    role: body.role
  });
  /*  SE GUARDA EL USUARIO    */
  user.save((error, saved) => {
    if (error) {
      /*  MENSAJE DE ERROR    */
      return response.status(400).json({
        ok: false,
        message: 'Error al crear el usuario.',
        errors: error
      });
    }
    /*  ENVÍO DE INFORMACIÓN    */
    response.status(201).json({
      ok: true,
      user: saved,
      user_token: request.user
    });
  });
});

/*------------------------------------------------------------------------------------*/
/*  EDITAR UN USUARIO
/*------------------------------------------------------------------------------------*/
app.put('/:id', auth.verifyToken, (request, response) => {
  /*  SE OBTIENE EL ID ENVIADO    */
  var id = request.params.id;
  /*  SE EXTRAE EL CONTENIDO DEL BODY DE LA PETICIÓN    */
  var body = request.body;
  /*  SE INSTANCIAN LOS ATRIBUTOS DEL MODELO    */
  var user = new User({
    _id: id,
    name: body.name,
    email: body.email,
    role: body.role
  });
  /*  SE EDITA EL USUARIO    */
  User.findByIdAndUpdate(id, { $set: user }, (error, edited) => {
    if (error) {
      /*  MENSAJE DE ERROR    */
      return response.status(500).json({
        ok: false,
        message: 'Error al editar el usuario.',
        errors: error
      });
    }
    /*  ENVÍO DE INFORMACIÓN    */
    response.status(201).json({
      ok: true,
      user: user,
      user_token: request.user
    });
  });
});

/*------------------------------------------------------------------------------------*/
/*  EDITAR UN USUARIO
/*------------------------------------------------------------------------------------*/
app.delete('/:id', auth.verifyToken, (request, response) => {
  /*  SE OBTIENE EL ID ENVIADO    */
  var id = request.params.id;
  /*  SE BORRA EL USUARIO    */
  User.findByIdAndDelete(id, (error, deleted) => {
    if (error) {
      /*  MENSAJE DE ERROR    */
      return response.status(500).json({
        ok: false,
        message: 'Error al borrar el usuario.',
        errors: error
      });
    }
    /*  ENVÍO DE INFORMACIÓN    */
    response.status(200).json({
      ok: true,
      user: deleted,
      user_token: request.user
    });
  });
});

/*------------------------------------------------------------------------------------*/
/*  EXPORTACIÓN DEL MODELO
/*------------------------------------------------------------------------------------*/
module.exports = app;
