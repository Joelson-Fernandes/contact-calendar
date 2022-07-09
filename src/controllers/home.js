const { async } = require('regenerator-runtime');
const Contato = require('../models/Contato');

exports.index = async (req, res) => {
    const contatos =  new Contato();
    await contatos.findAll()

    return res.render('home/index', { contatos });
}

