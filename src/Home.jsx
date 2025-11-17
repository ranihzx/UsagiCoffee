import React, { useEffect, useState } from "react";
import "./Home.css";
import { Search } from "lucide-react";
import logoHorizontal from "./assets/logoHorizontal.png";
import { supabase } from "./supabaseClient";

function Home() {
  const [busca, setBusca] = useState("");
  const [bebidas, setBebidas] = useState([]);
  const [comidas, setComidas] = useState([]);
  const [tipo, setTipo] = useState("bebidas");
  const [item, setItem] = useState({ id: "", nome: "", preco: "" });
  const [modo, setModo] = useState("view");

  //Filtra os itens da barra de pesquisa
  const filtrar = (item) =>
    item.nome?.toLowerCase().includes(busca.toLowerCase());

  //Carrega os dados do Supabase ("bebidas" e "comidas")
  const carregarDados = async () => {
    const { data: bebidasData, error: bebidasError } = await supabase
      .from("bebidas")
      .select("*")
      .order("id", { ascending: true });

    const { data: comidasData, error: comidasError } = await supabase
      .from("comidas")
      .select("*")
      .order("id", { ascending: true });

    if (bebidasError || comidasError) {
      console.error("Erro ao carregar dados:", bebidasError || comidasError);
      return;
    }

    setBebidas(bebidasData || []);
    setComidas(comidasData || []);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  //Adiciona um item
  const adicionarItem = async () => {
    if (!item.nome || !item.preco)
      return alert("Preencha o nome e o preço!");

    const { error } = await supabase
      .from(tipo)
      .insert([{ nome: item.nome, preco: item.preco }]);

    if (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Erro ao adicionar item!");
      return;
    }

    alert("Item adicionado com sucesso!");
    setItem({ id: "", nome: "", preco: "" });
    setModo("view");

    await carregarDados();
  };

  //Aqui começa o visual
  return (
    <div className="screen">
      <header>
        <img
          src={logoHorizontal}
          alt="Logo Usagi Coffee"
          className="logoHorizontal"
          onClick={() => setModo("view")}
        />
      </header>

      <div className="content">
        <main className="bubble">
          <div className="title">
            <h2>Menu</h2>
            <input
              className="seachBar"
              type="text"
              placeholder="Digite para"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Search className="seach" />
          </div>

          <div>
            <h3>Bebidas</h3>
            <ul>
              {[...bebidas.filter(filtrar), ...Array(Math.max(0, 5 - bebidas.length)).fill({})].map(
                (b, index) => (
                  <li
                    key={b.id ? `item-${b.id}` : `empty-${index}`}
                    onClick={() => {
                      if (!b.id) return;
                      if (item.id === b.id && item.tipo === "bebidas") {
                        setItem({ id: "", nome: "", preco: "", tipo: "" });
                      } else {
                        setItem({ id: b.id, nome: b.nome, preco: b.preco, tipo: "bebidas" });
                      }
                    }}
                    className={item.id === b.id && item.tipo === "bebidas" ? "selected" : ""}
                    style={{ cursor: b.id ? "pointer" : "default" }}
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
              {[...comidas.filter(filtrar), ...Array(Math.max(0, 5 - comidas.length)).fill({})].map(
                (c, index) => (
                  <li
                    key={c.id ? `item-${c.id}` : `empty-${index}`}
                    onClick={() => {
                      if (!c.id) return;
                      if (item.id === c.id && item.tipo === "comidas") {
                        setItem({ id: "", nome: "", preco: "", tipo: "" });
                      } else {
                        setItem({ id: c.id, nome: c.nome, preco: c.preco, tipo: "comidas" });
                      }
                    }}
                    className={item.id === c.id && item.tipo === "comidas" ? "selected" : ""}
                    style={{ cursor: c.id ? "pointer" : "default" }}
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
          {modo === "view" && (
            <>
              <h2>Gerenciar Itens</h2>
              <button onClick={() => setModo("add")}>Adicionar item</button>
              <button onClick={() => setModo("delete")} disabled={!item.id}>Excluir item</button>
              <button onClick={() => setModo("update")} disabled={!item.id}>Atualizar item</button>
              <div className="espaco"></div>  
            </>
          )}

          {modo === "add" && (
            <>
              <div className="Modo">
                <div>
                  <h2>Adicionar Item</h2>
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
                </div>

                <div>
                  <button 
                    onClick={adicionarItem} 
                    disabled={!item.nome || !item.preco}
                  >
                    Confirmar Adição
                  </button>
                  <button onClick={() => setModo("view")}>Cancelar</button>
                </div>
              </div>
            </>
          )}

          {modo === "delete" && (
            <>
              <div className="Modo">
                <div>
                  <h2>Excluir Item</h2>
                  <p className="text">Tem certeza que deseja excluir</p>
                  <p className="text">"{item.nome || 'Item não definido'}"?</p>
                  <p className="text">Esta ação não pode ser desfeita.</p>
                </div>

                <div>
                  <button
                    disabled={!item.id}
                    onClick={async () => {
                      if (!item.id) {
                        alert("Nenhum item selecionado para exclusão.");
                        return;
                      }

                      try {
                        const { error } = await supabase
                          .from(item.tipo || tipo)  //Garante deletar na tabela correta
                          .delete()
                          .eq("id", item.id);

                        if (error) {
                          console.error("Erro ao excluir item: ", error);
                          alert("Erro ao excluir item!");
                          return;
                        }

                        alert("Item excluído com sucesso!");
                        setItem({ id: "", nome: "", preco: "", tipo: "" });
                        setModo("view");
                        await carregarDados();
                      } catch (err) {
                        console.error("Erro inesperado:", err);
                        alert("Erro ao excluir item.");
                      }
                    }}
                  >
                    Confirmar
                  </button>
                  <button onClick={() => setModo("view")}>Cancelar</button>
                </div>
              </div>
            </>
          )}

          {modo === "update" && (
            <>
              <div className="Modo">
                <div>
                  <h2>Atualizar Item</h2>
                  <div className="select AsideFields">
                    <select
                      value={item.tipo || tipo} //Usa o tipo do item ou o estado tipo padrão
                      onChange={(e) => setItem({ ...item, tipo: e.target.value })}
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
                    onChange={(e) => setItem({ ...item, preco: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <button
                    disabled={!item.nome || !item.preco}
                    onClick={async () => {
                      //Buscar item original para comparar alterações
                      const original =
                        bebidas.find(b => b.id === item.id) || comidas.find(c => c.id === item.id);

                      if (!original) {
                        alert("Item original não encontrado");
                        return;
                      }

                      const originalTipo = bebidas.find(b => b.id === item.id)
                        ? "bebidas"
                        : "comidas";
                      const novoTipo = item.tipo || tipo;

                      if (!item.nome || !item.preco) {
                        alert("Preencha nome e preço.");
                        return;
                      }

                      try {
                        if (novoTipo !== originalTipo) {
                          //Deletar da tabela original
                          const { error: delError } = await supabase
                            .from(originalTipo)
                            .delete()
                            .eq("id", item.id);
                          if (delError) throw delError;

                          //Inserir na nova tabela e capturar o item inserido com o id gerado
                          const { data: insertedData, error: insertError } = await supabase
                            .from(novoTipo)
                            .insert([{ nome: item.nome, preco: item.preco }])
                            .select(); //Para retornar o item inserido com id

                          if (insertError) throw insertError;

                          if (insertedData && insertedData.length > 0) {
                            //Atualiza o estado 'item' com o novo id, nome, preco e tipo
                            setItem({
                              id: insertedData[0].id,
                              nome: insertedData[0].nome,
                              preco: insertedData[0].preco,
                              tipo: novoTipo,
                            });
                          }

                          alert("Item movido e atualizado com sucesso!");
                        } else {
                          //Contar campos alterados
                          let alteredCount = 0;
                          if (item.nome !== original.nome) alteredCount++;
                          if (item.preco !== original.preco) alteredCount++;

                          if (alteredCount === 0) {
                            alert("Nenhuma alteração detectada.");
                            return;
                          }

                          const updateData = {};
                          if (item.nome !== original.nome) updateData.nome = item.nome;
                          if (item.preco !== original.preco) updateData.preco = item.preco;

                          //No Supabase, PUT pode ser tratado igual PATCH atualizando os campos informados
                          const { error } = await supabase
                            .from(novoTipo)
                            .update(updateData)
                            .eq("id", item.id);
                          if (error) throw error;

                          alert("Item atualizado com sucesso!");
                        }

                        setItem({ id: "", nome: "", preco: "", tipo: "" });
                        setModo("view");
                        await carregarDados();
                      } catch (error) {
                        console.error("Erro ao atualizar item:", error);
                        alert("Erro ao atualizar item.");
                      }
                    }}
                  >
                    Confirmar
                  </button>
                  <button onClick={() => setModo("view")}>Cancelar</button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Home;
