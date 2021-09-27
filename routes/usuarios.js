const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario_model');

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

router.put('/:email', (req, res) => {
    let resultado = editarUsuario(req.params.email, req.body);
    resultado
        .then(user => {
            res.json({user});
        }).catch(error => {
            res.status(400).json(error.message);
        });
});

router.delete('/:email', (req, res) => {
    let resultado = desactivarUsuario(req.params.email);
    resultado
        .then(user => {
            res.json({user});
        }).catch(error => {
            res.status(400).json(error.message);
        });
})

const crearUsuario = async (body) => {
    const {email, nombre, password} = body;

    let usuario = new Usuario({
        email,
        nombre,
        password
    });

    return await usuario.save();
}

const editarUsuario = async (email, body) => {
    const {nombre, password} = body;
    let usuario = await Usuario.findOneAndUpdate({email: email}, {
        $set: {
            nombre, password
        }
    }, {new: true});

    return usuario;
}

const desactivarUsuario = async email => {
    let usuario = await Usuario.findOneAndUpdate({email: email}, {
        $set: {
            estado: false
        }
    }, {new: true});

    return usuario;
}

const listarUsuariosActivos = async () => {
    let usuarios = await Usuario.find({"estado": true});
    return usuarios;
}

module.exports = router;