# 📋 Task-Control — Sistema Avançado de Gerenciamento de Tarefas

Aplicação web moderna de controle e gestão de tarefas desenvolvida com foco em **Clean Code**, componentização escalável, tipagem estática rigorosa e internacionalização (i18n).

---

## 🛠️ Tecnologias e Stack
* **Framework:** Next.js / React.js
* **Linguagem:** TypeScript (Tipagem Estática Avançada)
* **Estilização:** CSS Modules / Styled Components / Tailwind (conforme configuração em `styles`)
* **Internacionalização:** Suporte a múltiplos idiomas (`i18n`)
* **Gerenciamento de Estado & Hooks:** Custom Hooks e arquitetura modular em `components` e `services`

---

## 📂 Arquitetura do Projeto
O projeto foi estruturado seguindo boas práticas de organização modular para microsserviços frontend e aplicações escaláveis:

```text
task-control/
├── public/            # Ativos estáticos e imagens
├── src/
│   ├── components/    # Componentes de UI reutilizáveis e modulares
│   ├── hooks/         # Custom React Hooks para lógica reutilizável
│   ├── i18n/          # Arquivos de tradução e internacionalização
│   ├── lib/           # Utilitários, clientes de API e configurações de terceiros
│   ├── pages/         # Rotas e páginas da aplicação (Next.js Pages/App Router)
│   ├── services/      # Camada de integração com APIs e requisições externas
│   ├── styles/        # Folhas de estilo globais e módulos CSS
│   └── types/         # Definições de tipos e interfaces TypeScript globais
├── package.json       # Dependências e scripts de automação
└── tsconfig.json      # Configuração rigorosa do compilador TypeScript

```

---

## 🚀 Como Executar o Projeto Localmente

1. Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 18+) e o gerenciador de pacotes (`npm`, `pnpm` ou `yarn`) instalados.
2. Clone este repositório:
```bash
git clone [https://github.com/Davilacovelli/task-control.git](https://github.com/Davilacovelli/task-control.git)
cd task-control

```


3. Instale as dependências:
```bash
npm install
# ou pnpm install / yarn install

```


4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou pnpm dev / yarn dev

```


5. Acesse a aplicação no navegador em `http://localhost:3000`.

---

## 👤 Autor

Desenvolvido por **Davi Iacovelli**

*Estudante de Ciência da Computação — Universidade Veiga de Almeida (UVA)*
