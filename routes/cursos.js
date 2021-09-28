const express = require('express');
const router = express.Router();
const Curso = require('../models/curso_model');
const Joi = require('joi');

router.get('/', (req, res) => {
    res.json('Get de Cursos OK');
});

router.post('/', (req, res) => {
    let resultado = crearCurso(req.body);
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
})

const crearCurso = async (body) => {
    const {titulo, descripcion} = body;

    let curso = new Curso({
        titulo,
        descripcion
    });

    return await curso.save();
}

module.exports = router;