const { async } = require('regenerator-runtime');
const Login = require('../models/Login');

exports.index = (req, res) => {
    res.render('login/login.ejs');
    return;
}

exports.cadastrar = (req, res) => {
    res.render('login/cadastrar.ejs');
    return;
}

exports.autenticar = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
            return res.redirect('/login');
            })
            return;
        } 
        
        req.session.user = login.user;
        return res.redirect('../home');

    } catch(e) {
        console.log(e);
        return res.render('404');
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

exports.registrar = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();
    
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
            return res.redirect('/cadastrar');
            })
            return;
        } 

        req.flash('success', 'Usuário cadastrado com sucesso!');
        req.session.save(function() {
        return res.redirect('/login');
        })
        
    } catch(e) {
        console.log(e);
        return res.render('404');
    }

}