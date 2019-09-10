/*====================================================================================*/
/*  IMPORTACIONES
/*====================================================================================*/
const mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');
/*====================================================================================*/
/*  INICIALIZACIÓN DEL ESQUEMA
/*====================================================================================*/
const Schema = mongoose.Schema;
/*====================================================================================*/
/*  CREACIÓN DEL MODELO
/*====================================================================================*/
const hospitalSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre del hospital es oblgatorio'],
    unique: true
  },
  image: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});
/*====================================================================================*/
/*  VALIDACIÓN DE CAMPOS ÚNICOS Y OCULTAR CAMPOS SENSIBLES
/*====================================================================================*/
hospitalSchema.plugin(validator, { message: 'El {PATH} ya está registrado.' });
/*====================================================================================*/
/*  EXPORTACIÓN DEL MODELO
/*====================================================================================*/
module.exports = mongoose.model('Hospital', hospitalSchema);
