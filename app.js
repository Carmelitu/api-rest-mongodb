const express = require('express');
const mongoose = require('mongoose');
const usuario = require('./routes/usuarios');

// Conectando a DB
mongoose.connect('mongodb://localhost:27017/test')
    .then( () => console.log('Conectado a MongoDB'))
    .catch( error => console.log(error));

// Instanciando app
const app = express();

// Habilitar body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar Routers
app.use('/api/usuarios', usuario);




const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Servidor funcionando en el puerto ' + port);
})