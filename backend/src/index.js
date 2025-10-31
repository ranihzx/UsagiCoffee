const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const usuario = {
    email: 'usuario@usagi.com',
    senha: '123456'
};

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (email === usuario.email && senha === usuario.senha) {
        return res.json({ sucesso: true, mensagem: 'Login bem-sucedido!' });
    } else {
        return res.status(401).json({ sucesso: false, mensagem: 'Email ou senha incorretos.' });
    }
});

app.listen(3001, () => {
    console.log('Backend rodando na porta 3001');
});