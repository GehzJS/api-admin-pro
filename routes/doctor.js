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
const Doctor = require('../models/doctor');
/*====================================================================================*/
/*  DEFINICION DE RUTAS
/*====================================================================================*/
/*====================================================================================*/
/*  LISTAR DOCTORES
/*====================================================================================*/
app.get('/', (request, response) => {
  /*----------------------------------------------------------------------------------*/
  /*  Se obtiene el número de registros a listar.
  /*----------------------------------------------------------------------------------*/
  let offset = request.query.offset || 0;
  offset = Number(offset);
  /*----------------------------------------------------------------------------------*/
  /*  Se reliza la consulta.
  /*----------------------------------------------------------------------------------*/
  Doctor.find({})
    .skip(offset)
    .limit(5)
    .populate('user', 'name email')
    .populate('hospital', 'name')
    .exec((error, doctors) => {
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
      Doctor.count((error, total) => {
        response.status(200).json({
          ok: true,
          doctors: doctors,
          total: total
        });
      });
    });
});
/*====================================================================================*/
/*  OBTENER UN DOCTOR
/*====================================================================================*/
app.get('/:id', (request, response) => {
  const id = request.params.id;
  Doctor.findById(id)
    .populate('hospital')
    .exec((error, doctor) => {
      /*------------------------------------------------------------------------------*/
      /*  Se maneja el error.
    /*------------------------------------------------------------------------------*/
      if (error) {
        return response.status(500).json({
          ok: false,
          message: 'Error al obtener el doctor.',
          errors: error
        });
      }
      /*--------------------------------------------------------------------------------*/
      /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
      if (!doctor) {
        return response.status(400).json({
          ok: false,
          message: 'El doctor no existe.',
          errors: error
        });
      }
      /*--------------------------------------------------------------------------------*/
      /*  Se envía la respuesta de éxito.
    /*--------------------------------------------------------------------------------*/
      response.status(200).json({
        ok: true,
        doctor: doctor
      });
    });
});
/*====================================================================================*/
/*  AGREGAR UN DOCTOR
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
  const doctor = new Doctor({
    name: body.name,
    user: request.user._id,
    hospital: body.hospital
  });
  /*----------------------------------------------------------------------------------*/
  /*  Se guarda el doctor.
  /*----------------------------------------------------------------------------------*/
  doctor.save((error, saved) => {
    /*--------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
    if (error) {
      return response.status(400).json({
        ok: false,
        message: 'Error al crear el doctor.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se envía la respuesta de éxito.
    /*--------------------------------------------------------------------------------*/
    response.status(201).json({
      ok: true,
      doctor: saved,
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
  const doctor = new Doctor({
    _id: id,
    name: body.name,
    user: body.user,
    hospital: body.hospital
  });
  /*----------------------------------------------------------------------------------*/
  /*  Se edita el doctor.
  /*----------------------------------------------------------------------------------*/
  Doctor.findByIdAndUpdate(id, { $set: doctor }, (error, saved) => {
    /*------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*------------------------------------------------------------------------------*/
    if (error) {
      return response.status(500).json({
        ok: false,
        message: 'Error al editar el doctor.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se envía la respuesta de éxito.
    /*--------------------------------------------------------------------------------*/
    response.status(201).json({
      ok: true,
      doctor: doctor,
      user_token: request.user
    });
  });
});
/*====================================================================================*/
/*  BORRAR UN DOCTOR
/*====================================================================================*/
app.delete('/:id', auth.verifyToken, (request, response) => {
  /*----------------------------------------------------------------------------------*/
  /*  Se extrae el contenido de la petición.
  /*----------------------------------------------------------------------------------*/
  const id = request.params.id;
  /*----------------------------------------------------------------------------------*/
  /*  Se borra el doctor.
  /*----------------------------------------------------------------------------------*/
  Doctor.findByIdAndDelete(id, (error, deleted) => {
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
      doctor: deleted,
      user_token: request.user
    });
  });
});
/*====================================================================================*/
/*  EXPORTACIÓN DEL MODULO
/*====================================================================================*/
module.exports = app;
