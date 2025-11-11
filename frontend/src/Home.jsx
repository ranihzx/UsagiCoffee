import React, { useEffect, useState } from "react";
import "./Home.css";
import { Search } from "lucide-react";
import logoHorizontal from "./assets/logoHorizontal.png";

const API_URL = "http://localhost:3001";

function Home() {
  const [busca, setBusca] = useState("");
  const [bebidas, setBebidas] = useState([]);
  const [comidas, setComidas] = useState([]);
  const [tipo, setTipo] = useState("bebidas");
  const [item, setItem] = useState({ id: "", nome: "", preco: "" });
  const [modo, setModo] = useState("view");

  const filtrar = (item) =>
    item.nome?.toLowerCase().includes(busca.toLowerCase());

  const carregarDados = async () => {
    const resBebidas = await fetch(`${API_URL}/bebidas`);
    const resComidas = await fetch(`${API_URL}/comidas`);
    const dataBebidas = await resBebidas.json();
    const dataComidas = await resComidas.json();
    setBebidas(dataBebidas);
    setComidas(dataComidas);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const adicionarItem = async () => {
    if (!item.nome || !item.preco)
      return alert("Preencha o nome e o preço!");

    await fetch(`${API_URL}/${tipo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    alert("Item adicionado com sucesso!");
    setItem({ id: "", nome: "", preco: "" });
    setModo("view");

    // ✅ Espera o backend salvar antes de atualizar a tela
    await carregarDados();
  };

  return (
    <div className="screen">
      <header>
        <img
          src={logoHorizontal}
          alt="Logo Usagi Coffee"
          className="logoHorizontal"
        />
      </header>

      <div className="content">
        <main className="bubble">
          <div className="title">
            <h2>Menu</h2>
            <input
              className="seachBar"
              type="text"
              placeholder="Pesquisar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Search className="seach" />
          </div>

          <div>
            <h3>Bebidas</h3>
            <ul>
              {[...bebidas.filter(filtrar), ...Array(5 - bebidas.length).fill({})].map(
                (b, index) => (
                  <li
                    key={b.id || index}
                    onClick={() =>
                      b.id &&
                      setItem({ id: b.id, nome: b.nome, preco: b.preco })
                    }
                  >
                    <span>{b.nome || ""}</span>
                    <span>{b.preco ? `R$ ${b.preco.toFixed(2)}` : ""}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3>Comidas</h3>
            <ul>
              {[...comidas.filter(filtrar), ...Array(5 - comidas.length).fill({})].map(
                (c, index) => (
                  <li
                    key={c.id || index}
                    onClick={() =>
                      c.id &&
                      setItem({ id: c.id, nome: c.nome, preco: c.preco })
                    }
                  >
                    <span>{c.nome || ""}</span>
                    <span>{c.preco ? `R$ ${c.preco.toFixed(2)}` : ""}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </main>

        <aside className="bubble">
          <h2>Gerenciar Itens</h2>

          {modo === "view" && (
            <>
              <button onClick={() => setModo("add")}>Adicionar item</button>
              <button onClick={() => setModo("delete")} disabled>Excluir item</button>
              <button onClick={() => setModo("update")} disabled>Atualizar lista</button>
              <button onClick={() => setModo("rewrite")} disabled>Reescrever item</button>
            </>
          )}

          {modo === "add" && (
            <>
              <div className="select AsideFields">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="bebidas">Bebida</option>
                  <option value="comidas">Comida</option>
                </select>
              </div>

              <input
                className="AsideFields"
                type="text"
                placeholder="Nome"
                value={item.nome}
                onChange={(e) => setItem({ ...item, nome: e.target.value })}
              />
              <input
                className="AsideFields"
                type="number"
                placeholder="Preço"
                value={item.preco}
                onChange={(e) =>
                  setItem({ ...item, preco: parseFloat(e.target.value) })
                }
              />

              <button 
                onClick={adicionarItem} 
                disabled={!item.nome || !item.preco}
              >
                Confirmar Adição
              </button>
              <button onClick={() => setModo("view")}>Cancelar</button>
            </>
          )}

          {modo === "delete" && (<>
            <button onClick={() => setModo("view")}>Voltar</button>
          </>)}
          
          {modo === "update" && (<>
            <button onClick={() => setModo("view")}>Voltar</button>
          </>)}

          {modo === "rewrite" && (<>
            <button onClick={() => setModo("view")}>Voltar</button>
          </>)}
        </aside>
      </div>
    </div>
  );
}

export default Home;
