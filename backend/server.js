// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com PostgreSQL
const pool = new Pool({
  user: "postgres", // seu usuário do PostgreSQL
  host: "localhost",
  database: "usagicoffee_db", // nome do seu banco
  password: "senha123", // sua senha do PostgreSQL
  port: 5432,
});

pool
  .connect()
  .then(() => console.log("✅ Conectado ao banco usagicoffee_db"))
  .catch((err) => console.error("❌ Erro ao conectar no banco:", err));

// =================== CRIE ESSAS TABELAS NO pgAdmin ===================
// CREATE TABLE bebidas (
//   id SERIAL PRIMARY KEY,
//   nome VARCHAR(100) NOT NULL,
//   preco NUMERIC(10,2) NOT NULL
// );
// CREATE TABLE comidas (
//   id SERIAL PRIMARY KEY,
//   nome VARCHAR(100) NOT NULL,
//   preco NUMERIC(10,2) NOT NULL
// );
// CREATE TABLE usuarios (
//   id SERIAL PRIMARY KEY,
//   email VARCHAR(100) UNIQUE NOT NULL,
//   senha TEXT NOT NULL
// );

// =================== ROTAS DE LOGIN ===================
app.post("/cadastro", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    await pool.query("INSERT INTO usuarios (email, senha) VALUES ($1, $2)", [
      email,
      hash,
    ]);
    res.json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    if (error.code === "23505") {
      res
        .status(400)
        .json({ sucesso: false, mensagem: "Email já cadastrado." });
    } else {
      console.error("Erro no cadastro:", error);
      res
        .status(500)
        .json({ sucesso: false, mensagem: "Erro ao cadastrar usuário." });
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ sucesso: false, mensagem: "Email não encontrado." });
    }
    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res
        .status(401)
        .json({ sucesso: false, mensagem: "Senha incorreta." });
    }
    res.json({ sucesso: true, mensagem: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro no login:", error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro interno do servidor." });
  }
});

// =================== ROTAS DE BEBIDAS ===================
app.get("/bebidas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bebidas ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/bebidas", async (req, res) => {
  const { nome, preco } = req.body;
  if (!nome || !preco)
    return res.status(400).json({ erro: "Nome e preço são obrigatórios." });
  try {
    const result = await pool.query(
      "INSERT INTO bebidas (nome, preco) VALUES ($1, $2) RETURNING *",
      [nome, preco]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// =================== ROTAS DE COMIDAS ===================
app.get("/comidas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comidas ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/comidas", async (req, res) => {
  const { nome, preco } = req.body;
  if (!nome || !preco)
    return res.status(400).json({ erro: "Nome e preço são obrigatórios." });
  try {
    const result = await pool.query(
      "INSERT INTO comidas (nome, preco) VALUES ($1, $2) RETURNING *",
      [nome, preco]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// =================== SERVIDOR ===================
app.listen(3001, () => {
  console.log("🚀 Servidor backend rodando em http://localhost:3001");
});
