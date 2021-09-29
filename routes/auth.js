const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario_model');
//const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {

    const {email, password} = req.body;
    Usuario.findOne({email})
        .then(datos => {
            if(datos){
                const passwordValido = bcrypt.compareSync(password, datos.password);
                if(!passwordValido){
                    return res.status(400).json({error: 'Usuario o contraseña incorrecta'});
                }
                const jwToken = jwt.sign({
                    data: {_id: datos._id, nombre: datos.nombre, email: datos.email}
                }, 'secret', {expiresIn: '1h'});
                //jwt.sign({_id: datos._id, nombre: datos.nombre, email: datos.email}, 'password');
                res.json({
                    usuario: {
                        id: datos._id,
                        nombre: datos.nombre,
                        email: datos.email
                    },
                    jwToken});
            } else {
                res.status(400).json({error: 'Usuario o contraseña incorrecta'});
            }
        })
        .catch(error => res.status(400).json({error: 'Error en el servicio de autenticación'}));
})

module.exports = router;