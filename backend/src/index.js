const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o banco
const pool = new Pool({
  user: 'postgres',            // seu usuário do PostgreSQL
  host: 'localhost',
  database: 'usagicoffee_db',  // nome do seu banco no pgAdmin
  password: '1234',            // sua senha do PostgreSQL
  port: 5432,
});

pool.connect()
  .then(() => console.log('✅ Conectado ao banco PostgreSQL!'))
  .catch(err => console.error('❌ Erro ao conectar no banco:', err));

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ sucesso: false, mensagem: 'Email não encontrado.' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta.' });
    }

    res.json({ sucesso: true, mensagem: 'Login bem-sucedido!' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
});

// Rota para cadastrar novo usuário
app.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);
    await pool.query('INSERT INTO usuarios (email, senha) VALUES ($1, $2)', [email, hash]);
    res.json({ sucesso: true, mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ sucesso: false, mensagem: 'Email já cadastrado.' });
    } else {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar usuário.' });
    }
  }
});

// Inicia o servidor
app.listen(3001, () => {
  console.log('🚀 Servidor backend rodando na porta 3001');
});