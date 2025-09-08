#  Restaurante Elegante



Bem-vindo ao **Restaurante Elegante**, um projeto de site completo e moderno para um restaurante sofisticado. A aplicação foi desenvolvida com React, Vite e Tailwind CSS, utilizando Supabase como backend para gerenciar dados, autenticação e atualizações em tempo real.

---

## ✨ Funcionalidades Principais

O site é dividido em duas grandes áreas: a interface do cliente e o painel administrativo.

### Para Clientes

*   **Navegação Intuitiva:** Uma landing page com seções bem definidas: Destaques, Sobre, Cardápio, Galeria, Depoimentos e Contato.
*   **Autenticação de Usuário:** Sistema de login e cadastro via modal, com suporte para E-mail/Senha e login social com Google.
*   **Reservas Online:** Usuários autenticados podem solicitar, alterar e cancelar reservas através de um formulário intuitivo.
*   **Gerenciamento de Reservas:** Uma página dedicada ("Minhas Reservas") onde o cliente pode acompanhar o status de suas solicitações (Pendente, Confirmada, Cancelada).
*   **Depoimentos Interativos:** Um carrossel animado exibe as opiniões de outros clientes. Usuários logados podem deixar e editar seus próprios depoimentos, incluindo sua foto de perfil do Google.
*   **Perfil de Usuário:** Página "Meus Dados" para que o cliente possa atualizar suas informações de contato.



### Para Administradores

*   **Painel de Controle Seguro:** Uma rota `/admin` protegida por login para gerenciamento completo do restaurante.
*   **Dashboard Analítico:** Visão geral com estatísticas diárias (reservas, total de pessoas), gráficos de desempenho e uma lista das próximas reservas pendentes.
*   **Atualizações em Tempo Real:** Todas as seções do painel (Dashboard, Reservas, Cardápio, Categorias) são atualizadas automaticamente e em tempo real assim que um novo dado é inserido no banco, com notificações visuais para o admin.
*   **Gerenciamento de Reservas:** Interface para confirmar ou cancelar as solicitações de reserva dos clientes.
*   **Gerenciamento de Cardápio:** CRUD (Criar, Ler, Atualizar, Deletar) completo para os itens do cardápio.
*   **Gerenciamento de Categorias:** CRUD completo para as categorias dos pratos (ex: Entradas, Pratos Principais, Sobremesas).



---

## 🛠️ Tecnologias Utilizadas

*   **Frontend:**
    *   **React** - Biblioteca para construção de interfaces de usuário.
    *   **Vite** - Ferramenta de build moderna e rápida com Hot Module Replacement (HMR).
    *   **React Router** - Para gerenciamento de rotas na aplicação.
    *   **Tailwind CSS** - Framework CSS utility-first para estilização rápida e responsiva.
    *   **Framer Motion** - Para animações fluidas e interativas.
    *   **Lucide React** - Biblioteca de ícones.

*   **Backend (BaaS - Backend as a Service):**
    *   **Supabase** - Plataforma open-source que oferece banco de dados PostgreSQL, autenticação, armazenamento e APIs automáticas.
        *   **Database:** Para armazenar todas as informações (reservas, cardápio, depoimentos, etc).
        *   **Auth:** Gerencia o login e cadastro de usuários.
        *   **Realtime Subscriptions:** Fornece as atualizações em tempo real para o painel administrativo.

---

## 🚀 Como Executar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/restaurante-elegante.git
    cd restaurante-elegante
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    *   Crie uma conta no Supabase.
    *   Crie um novo projeto e configure as tabelas necessárias (reservas, clientes, itens_cardapio, etc.).
    *   Na raiz do projeto, crie um arquivo chamado `.env` e adicione suas chaves do Supabase:
    ```
    VITE_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
    VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA
    VITE_SUPABASE_SERVICE_KEY=SUA_CHAVE_DE_SERVICO
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Abra http://localhost:5173 (ou a porta indicada no seu terminal) no seu navegador para ver a aplicação.

---

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── Admin/         # Componentes específicos do painel admin
│   ├── pages/         # Componentes que representam seções de uma página
│   ├── sections/      # Componentes de seções da landing page (Hero, Sobre, etc.)
│   └── ui/            # Componentes de UI reutilizáveis (Button, Modal, etc.)
├── config/
│   ├── hooks/         # Hooks customizados (ex: useAuth)
│   └── SupabaseClient.js # Configuração do cliente Supabase
├── pages/
│   ├── Admin/         # Páginas do painel admin (Login, PainelAdmin)
│   └──                # Páginas principais da aplicação (LandingPage, MinhasReservas, etc.)
├── App.jsx            # Componente raiz que gerencia as rotas
└── main.jsx           # Ponto de entrada da aplicação React
```

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
