#!/bin/bash

# Nome do projeto
PROJECT_NAME="xtreme-bot"

# Criar diretório do projeto e entrar nele
mkdir $PROJECT_NAME
cd $PROJECT_NAME

# Inicializar um novo projeto Node.js
npm init -y

# Instalar as dependências
npm install venom-bot openai redis dotenv
npm install -g typescript
npm install --save-dev typescript


# Criar a estrutura de diretórios
mkdir -p src/{adapters,chat,utils}

# Criar arquivos iniciais
touch src/index.ts
touch src/adapters/whatsappAdapter.ts
touch src/chat/chatManager.ts
touch src/utils/commonUtils.ts

# Criar arquivos de configuração
touch .env
touch Dockerfile

echo "Projeto $PROJECT_NAME configurado com sucesso."

