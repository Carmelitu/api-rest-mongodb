const express = require('express');
const router = express.Router();
const Curso = require('../models/curso_model');
const verificarToken = require('../middlewares/auth');

router.get('/', verificarToken, (req, res) => {
    let resultado = listarCursosActivos();
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
});

router.post('/', verificarToken, (req, res) => {
    let resultado = crearCurso(req);
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
});

router.put('/:id', verificarToken, (req, res) => {
    let resultado = editarCurso(req.params.id, req.body);
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
});

router.delete('/:id', verificarToken, (req, res) => {
    let resultado = desactivarCurso(req.params.id);
    resultado
        .then(curso => res.json(curso))
        .catch(error => res.status(400).json(error));
});

const crearCurso = async (req) => {
    const {titulo, descripcion} = req.body;

    let curso = new Curso({
        titulo,
        autor: req.usuario._id,
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
    let cursos = await Curso
        .find({"estado": true})
        .populate('autor', 'nombre -_id');
    return cursos;
}

module.exports = router;