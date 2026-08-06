const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1. Validação básica — nunca confie no que vem do cliente
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha precisa ter no mínimo 6 caracteres' });
    }

    // 2. Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está cadastrado' });
    }

    // 3. Gera o hash da senha (nunca salvamos a senha original)
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Cria o usuário no banco
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    // 5. Retorna sucesso, MAS sem devolver o passwordHash na resposta
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao registrar usuário' });
  }
}

module.exports = { register };