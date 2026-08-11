const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  // 1. Pega o cabeçalho Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // 2. O cabeçalho vem no formato "Bearer <token>", precisamos separar
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    // 3. Confere se o token é válido e não expirou
    const decoded = verifyToken(token);

    // 4. Anexa o userId na requisição, pra qualquer rota seguinte usar
    req.userId = decoded.userId;

    // 5. Deixa passar pro próximo passo (a rota de verdade)
    next();

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;