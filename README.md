# Easy Order - Sistema de Gestão de Pedidos

## Sobre o Projeto

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de Desenvolvimento de Aplicações Móveis. O Easy Order é um sistema de gestão de pedidos que permite o gerenciamento de empresas, clientes, produtos e pedidos de forma intuitiva e eficiente.

## Tecnologias Utilizadas

- **Ionic Framework**: Framework para desenvolvimento de aplicações híbridas
- **Angular**: Framework front-end para criação de aplicações web
- **TypeScript**: Linguagem de programação tipada baseada em JavaScript
- **RESTful API**: Comunicação com o backend através de API RESTful

## Funcionalidades Principais

### Dashboard
- Visão geral dos principais indicadores (pedidos, vendas, clientes, produtos)
- Lista de pedidos recentes
- Acesso rápido às principais ações

### Gestão de Pedidos
- Criação e edição de pedidos
- Acompanhamento de status (pendente, completo, cancelado)
- Visualização detalhada de itens e valores

### Gestão de Clientes
- Cadastro e manutenção de dados de clientes
- Histórico de pedidos por cliente

### Gestão de Produtos
- Cadastro e manutenção de produtos
- Controle de estoque
- Preços e descrições

### Gestão de Empresas
- Cadastro e gerenciamento de empresas/fornecedores
- Associação de produtos com empresas

## Estrutura do Projeto

O projeto segue a arquitetura modular do Angular, onde cada funcionalidade principal é organizada em módulos independentes:

- **Core**: Componentes, serviços e utilitários compartilhados
- **Home**: Dashboard principal com visão geral do sistema
- **Customer**: Módulo de gerenciamento de clientes
- **Product**: Módulo de gerenciamento de produtos
- **Order**: Módulo de gerenciamento de pedidos
- **Enterprise**: Módulo de gerenciamento de empresas

## Instruções de Instalação

1. Certifique-se de ter o Node.js instalado
2. Instale o Ionic CLI: `npm install -g @ionic/cli`
3. Clone o repositório: `git clone [URL_DO_REPOSITÓRIO]`
4. Navegue até a pasta do projeto: `cd IonicApp`
5. Instale as dependências: `npm install`
6. Execute o projeto: `ionic serve`

## Requisitos Acadêmicos Atendidos

- Desenvolvimento de interface responsiva para múltiplos dispositivos
- Implementação de CRUD completo
- Navegação entre telas e roteamento
- Consumo de API REST
- Validação de formulários
- Gerenciamento de estado da aplicação