/*------------------------------------------------------------------------------------*/
/*  IMPORTACIONES
/*------------------------------------------------------------------------------------*/
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verifyToken = function(request, response, next) {
  var token = request.query.token;

  jwt.verify(token, SEED, (error, decoded) => {
    if (error) {
      /*  MENSAJE DE ERROR    */
      return response.status(401).json({
        ok: false,
        message: 'El token no es válido.',
        errors: error
      });
    }
    request.user = decoded.user;
    next();
  });
};
