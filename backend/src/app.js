// Importa as bibliotecas que acabamos de instalar
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // carrega as variáveis do arquivo .env

// Cria a "aplicação" do Express — é o coração do servidor
const app = express();

// Middlewares: código que roda ANTES de chegar na sua rota de verdade
app.use(cors());           // libera o CORS
app.use(express.json());   // permite receber JSON no corpo das requisições (ex: no login)

// Nossa primeira rota — só pra confirmar que o servidor tá vivo
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Pega a porta do .env, ou usa 3000 como padrão se não existir
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});