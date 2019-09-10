/*====================================================================================*/
/*  IMPORTACIONES
/*====================================================================================*/
const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
/*====================================================================================*/
/*  INICIALIZACIÓN DEL ESQUEMA
/*====================================================================================*/
const Schema = mongoose.Schema;
/*====================================================================================*/
/*  CREACIÓN DEL MODELO
/*====================================================================================*/
const doctorSchema = new Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio.'] },
  image: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'El hospital es obligatorio.']
  }
});
/*====================================================================================*/
/*  EXPORTACIÓN DEL MODELO
/*====================================================================================*/
module.exports = mongoose.model('Doctor', doctorSchema);
