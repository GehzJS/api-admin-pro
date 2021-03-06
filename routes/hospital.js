/*====================================================================================*/
/*  IMPORTACIONES
/*====================================================================================*/
const express = require('express');
const auth = require('../middlewares/auth');
/*====================================================================================*/
/*  INICIALIZACIÓN DE VARIABLES
/*====================================================================================*/
const app = express();
/*====================================================================================*/
/*  IMPORTACIÓN DE MODELOS
/*====================================================================================*/
const Hospital = require('../models/hospital');
/*====================================================================================*/
/*  DEFINICION DE RUTAS
/*====================================================================================*/
/*====================================================================================*/
/*  LISTAR HOSPITALES
/*====================================================================================*/
app.get('/', (request, response) => {
  /*----------------------------------------------------------------------------------*/
  /*  Se obtiene el número de registros a listar.
  /*----------------------------------------------------------------------------------*/
  let offset = request.query.offset || 0;
  offset = Number(offset);
  /*----------------------------------------------------------------------------------*/
  /*  Se realiza la petición.
  /*----------------------------------------------------------------------------------*/
  Hospital.find({})
    .skip(offset)
    .limit(5)
    .populate('user', 'name email')
    .exec((error, hospitals) => {
      /*------------------------------------------------------------------------------*/
      /*  Se maneja el error.
      /*------------------------------------------------------------------------------*/
      if (error) {
        return response.status(500).json({
          ok: false,
          message: 'Error al obtener los hospitales',
          errors: error
        });
      }
      /*------------------------------------------------------------------------------*/
      /*  Se realiza un conteo de los registros.
      /*------------------------------------------------------------------------------*/
      Hospital.count((error, total) => {
        response.status(200).json({
          ok: true,
          hospitals: hospitals,
          total: total
        });
      });
    });
});
/*====================================================================================*/
/*  OBTENER UN HOSPITAL
/*====================================================================================*/
app.get('/:id', (request, response) => {
  const id = request.params.id;
  Hospital.findById(id)
    .populate('user')
    .exec((error, hospital) => {
      /*--------------------------------------------------------------------------------*/
      /*  Se maneja el error.
      /*--------------------------------------------------------------------------------*/
      if (error) {
        return response.status(500).json({
          ok: false,
          message: 'Error al obtener el hospital.',
          errors: error
        });
      }
      /*--------------------------------------------------------------------------------*/
      /*  Se maneja el error.
      /*--------------------------------------------------------------------------------*/
      if (!hospital) {
        return response.status(400).json({
          ok: false,
          message: 'El hospital no existe.',
          errors: error
        });
      }
      /*--------------------------------------------------------------------------------*/
      /*  Se envía la respuesta de éxito.
      /*--------------------------------------------------------------------------------*/
      response.status(200).json({
        ok: true,
        hospital: hospital
      });
    });
});
/*====================================================================================*/
/*  AGREGAR UN HOSPITAL
/*====================================================================================*/
app.post('/', auth.verifyToken, (request, response) => {
  /*----------------------------------------------------------------------------------*/
  /*  Se verifica que haya datos en la petición.
  /*----------------------------------------------------------------------------------*/
  if (request.body.value == 0) {
    return response.status(500).json({
      ok: false,
      message: 'No hay datos que guardar.'
    });
  }
  /*----------------------------------------------------------------------------------*/
  /*  Se extrae el contenido de la petición.
  /*----------------------------------------------------------------------------------*/
  const body = request.body;
  /*----------------------------------------------------------------------------------*/
  /*  Se instancian los atributos del modelo.
  /*----------------------------------------------------------------------------------*/
  const hospital = new Hospital({
    name: body.name,
    image: body.image,
    user: request.user._id
  });
  /*----------------------------------------------------------------------------------*/
  /*  Se guarda el hospital.
  /*----------------------------------------------------------------------------------*/
  hospital.save((error, saved) => {
    /*--------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
    if (error) {
      return response.status(400).json({
        ok: false,
        message: 'Error al crear el hospital.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se envía la respuesta de éxito.
    /*--------------------------------------------------------------------------------*/
    response.status(201).json({
      ok: true,
      hospital: saved,
      user_token: request.user
    });
  });
});
/*====================================================================================*/
/*  EDITAR UN HOSPITAL
/*====================================================================================*/
app.put('/:id', auth.verifyToken, (request, response) => {
  /*----------------------------------------------------------------------------------*/
  /*  Se extrae el contenido de la petición.
  /*----------------------------------------------------------------------------------*/
  const id = request.params.id;
  const body = request.body;
  /*----------------------------------------------------------------------------------*/
  /*  Se instancian los atributos del modelo.
  /*----------------------------------------------------------------------------------*/
  const hospital = new Hospital({
    _id: id,
    name: body.name,
    user: body.user
  });
  /*----------------------------------------------------------------------------------*/
  /*  Se edita el hospital.
  /*----------------------------------------------------------------------------------*/
  Hospital.findByIdAndUpdate(id, { $set: hospital }, (error, edited) => {
    /*--------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
    if (error) {
      return response.status(500).json({
        ok: false,
        message: 'Error al editar el hospital.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se envía la respuesta de éxito.
    /*--------------------------------------------------------------------------------*/
    response.status(201).json({
      ok: true,
      hospital: hospital,
      user_token: request.user
    });
  });
});
/*====================================================================================*/
/*  BORRAR UN HOSPITAL
/*====================================================================================*/
app.delete('/:id', auth.verifyToken, (request, response) => {
  /*----------------------------------------------------------------------------------*/
  /*  Se extrae el contenido de la petición.
  /*----------------------------------------------------------------------------------*/
  const id = request.params.id;
  /*----------------------------------------------------------------------------------*/
  /*  Se borra el hospital.
  /*----------------------------------------------------------------------------------*/
  Hospital.findByIdAndDelete(id, (error, deleted) => {
    /*--------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
    if (error) {
      return response.status(500).json({
        ok: false,
        message: 'Error al borrar el hospital.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se envía la respuesta de éxito.
    /*--------------------------------------------------------------------------------*/
    response.status(200).json({
      ok: true,
      hospital: deleted,
      user_token: request.user
    });
  });
});
/*====================================================================================*/
/*  EXPORTACIÓN DEL MODULO
/*====================================================================================*/
module.exports = app;
