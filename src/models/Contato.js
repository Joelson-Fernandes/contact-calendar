const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required:true },
    sobrenome: { type: String, required:false, default: '' },
    email: { type: String, required:false, default: '' },
    telefone: { type: Number, required:false, default: '' },
    criadoEm: { type: Date, default: Date.now }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.contato = null;
    }

    async register() { //registra dados no BD
        this.valida();
        if(this.errors.length > 0) return;

        this.contato = await ContatoModel.create(this.body);
    }

    valida() { //valida dados
        this.cleanUp();

        //valida email
        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail invalido');
        if(!this.body.nome) this.errors.push('O campo "Nome" é obrigatório');
        if(!this.body.email && !this.body.telefone) this.errors.push('Pelo menos um contato deve ser enviado: email ou telefone');
    }

    cleanUp() { //limpo os dados deixando apenas caracteres string
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            };
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone
        };
    }

    async findId(id) { //busca contato por ID
        if(typeof id !== 'string') return;
        this.body = await ContatoModel.findById(id).exec();
        return this.body;
    }

    async edit(id) { //edita contato
        if(typeof id !== 'string') return;
        this.valida();
        if(this.errors.length > 0) return;

        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
    }

    async findAll() { //busca todos os contatos
        this.contato = await ContatoModel.find().sort({ criadoEm: 1 }).exec();
        return this.contato;
    }

    async apagar(id) {
        if(typeof id !== 'string') return;
        this.contato = await ContatoModel.findByIdAndDelete(id);
        return;
    }
}

module.exports = Contato;

