import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "usagicoffee_db",
  password: "sua_senha_aqui",
  port: 5432,
});

// Listar
app.get("/api/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const result = await pool.query(`SELECT * FROM ${tipo} ORDER BY id ASC`);
  res.json(result.rows);
});

// Adicionar
app.post("/api/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const { nome, preco } = req.body;
  await pool.query(`INSERT INTO ${tipo} (nome, preco) VALUES ($1, $2)`, [
    nome,
    preco,
  ]);
  res.sendStatus(201);
});

// Excluir
app.delete("/api/:tipo/:id", async (req, res) => {
  const { tipo, id } = req.params;
  await pool.query(`DELETE FROM ${tipo} WHERE id = $1`, [id]);
  res.sendStatus(204);
});

// Atualizar (reescrever)
app.put("/api/:tipo/:id", async (req, res) => {
  const { tipo, id } = req.params;
  const { nome, preco } = req.body;
  await pool.query(`UPDATE ${tipo} SET nome=$1, preco=$2 WHERE id=$3`, [
    nome,
    preco,
    id,
  ]);
  res.sendStatus(200);
});

app.listen(5000, () => console.log("🚀 Servidor rodando em http://localhost:5000"));