# EventoSENAI 🎓

> **Plataforma de Gerenciamento de Eventos Escolares do SENAI**
>
> Sistema completo para consultar eventos, cadastrar participantes e realizar inscrições em palestras, oficinas e workshops — com banco de dados MySQL, API REST em Node.js e front-end em Next.js.

---

## 📋 Objetivo do Projeto

O EventoSENAI é uma atividade prática de **Banco de Dados, API REST e Front-end** que demonstra a integração entre três camadas:

1. **Banco de dados relacional** (MySQL 8) com PK, FK, UNIQUE e CHECK.
2. **API REST** (Node.js 20 + Express) que consulta e altera o banco.
3. **Front-end** (Next.js 14 + React) que consome a API exclusivamente via `fetch`.

---

## 🛠️ Tecnologias Utilizadas

| Camada       | Tecnologia                            |
|-------------|---------------------------------------|
| Banco        | MySQL 8                               |
| API          | Node.js 20+, Express 4, mysql2, cors, dotenv |
| Front-end    | Next.js 14, React 18, JavaScript      |
| Estilização  | CSS puro (sem frameworks)             |
| HTTP         | fetch nativo                          |
| Testes       | Thunder Client / Postman              |

---

## 📁 Estrutura de Pastas

```
eventosenai/
├── database/
│   ├── script.sql          ← Script completo do banco
│   └── DER.png             ← Diagrama Entidade-Relacionamento
├── api/
│   ├── src/
│   │   ├── db.js           ← Pool de conexões MySQL
│   │   ├── server.js       ← Servidor Express
│   │   └── routes/
│   │       ├── eventos.js
│   │       ├── participantes.js
│   │       └── inscricoes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── eventosenai-thunder-collection.json
├── front/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/
│   │   ├── EventoCard.js
│   │   ├── FormParticipante.js
│   │   └── FormInscricao.js
│   ├── lib/
│   │   └── api.js
│   ├── .env.local.example
│   └── package.json
├── README.md
└── .gitignore
```

---

## ✅ Pré-requisitos

