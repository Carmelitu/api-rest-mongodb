const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario_model');

router.get('/', (req, res) => {
    res.json('Get de Usuarios OK');
});

router.post('/', (req, res) => {
    let body = req.body;
    let resultado = crearUsuario(body);

    resultado
        .then( user => {
            res.json({user});
        })
        .catch(error => {
            res.status(400).json(error.message);
        });
        
});

const crearUsuario = async (body) => {
    const {email, nombre, password} = body;

    let usuario = new Usuario({
        email,
        nombre,
        password
    });

    return await usuario.save();
}

module.exports = router;