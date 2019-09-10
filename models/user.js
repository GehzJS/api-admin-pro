/*====================================================================================*/
/*  IMPORTACIONES
/*====================================================================================*/
const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const protected = require('mongoose-hidden')();
/*====================================================================================*/
/*  INICIALIZACIÓN DEL ESQUEMA
/*====================================================================================*/
const Schema = mongoose.Schema;
/*====================================================================================*/
/*  DEFINICIÓN DE LOS ROLES PERMITIDOS
/*====================================================================================*/
const roles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol permitido.'
};
/*====================================================================================*/
/*  CREACIÓN DEL MODELO
/*====================================================================================*/
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio.'],
    unique: true
  },
  password: { type: String, required: [true, 'La contraseña es obligatoria.'] },
  image: { type: String, required: false },
  role: { type: String, required: true, default: 'USER_ROLE', enum: roles },
  google: { type: Boolean, required: false }
});
/*====================================================================================*/
/*  VALIDACIÓN DE CAMPOS ÚNICOS Y OCULTAR CAMPOS SENSIBLES
/*====================================================================================*/
userSchema.plugin(validator, { message: 'El {PATH} ya está registrado.' });
userSchema.plugin(protected, { hidden: { _id: false, password: true } });
/*====================================================================================*/
/*  EXPORTACIÓN DEL MODELO
/*====================================================================================*/
module.exports = mongoose.model('User', userSchema);
