const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../src/routes/auth.routes'); // NOVO

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes); // NOVO — todas as rotas de auth.routes.js ficam disponíveis com prefixo /api/auth

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});