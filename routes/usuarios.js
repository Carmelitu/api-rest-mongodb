const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario_model');
const Joi = require('joi');

// Schema de Joi para validar datos
const schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(10)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

// Get para listado de usuarios activos
router.get('/', (req, res) => {
    let resultado = listarUsuariosActivos();
    resultado
        .then( users => {
            res.json(users);
        })
        .catch(error => {
            res.status(400).json(error.message);
        });
});

// Post para agregar usuario a la DB
router.post('/', (req, res) => {
    let body = req.body;
    const {nombre, password, email} = body;

    // Validacion con Joi
    const {error, value} = schema.validate({nombre, password, email});

    if (error){
        res.status(400).json(error.message);
        return;
    }

    let resultado = crearUsuario(body);

    resultado
        .then( user => {
            res.json({user});
        })
        .catch(error => {
            res.status(400).json(error.message);
        });
        
});

// Edición de Usuario (solo nombre y password)
router.put('/:email', (req, res) => {

    let body = req.body;
    let email = req.params.email;

    const {nombre, password} = body;

    // Validacion con Joi
    const {error, value} = schema.validate({nombre, password});

    if (error){
        res.status(400).json(error.message);
        return;
    }

    let resultado = editarUsuario(email, body);
    resultado
        .then(user => {
            res.json({user});
        }).catch(error => {
            res.status(400).json(error.message);
        });
});

// Se da de baja usuario sin eliminarlo
router.delete('/:email', (req, res) => {
    let resultado = desactivarUsuario(req.params.email);
    resultado
        .then(user => {
            res.json({user});
        }).catch(error => {
            res.status(400).json(error.message);
        });
})



/* -------------------------------------------------------------------------------------------------------- */
// Funciones helpers

const crearUsuario = async (body) => {
    const {email, nombre, password} = body;

    let usuario = new Usuario({
        email,
        nombre,
        password
    });

    await usuario.save()

    return usuario.email;
}

const editarUsuario = async (email, body) => {
    const {nombre, password} = body;
    let usuario = await Usuario.findOneAndUpdate({email: email}, {
        $set: {
            nombre, password
        }
    }, {new: true})
        .select({nombre: 1, email: 1});

    return usuario;
}

const desactivarUsuario = async email => {
    let usuario = await Usuario.findOneAndUpdate({email: email}, {
        $set: {
            estado: false
        }
    }, {new: true})
        .select({nombre: 1, email: 1});

    return usuario;
}

const listarUsuariosActivos = async () => {
    let usuarios = await Usuario.find({"estado": true})
        .select({nombre: 1, email: 1});
    return usuarios;
}

module.exports = router;