const { create } = require('connect-mongo');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required:true },
    password: { type: String, required:true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if(this.errors.length > 0) return;

        this.user = await LoginModel.findOne({ email: this.body.email });
        if(!this.user) {
            this.errors.push('Usuario não existe');
            return;
        } 

        if(!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        }

    }

    async register() {
        this.valida();
        await this.userExists();
        if(this.errors.length > 0) return;

        //criptografa a senha
        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);

        //cria usuario no bd
        this.user = await LoginModel.create(this.body);
        
    }

    valida() {
        this.cleanUp();

        //valida email
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail invalido');

        //valida senha
        if(this.body.password.length < 3 || this.body.password.length >= 50) {
            this.errors.push('c')
        }
    }

    cleanUp() { //limpo os dados deixando apenas caracteres string
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            };
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };

    }

    async userExists() { //verifica se usuario ja existe
        this.user = await LoginModel.findOne({ email: this.body.email });
        if(this.user) this.errors.push('Usuario ja existe');
    }
}

module.exports = Login;