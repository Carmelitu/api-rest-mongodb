const express = require('express');
const mongoose = require('mongoose');
const usuario = require('./routes/usuarios');
const curso = require('./routes/cursos');
const auth = require('./routes/auth');
const config = require('config');

// Conectando a DB
mongoose.connect(config.get('configDB.HOST'))
    .then( () => console.log('Conectado a MongoDB'))
    .catch( error => console.log(error));

// Instanciando app
const app = express();

// Habilitar body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar Routers
app.use('/api/usuarios', usuario);
app.use('/api/cursos', curso);
app.use('/api/auth', auth);



// Levanto servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Servidor funcionando en el puerto ' + port);
})
