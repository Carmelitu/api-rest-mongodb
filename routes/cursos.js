const express = require('express');
const router = express.Router();
const Curso = require('../models/curso_model');

router.get('/', (req, res) => {
    let resultado = listarCursosActivos();
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
});

router.post('/', (req, res) => {
    let resultado = crearCurso(req.body);
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
});

router.put('/:id', (req, res) => {
    let resultado = editarCurso(req.params.id, req.body);
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
});

router.delete('/:id', (req, res) => {
    let resultado = desactivarCurso(req.params.id);
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
});

const crearCurso = async (body) => {
    const {titulo, descripcion} = body;

    let curso = new Curso({
        titulo,
        descripcion
    });

    return await curso.save();
}

const editarCurso = async (id, body) => {
    const {titulo, descripcion} = body;
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            titulo, descripcion
        }
    }, {new: true});

    return curso;
}

const desactivarCurso = async id => {
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            estado: false
        }
    }, {new: true});

    return curso;
}

const listarCursosActivos = async () => {
    let cursos = await Curso.find({"estado": true});
    return cursos;
}

module.exports = router;