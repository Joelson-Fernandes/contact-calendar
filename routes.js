const express = require('express');
const route = express.Router();

const home = require('./src/controllers/home');
const login = require('./src/controllers/login');
const contato = require('./src/controllers/contato');

const { loginRequired } = require('./src/middlewares/middleware');

route.get('/', login.index);

//ROTAS LOGIN
route.get('/login', login.index);
route.get('/cadastrar', login.cadastrar);
route.post('/login/autenticar', login.autenticar);
route.post('/login/registrar', login.registrar);
route.get('/logout', login.logout);

//ROTAS HOME
route.get('/home', loginRequired, home.index);

//ROTAS CONTATO
route.get('/novo_contato', loginRequired, contato.index);
route.post('/contato/register', loginRequired, contato.register);
route.get('/edit_contato/:id', loginRequired, contato.editIndex);
route.post('/contato/edit/:id', loginRequired, contato.edit);
route.get('/contato/excluir/:id', loginRequired, contato.delete);


module.exports = route