/*====================================================================================*/
/*  IMPORTACIONES (LOCALES)
/*====================================================================================*/
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const auth = require('../middlewares/auth');
/*====================================================================================*/
/*  IMPORTACIONES (GOOGLE)
/*====================================================================================*/
const CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
/*====================================================================================*/
/*  INICIALIZACIÓN DE VARIABLES
/*====================================================================================*/
const app = express();
/*====================================================================================*/
/*  IMPORTACIÓN DE MODELOS
/*====================================================================================*/
const User = require('../models/user');
/*====================================================================================*/
/*  DEFINICION DE RUTAS
/*====================================================================================*/
/*====================================================================================*/
/*  VERIFICAR TOKEN (GOOGLE)
/*====================================================================================*/
let verify = async token => {
  /*----------------------------------------------------------------------------------*/
  /* Se verifica que el token sea válido.
  /*----------------------------------------------------------------------------------*/
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });
  /*----------------------------------------------------------------------------------*/
  /* Se obtiene la información del token.
  /*----------------------------------------------------------------------------------*/
  const payload = ticket.getPayload();
  /*----------------------------------------------------------------------------------*/
  /* Se envía la información obtenida.
  /*----------------------------------------------------------------------------------*/
  return new User({
    name: payload.name,
    email: payload.email,
    password: 'n3wUs3r',
    image: payload.picture,
    google: true
  });
};
/*====================================================================================*/
/*  RENOVACIÓN DEL TOKEN
/*====================================================================================*/
app.get('/renew', auth.verifyToken, (request, response) => {
  /*--------------------------------------------------------------------------------*/
  /*  Se genera el token.
    /*--------------------------------------------------------------------------------*/
  const token = jwt.sign({ user: request.user }, SEED, {
    expiresIn: 3600
  });
  /*--------------------------------------------------------------------------------*/
  /*  Se envía la respuesta de éxito.
    /*--------------------------------------------------------------------------------*/
  response.status(200).json({
    ok: true,
    token: token
  });
});
/*====================================================================================*/
/*  INICIO DE SESIÓN DEL USUARIO (GOOGLE)
/*====================================================================================*/
app.post('/google', async (request, response) => {
  /*----------------------------------------------------------------------------------*/
  /* Se obtiene el token.
  /*----------------------------------------------------------------------------------*/
  const token = request.get('Token');
  /*----------------------------------------------------------------------------------*/
  /* Se obtiene la información del token.
  /*----------------------------------------------------------------------------------*/
  const user = await verify(token).catch(error => {
    /*--------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
    if (error) {
      return response.status(403).json({
        ok: false,
        message: 'El token no es válido.',
        errors: error
      });
    }
  });
  User.findOne({ email: user.email }, (error, existent) => {
    /*--------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
    if (error) {
      return response.status(500).json({
        ok: false,
        message: 'Error al obtener el usuario.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
    if (existent) {
      if (existent.google === false) {
        return response.status(400).json({
          ok: false,
          message: 'El usuario ya está registrado.',
          errors: error
        });
      } else {
        /*----------------------------------------------------------------------------*/
        /*  Se genera el token.
        /*----------------------------------------------------------------------------*/
        const newToken = jwt.sign({ user: existent }, SEED, {
          expiresIn: 3600
        });
        /*----------------------------------------------------------------------------*/
        /*  Se envía la respuesta de éxito.
        /*----------------------------------------------------------------------------*/
        response.status(200).json({
          ok: true,
          user: existent,
          token: newToken,
          menu: getMenu(existent.role)
        });
      }
    } else {
      user.save((error, saved) => {
        /*--------------------------------------------------------------------------------*/
        /*  Se maneja el error.
        /*--------------------------------------------------------------------------------*/
        if (error) {
          return response.status(500).json({
            ok: false,
            message: 'Error al obtener el usuario.',
            errors: error
          });
        }
        /*----------------------------------------------------------------------------*/
        /*  Se genera el token.
        /*----------------------------------------------------------------------------*/
        const newToken = jwt.sign({ user: saved }, SEED, {
          expiresIn: 3600
        });
        /*----------------------------------------------------------------------------*/
        /*  Se envía la respuesta de éxito.
        /*----------------------------------------------------------------------------*/
        response.status(200).json({
          ok: true,
          user: saved,
          token: newToken,
          menu: getMenu(saved.role)
        });
      });
    }
  });
});
/*====================================================================================*/
/*  INICIO DE SESIÓN DEL USUARIO (PROPIA)
/*====================================================================================*/
app.post('/', (request, response) => {
  /*----------------------------------------------------------------------------------*/
  /*  Se extrae el contenido de la petición.
  /*----------------------------------------------------------------------------------*/
  const body = request.body;
  /*----------------------------------------------------------------------------------*/
  /*  Se realiza la petición.
  /*----------------------------------------------------------------------------------*/
  User.findOne({ email: body.email }, (error, user) => {
    /*--------------------------------------------------------------------------------*/
    /*  Se maneja el error.
    /*--------------------------------------------------------------------------------*/
    if (error) {
      return response.status(500).json({
        ok: false,
        message: 'Error al obtener el usuario.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se verifica que el usuario exista.
    /*--------------------------------------------------------------------------------*/
    if (!user) {
      return response.status(400).json({
        ok: false,
        message: 'Las credenciales no son válidas.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se verifica que la contraseña coincida.
    /*--------------------------------------------------------------------------------*/
    if (!bcrypt.compareSync(body.password, user.password)) {
      return response.status(400).json({
        ok: false,
        message: 'Las credenciales no son válidas.',
        errors: error
      });
    }
    /*--------------------------------------------------------------------------------*/
    /*  Se genera el token.
    /*--------------------------------------------------------------------------------*/
    const token = jwt.sign({ user: user }, SEED, { expiresIn: 3600 });
    /*--------------------------------------------------------------------------------*/
    /*  Se envía la respuesta de éxito.
    /*--------------------------------------------------------------------------------*/
    response.status(200).json({
      ok: true,
      user: user,
      token: token,
      menu: getMenu(user.role)
    });
  });
});

getMenu = role => {
  /*----------------------------------------------------------------------------------*/
  /*  Datos del menú lateral.
  /*----------------------------------------------------------------------------------*/
  let menu = [
    {
      title: 'Principal',
      icon: 'mdi mdi-gauge',
      items: [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Gráficas', link: '/graphics' },
        { title: 'Progreso', link: '/progress' }
      ]
    },
    {
      title: 'Gestión',
      icon: 'mdi mdi-folder-lock-open',
      items: [
        { title: 'Doctores', link: '/doctors' },
        { title: 'Hospitales', link: '/hospitals' }
      ]
    }
  ];
  if (role === 'ADMIN_ROLE') {
    menu[1].items.push({
      title: 'Usuarios',
      link: '/users'
    });
  }
  return menu;
};
/*====================================================================================*/
/*  EXPORTACIÓN DEL MODULO
/*====================================================================================*/
module.exports = app;
