# 🍕 PizzaOne - Sistema Completo de Pedidos 🍕

## Conteúdo
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Estrutura de Pastas](#-estrutura-de-pastas-)
* [Instalação](#️-instalação)
* [Banco de dados](#banco-de-dados)
* [Rotações de API](#-rotações-de-api-backend)
* [CSV Gerados](#-csv-gerados)
* [Screenshots](#screenshots)
* [Autores](#autores)

 Aplicação completa de delivery de pizzaria, composta por 
 Frontend (React + Vite ) e Backend (Node.js + Express + TypeScript + SQL Server), incluindo:
## Cadastro de pedidos
* Cálculo automático de preço 
* Emissão de Nota Fiscal (NFe) 
* Histórico de didos em CSV
* Finalização de pedidos
* Painel moderno
* Suporte a itens extras, bebidas e sobremesas
  

## Tecnologias Utilizadas

* Frontend
   * React 19
   * CSS
   * Ícones Lucide
   * Vite
   * Modo escuro
   * Componentização avançada
* Backend
   * Node.js
   * Expressar
   * TypeScript
   * Docker 
   * Servidor SQL (mssql)
   * Gravador CSV (fs)
   * CORS
   * API REST
## 📂 Estrutura de Pastas 📂 
      PIZZA-PROJECT/
      ├── backend/
      │   └── src/
      │       ├── database.ts
      │       ├── nfeService.ts
      │       ├── server.ts
      │       └── types.ts
      │
      ├── components/
      │   ├── Button.tsx
      │   ├── CartDrawer.tsx
      │   ├── OrderModal.tsx
      │   ├── ProductCard.tsx
      │   └── StatsDashboard.tsx
      │
      ├── csv/
      │   └── ativos.csv
      │
      ├── node_modules/
      │
      ├── public/
      │   └── img/
      │
      ├── services/
      │   └── api.ts
      │
      ├── .env.local
      ├── .gitignore
      ├── App.tsx
      ├── constants.ts
      ├── index.css
      ├── index.html
      ├── index.tsx
      ├── metadata.json
      ├── package-lock.json
      ├── package.json
      ├── README.md
      ├── tsconfig.json
      ├── tsconfig.node.json
      ├── types.ts
      ├── utils.ts
      └── vite.config.ts


## 🛠️ Instalação
   1. Backend
```bash
pizzaone/backend
cd backend 
```
    npm install
    npm run server
         
   O backend iniciará em:
```
http://localhost:3000
```
   2. Front-end
```/pizzaone 
npm install
npm run dev
```
O frontend iniciará em:
```
http://localhost:5173
```

# Banco de dados 
## Comando Docker para criar o container, cole esse código no terminal Docker
      docker run -e "ACCEPT_EULA=Y" \
        -e "MSSQL_SA_PASSWORD=SuaSenhaForte123!" \
        -p 1433:1433 \
        --name sqlserver_pizzaria \
        -d mcr.microsoft.com/mssql/server:2022-latest
      
<img width="1424" height="50" alt="image" src="https://github.com/user-attachments/assets/ca8d569e-9d12-4b86-a863-79ada7d81f9c" />

O que esse comando faz:
* ```ACCEPT_EULA=Y``` → aceita a licença da Microsoft
* ```MSSQL_SA_PASSWORD``` → senha do usuário sa
* ```-p 1433:1433``` → expõe a porta do SQL Server
* ```--name sqlserver_pizzaria``` → nome do container
* ```-d``` → roda em background
* imagem SQL Server → ```mcr.microsoft.com/mssql/server:2022-latest  ```
* 
 1. Para darmos ínicio, precisamos ter instalado o Docker, e nosso Contâiner precisa ter esse acesso Server,
<img width="771" height="120" alt="image" src="https://github.com/user-attachments/assets/c9ca9516-6865-45b9-a793-f7b584d25415" />

 2. Após entrar na pasta
```/pizzaone/pizzaone```
  no terminal ```bash``` 
  você digita:

        npm run server
   
    assim estára conectando o sistema ao Banco de Dados SQL

<img width="1007" height="240" alt="image" src="https://github.com/user-attachments/assets/f6a9ad2e-b461-4c74-8ab7-a262b76ff614" />

3. Em seguida você deverá  entrar e acessar seu SQL (opcional), eu usei o ```SQL Server Management Studio 21.6.17```:

<img width="1269" height="472" alt="image" src="https://github.com/user-attachments/assets/06150d74-ed68-4420-8d67-2b5115bf5355" />



## 🔌 Rotações de API (Backend)
| Método | Rota | Descrição |
| ---------- | ---------------------- | ----------------------------------- |
|PUBLICAR |/api/pedidos | Cria um pedido |
|PEGAR |/api/pedidos | Lista todos os pedidos |
|EXCLUIR|/api/pedidos/:id | Finaliza e move pedido p/ histórico |
|PUBLICAR |/api/pedidos/:id/nfe | Emite NFe para o pedido |
## 📄 CSV Gerados
| Arquivo | Finalidade |
| ----------------- | ---------------------- |
|ativos.csv | Pedidos ativos na loja |
|histórico.csv | Pedidos finalizados |

## Screenshots 
    npm run dev
<img width="700" height="180" alt="image" src="https://github.com/user-attachments/assets/e0f96c11-acc4-412d-baaa-f3da13909920" />

    npm run server
* <img width="700" height="180" alt="image" src="https://github.com/user-attachments/assets/a5cd7882-11e8-4ac9-94d1-9fef45b66559" />
 # FRONT-END

<img width="800" height="600" alt="image" src="https://github.com/user-attachments/assets/89b0e9f7-6de6-4517-a846-48caff580ed8" />

<img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/96e3db1c-9b20-4960-8bbf-269a0e41df24" /><img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/98a37a93-5944-4573-8806-2348b43fda1b" />






## AUTORES
Heringson Lima ```ra: 2404307```   
Wesley da Silva Santos ```ra: 2522594``` 

```ra: Registro Acadêmico UniAnchieta ⬆⬆```

PizzaOne — Entrega Premium 🚀🍕
