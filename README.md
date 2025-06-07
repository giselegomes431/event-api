# API de Gestão de Eventos

![Node.js](https://img.shields.io/badge/Node.js-18.x-blue?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-green?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.x-lightgrey?style=for-the-badge&logo=prisma)
![License](https://img.shields.io/badge/license-MIT-informational?style=for-the-badge)

API RESTful completa para criação e gerenciamento de eventos, com sistema de autenticação de usuários via JWT. Este projeto serve como um backend robusto, pronto para ser consumido por qualquer aplicação frontend (web ou mobile).

## Tabela de Conteúdos

1.  [Sobre o Projeto](#sobre-o-projeto)
2.  [Funcionalidades](#funcionalidades)
3.  [Tecnologias Utilizadas](#tecnologias-utilizadas)
4.  [Instalação e Execução Local](#instalação-e-execução-local)
5.  https://www.data.gouv.fr/fr/dataservices/?q=(#url-da-api-em-produção)
6.  [Como Consumir a API](#como-consumir-a-api)
    - [Guia Rápido com Postman](#guia-rápido-com-postman)
    - [Guia para Aplicações Frontend (JavaScript)](#guia-para-aplicações-frontend-javascript)
7.  [Endpoints da API](#endpoints-da-api)
8.  [Autor](#autor)

## Sobre o Projeto

Esta API foi desenvolvida para ser a base de uma plataforma de eventos. Ela permite que usuários se cadastrem, criem eventos, gerenciem os eventos que criaram e se inscrevam em eventos de outros usuários. A segurança é garantida pela autenticação baseada em tokens JWT, assegurando que apenas usuários autorizados possam realizar ações restritas.

## Funcionalidades

- ✅ **Autenticação de Usuários:** Cadastro e Login seguros com senhas criptografadas (Bcrypt).
- ✅ **Autorização por Token:** Rotas protegidas utilizando JSON Web Token (JWT).
- ✅ **Gestão de Eventos (CRUD):** Funcionalidades completas para Criar, Ler, Atualizar e Deletar eventos.
- ✅ **Controle de Permissão:** Apenas o criador de um evento pode alterá-lo ou excluí-lo.
- ✅ **Inscrição em Eventos:** Permite que usuários logados se inscrevam em eventos.

## Tecnologias Utilizadas

- **Backend:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/pt-br/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autenticação:** [Bcrypt.js](https://www.npmjs.com/package/bcryptjs), [JSON Web Token](https://www.npmjs.com/package/jsonwebtoken)
- **Hospedagem:** [Render](https://render.com/)

## Instalação e Execução Local

Para rodar este projeto na sua máquina local, siga os passos abaixo.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (recomendado para rodar o PostgreSQL facilmente)

### Passos
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/NOME_DO_SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_SEU_REPOSITORIO.git)
    cd NOME_DO_SEU_REPOSITORIO
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure e inicie o banco de dados PostgreSQL com Docker:**
    ```bash
    docker run --name postgres-events -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
    ```
4.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:
    ```env
    DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"
    JWT_SECRET="UMA_CHAVE_SECRETA_MUITO_FORTE_E_LONGA"
    ```
5.  **Execute as Migrações do Banco de Dados:**
    ```bash
    npx prisma migrate dev
    ```
6.  **Inicie a aplicação:**
    ```bash
    npm run dev
    ```

## URL da API em Produção

A API está hospedada no Render e pode ser acessada publicamente através da URL:

**[https://api-de-eventos.onrender.com](https://api-de-eventos.onrender.com)**

## Como Consumir a API

### Guia Rápido com Postman

A forma mais fácil de testar e interagir com a API é usando o [Postman](https://www.postman.com/).

#### Configuração Inicial

1.  **Crie um Ambiente:** No Postman, crie um "Environment" e adicione uma variável `baseURL` com o valor `https://api-de-eventos.onrender.com`.
2.  **Selecione o Ambiente:** Garanta que este ambiente esteja selecionado no canto superior direito do Postman ao fazer as requisições.

#### Passo 1: Registrar um Novo Usuário
- **Método:** `POST`
- **URL:** `{{baseURL}}/auth/register`
- **Body:** Vá para a aba `Body` -> `raw` -> `JSON` e insira:
  ```json
  {
    "name": "Seu Nome",
    "email": "seu-email@dominio.com",
    "password": "senhaforte"
  }
  ```

#### Passo 2: Fazer Login e Obter o Token 🔑
- **Método:** `POST`
- **URL:** `{{baseURL}}/auth/login`
- **Body:** `Body` -> `raw` -> `JSON`:
  ```json
  {
    "email": "seu-email@dominio.com",
    "password": "senhaforte"
  }
  ```
- **➡️ Ação:** A resposta conterá um `token`. **Copie este valor**, pois ele é sua chave de acesso para as próximas etapas.

#### Passo 3: Fazer uma Requisição Autenticada (Ex: Criar Evento)
- **Método:** `POST`
- **URL:** `{{baseURL}}/events`
- **Authorization:**
    1. Vá para a aba `Authorization`.
    2. Selecione o tipo (Type) **`Bearer Token`**.
    3. No campo "Token" à direita, **cole o token** que você copiou.
- **Body:** `Body` -> `raw` -> `JSON`:
  ```json
  {
      "title": "Meu Primeiro Evento",
      "description": "Descrição do meu evento.",
      "date": "2025-12-01T20:00:00Z",
      "location": "Online"
  }
  ```
Este método de usar o `Bearer Token` na aba `Authorization` deve ser repetido para todas as rotas que exigem autenticação.

### Guia para Aplicações Frontend (JavaScript)

Uma aplicação frontend irá consumir esta API fazendo requisições HTTP com `fetch` ou `axios`. O fluxo principal gira em torno do gerenciamento do token JWT.

#### Passo 1: Fazer Login e Salvar o Token

Após o usuário enviar o formulário de login, sua aplicação deve fazer a requisição e, se bem-sucedida, salvar o token recebido no `localStorage` do navegador.

```javascript
async function fazerLogin(email, password) {
    const response = await fetch('[https://api-de-eventos.onrender.com/auth/login](https://api-de-eventos.onrender.com/auth/login)', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
        // Salva o token para uso futuro
        localStorage.setItem('authToken', data.token);
        alert('Login realizado com sucesso!');
        // Redirecionar ou atualizar a UI
    } else {
        alert('Erro: ' + data.error);
    }
}
```

#### Passo 2: Fazer Requisições Autenticadas

Para qualquer ação que exija login (criar, atualizar, deletar), sua aplicação deve ler o token do `localStorage` e enviá-lo no cabeçalho `Authorization`.

```javascript
async function criarEvento(dadosDoEvento) {
    // Pega o token salvo no passo anterior
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        return;
    }

    try {
        const response = await fetch('[https://api-de-eventos.onrender.com/events](https://api-de-eventos.onrender.com/events)', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Anexa o token no formato "Bearer"
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosDoEvento)
        });

        const resultado = await response.json();

        if (!response.ok) {
            alert(`Erro: ${resultado.error}`);
        } else {
            alert('Evento criado com sucesso!');
        }
    } catch (error) {
        console.error("Falha na comunicação com a API:", error);
    }
}
```

#### Passo 3: Fazer Logout

O logout é uma ação do lado do cliente. Basta remover o token do `localStorage`.

```javascript
function fazerLogout() {
    localStorage.removeItem('authToken');
    alert('Você foi desconectado.');
    // Redirecionar para a página inicial ou de login
}
```

## Endpoints da API

A seguir, a documentação de referência para todos os endpoints.

### Autenticação
| Rota             | Método | Descrição                    | Autenticação |
| ---------------- | ------ | ------------------------------ | ------------ |
| `/auth/register` | `POST` | Registra um novo usuário.      | Pública      |
| `/auth/login`    | `POST` | Autentica um usuário e retorna um token JWT. | Pública      |

### Eventos
| Rota                     | Método   | Descrição                                 | Autenticação         |
| ------------------------ | -------- | ----------------------------------------- | -------------------- |
| `/events`                | `GET`    | Retorna uma lista de todos os eventos.    | Pública              |
| `/events/:id`            | `GET`    | Retorna os detalhes de um evento específico. | Pública              |
| `/events`                | `POST`   | Cria um novo evento.                      | **Requer Token JWT** |
| `/events/:id`            | `PUT`    | Atualiza um evento existente.             | **Requer Token JWT** |
| `/events/:id`            | `DELETE` | Deleta um evento.                         | **Requer Token JWT** |
| `/events/:id/register`   | `POST`   | Inscreve o usuário logado em um evento.   | **Requer Token JWT** |


## Autor

- **Arthur**
- **Dominique**
- **Gisele**
- **João Victor**
- **Lukas**
