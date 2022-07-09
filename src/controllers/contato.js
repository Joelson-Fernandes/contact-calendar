const { async } = require('regenerator-runtime');
const Contato = require('../models/Contato');

exports.index = (req, res) => {
    res.render('contato/index', { contato: {} });
}

exports.register = async (req, res) => {
    const contato = new Contato(req.body);
    try {
        await contato.register();

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(function() {
            return res.redirect('/novo_contato');
            })
            return;
        } 

        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(() => {res.redirect(`/edit_contato/${contato.contato._id}`)});

    } catch(e) {
        console.log(e);
        return res.render('error/404');
    }
    
}

exports.editIndex = async (req, res) => {
    if(!req.params.id) return res.render('error/404');
    const contato = await new Contato().findId(req.params.id);
    if(!contato) return res.render('error/404');

    res.render('contato', { contato });
}

exports.edit = async (req, res) => {
    if(!req.params.id) return res.render('error/404');
    const contato = new Contato(req.body);

    try {

        await contato.edit(req.params.id);
        if(!contato) return res.render('error/404');

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(function() {
            return res.redirect('/novo_contato');
            })
            return;
        } 

        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(() => {res.redirect(`/edit_contato/${contato.contato._id}`)});
    
    } catch(e) {
        console.log(e);
        return res.render('error/404');
    }
    
}

exports.delete = async (req, res) => {
    if(!req.params.id) return res.render('error/404');
    const contato = await new Contato();
    if(!contato) return res.render('error/404');

    await contato.apagar(req.params.id);

    req.flash('success', 'Contato apagado com sucesso!');
    req.session.save(() => {res.redirect('/home')});
    return;
}