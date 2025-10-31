import React, { useState } from "react";
import "./Login.css";
import LogoQuadrada from './assets/LogoQuadrada.png';

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem(""); // limpa mensagem anterior
    try {
      const resposta = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();
      if (resposta.ok) {
        setMensagem(dados.mensagem); // login bem-sucedido
      } else {
        setMensagem(dados.mensagem); // erro (email ou senha incorretos)
      }
    } catch (err) {
      setMensagem("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div>
      <div>
        <img src={LogoQuadrada} alt="Logo Usagi Coffee"/>
      </div>
      <div>
        <h2>Bem-vindo</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
}

export default App;