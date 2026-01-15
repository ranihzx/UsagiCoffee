# ☕ Usagi Coffee — Menu App

Um aplicativo simples e elegante para visualizar, adicionar, atualizar e excluir itens de um cardápio kawaii. Desenvolvido em **React + Vite**, com backend fornecido pelo **Supabase**, que funciona como um serviço real de banco de dados e API.

## ✨ Funcionalidades
- Visualizar itens do menu (bebidas e comidas)  
- Buscar itens por nome  
- Adicionar novos itens  
- Atualizar itens existentes  
- Excluir itens do cardápio  
- Integração completa com banco de dados Supabase

## 🛠️ Tecnologias utilizadas
- **React**  
- **Vite**  
- **Supabase (API + banco de dados)**  
- **CSS**

## 📦 Como executar o projeto
1. Instalar dependências:  
   ```bash
   npm install
   ```
2. Rodar localmente:  
   ```bash
   npm run dev
   ```
3. Fazer build para produção:  
   ```bash
   npm run build
   ```

## 🌐 Deploy no GitHub Pages
O deploy foi configurado utilizando:  
- `vite.config.js` com caminho base ajustado  
- Arquivos da pasta **dist/** enviados ao branch `gh-pages`  
- Projeto acessível via GitHub Pages

## 🗄️ Sobre a API
O projeto utiliza o **Supabase** para operações de:
- Inserção  
- Consulta  
- Atualização  
- Exclusão  

Ou seja, o Supabase serve como a **API REST real** do projeto.

## 📁 Estrutura do projeto
```
src/
 ├── assets/
 ├── Home.jsx
 ├── main.jsx
 └── supabaseClient.js
```

## 🐇 Estilo
Tema visual inspirado em cafés kawaii, com cores suaves, bordas arredondadas e apresentação minimalista.
