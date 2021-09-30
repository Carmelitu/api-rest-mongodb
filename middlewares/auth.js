const jwt = require('jsonwebtoken');
const config = require('config');

const verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, config.get('configToken.SEED'), (error, decoded) => {
        if(error){
            return res.status(401).json(error);
        }
        req.usuario = decoded.usuario;

        next();
    });
}

module.exports = verificarToken;