- **Node.js** 20 ou superior — [nodejs.org](https://nodejs.org)
- **MySQL Server** 8 — [mysql.com](https://dev.mysql.com/downloads/)
- **MySQL Workbench** — para executar o script SQL
- **Git** — opcional, para versionamento

---

## 🗄️ 1. Configurar o Banco de Dados (MySQL Workbench)

### Passo a passo:

1. Abra o **MySQL Workbench** e conecte ao servidor local.
2. No menu superior, clique em **File → Open SQL Script…**
3. Navegue até `eventosenai/database/script.sql` e abra o arquivo.
4. Pressione **Ctrl+Shift+Enter** (ou clique no ⚡ *Execute All*) para rodar todo o script.
5. Aguarde a execução. Se não houver erros, o banco `eventosenai` estará criado com dados de teste.

> **Dica:** Para confirmar, execute no Workbench:
> ```sql
> USE eventosenai;
> SELECT * FROM eventos;
> SELECT * FROM participantes;
> SELECT * FROM inscricoes;
> ```

---

## ⚙️ 2. Configurar e Iniciar a API

### 2.1 Entrar na pasta da API

```powershell
cd eventosenai\api
```

### 2.2 Instalar as dependências

```powershell
npm install
```

### 2.3 Criar o arquivo `.env`

Copie o arquivo de exemplo e preencha com suas credenciais reais:

```powershell
copy .env.example .env
```

Edite `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=eventosenai

PORT=3333
```

> ⚠️ **NUNCA** versione o arquivo `.env` no Git. Ele já está no `.gitignore`.

### 2.4 Iniciar a API

```powershell
npm run dev
```

Saída esperada:

```
✅ Conexão com MySQL estabelecida com sucesso.
🚀 EventoSENAI API rodando em http://localhost:3333
```

> Para produção, use `npm start` (sem o nodemon).

---

## 🌐 3. Configurar e Iniciar o Front-end

### 3.1 Entrar na pasta do front-end

```powershell
cd ..\front
```

(ou a partir da raiz: `cd eventosenai\front`)

### 3.2 Instalar as dependências

```powershell
npm install
```

### 3.3 Criar o arquivo `.env.local`

```powershell
copy .env.local.example .env.local
```

O conteúdo já está correto para desenvolvimento local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### 3.4 Iniciar o front-end

```powershell
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🧪 4. Testar as Rotas com Thunder Client

### Importar a coleção:

1. No VS Code, abra o Thunder Client.
2. Clique em **Collections → Import**.
3. Selecione `eventosenai/api/eventosenai-thunder-collection.json`.
4. A coleção **EventoSENAI - API Tests** aparecerá com todos os 17 testes.

### Rotas disponíveis:

| Método | Rota                       | Descrição                             | Status |
|--------|----------------------------|---------------------------------------|--------|
| GET    | `/health`                  | Saúde da API                          | 200    |
| GET    | `/eventos`                 | Lista eventos com vagas               | 200    |
| GET    | `/eventos/:id`             | Detalha um evento                     | 200    |
| POST   | `/eventos`                 | Cria evento                           | 201    |
| PUT    | `/eventos/:id`             | Atualiza evento                       | 200    |
| DELETE | `/eventos/:id`             | Exclui evento                         | 204    |
| GET    | `/eventos/:id/inscritos`   | Lista inscritos do evento             | 200    |
| GET    | `/participantes`           | Lista participantes                   | 200    |
| POST   | `/participantes`           | Cadastra participante                 | 201    |
| POST   | `/inscricoes`              | Realiza inscrição                     | 201    |
| DELETE | `/inscricoes/:id`          | Cancela inscrição                     | 204    |

---

## 🔄 5. Teste de Ponta a Ponta

Execute este fluxo completo para validar o sistema:

1. **Abra** `http://localhost:3000` no navegador.
2. Confira a listagem de eventos na aba **Eventos**.
3. Navegue para a aba **Inscrições**.
4. **Cadastre** um novo participante pelo formulário.
5. No formulário de inscrição, selecione um evento e o participante recém-cadastrado.
6. Clique em **Confirmar Inscrição**.
7. Observe a mensagem de sucesso e a atualização das vagas restantes.
8. Volte à aba **Eventos** e confirme as vagas atualizadas.
9. Clique em **Ver inscritos** em qualquer evento e veja a lista.
10. **No MySQL Workbench**, execute:
    ```sql
    USE eventosenai;
    SELECT * FROM inscricoes ORDER BY id DESC LIMIT 5;
    ```
    O registro deve aparecer.

---

## 🐛 Solução de Problemas Comuns

### ❌ `Error: connect ECONNREFUSED 127.0.0.1:3306`
- O MySQL não está rodando. Abra o **MySQL Workbench** e verifique a conexão.
- No Windows: `Serviços → MySQL80 → Iniciar`.

### ❌ `Access denied for user 'root'@'localhost'`
- A senha no `.env` está incorreta. Corrija `DB_PASSWORD`.

### ❌ CORS error no navegador
- A API não está rodando em `http://localhost:3333`.
- Verifique se o `npm run dev` da API está ativo e sem erros.
- A origem `http://localhost:3000` já está liberada no CORS da API.

### ❌ `Port 3333 already in use`
- Outro processo está usando a porta. Encerre-o ou mude `PORT` no `.env`:
  ```powershell
  netstat -ano | findstr :3333
  taskkill /PID <PID> /F
  ```

### ❌ `Port 3000 already in use` (Next.js)
- O Next.js tentará automaticamente a porta 3001. Atualize `NEXT_PUBLIC_API_URL` se necessário.

### ❌ Script SQL com erro de chave estrangeira
- Execute na ordem exata do script (categorias → eventos → participantes → inscricoes).
- O `SET FOREIGN_KEY_CHECKS=0` não é necessário pois o script já respeita a ordem.

---

## 🔒 Segurança — Manter `.env` fora do GitHub

Confirme que o `.gitignore` está funcionando:

```powershell
git status
```

Os arquivos `.env` e `.env.local` **não devem aparecer** na lista de arquivos a commitar.

Se aparecerem, remova do cache:

```powershell
git rm --cached api/.env
git rm --cached front/.env.local
```

Use apenas os arquivos `.env.example` e `.env.local.example` (sem senhas) para documentar as variáveis esperadas.

---

## 📐 DER — Diagrama Entidade-Relacionamento

```
┌──────────────┐         ┌──────────────────────┐
│  categorias  │         │       eventos         │
├──────────────┤  1   N  ├──────────────────────┤
│ PK id        │─────────│ PK id                │
│ nome (UNIQUE)│         │    titulo             │
└──────────────┘         │    descricao          │
                         │    data_evento        │
                         │    local              │
                         │    vagas (CHECK > 0)  │
                         │ FK categoria_id       │
                         └──────────┬───────────┘
                                    │ 1
                                    │
                                    │ N
                         ┌──────────┴───────────┐
                         │      inscricoes       │
                         ├──────────────────────┤
                         │ PK id                │
                         │ FK evento_id         │──────┐
                         │ FK participante_id   │──┐   │
                         │    data_inscricao    │  │   │
                         │ UQ(evento, part.)    │  │   │
                         └──────────────────────┘  │   │
                                                   │ N │
                                    ┌──────────────┘   │
                         ┌──────────┴───────────┐      │
                         │    participantes      │      │
                         ├──────────────────────┤      │
                         │ PK id                │      │
                         │    nome              │      │
                         │    email (UNIQUE)    │      │
                         │    turma             │      │
                         └──────────────────────┘      │
                                    └──────────── 1 ───┘
```

> Para gerar o DER como imagem PNG, importe o `script.sql` no **MySQL Workbench** e use:
> **Database → Reverse Engineer** → selecione `eventosenai` → **Export as PNG**.

---

## 👨‍💻 Desenvolvido para

Atividade Prática — Banco de Dados, API REST e Front-end  
**SENAI** — Serviço Nacional de Aprendizagem Industrial
