import React, { useEffect, useState } from "react";
import "./Home.css";
import { Search } from "lucide-react";
import logoHorizontal from "./assets/logoHorizontal.png";

function Home() {
  const [busca, setBusca] = useState("");
  const [bebidas, setBebidas] = useState([]);
  const [comidas, setComidas] = useState([]);
  const [tipo, setTipo] = useState("bebidas");
  const [item, setItem] = useState({ id: "", nome: "", preco: "" });

  const carregarDados = async () => {
    const [bebidasData, comidasData] = await Promise.all([
      fetch("http://localhost:5000/api/bebidas").then((r) => r.json()),
      fetch("http://localhost:5000/api/comidas").then((r) => r.json()),
    ]);
    setBebidas(bebidasData);
    setComidas(comidasData);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const filtrar = (item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase());

  const adicionarItem = async () => {
    if (!item.nome || !item.preco)
      return alert("Preencha o nome e o preço!");
    await fetch(`http://localhost:5000/api/${tipo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    alert("Item adicionado com sucesso!");
    setItem({ id: "", nome: "", preco: "" });
    carregarDados();
  };

  const excluirItem = async () => {
    if (!item.id) return alert("Informe o ID do item para excluir!");
    await fetch(`http://localhost:5000/api/${tipo}/${item.id}`, {
      method: "DELETE",
    });
    alert("Item excluído!");
    carregarDados();
  };

  const reescreverItem = async () => {
    if (!item.id || !item.nome || !item.preco)
      return alert("Preencha ID, nome e preço!");
    await fetch(`http://localhost:5000/api/${tipo}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    alert("Item atualizado com sucesso!");
    carregarDados();
  };

  return (
    <div className="home-container">
      <header className="top-bar">
        <img src={logoHorizontal} alt="Logo Usagi Coffee" />
      </header>

      <div className="content">
        <div className="menu-box">
          <div className="menu-header">
            <h2>Menu</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <Search/>
            </div>
          </div>

          <div className="section">
            <h3>Bebidas</h3>
            <ul>
              {bebidas.filter(filtrar).map((b) => (
                <li
                  key={b.id}
                  onClick={() =>
                    setItem({ id: b.id, nome: b.nome, preco: b.preco })
                  }
                >
                  <span>{b.nome}</span>
                  <span>R$ {b.preco.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Comidas</h3>
            <ul>
              {comidas.filter(filtrar).map((c) => (
                <li
                  key={c.id}
                  onClick={() =>
                    setItem({ id: c.id, nome: c.nome, preco: c.preco })
                  }
                >
                  <span>{c.nome}</span>
                  <span>R$ {c.preco.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="side-panel">
          <h3>Gerenciar Itens</h3>

          <button onClick={adicionarItem}>Adicionar item</button>
          <button onClick={excluirItem}>Excluir item</button>
          <button onClick={carregarDados}>Atualizar item</button>
          <button onClick={reescreverItem}>Reescrever item</button>
        </div>
      </div>
    </div>
  );
}

export default Home;