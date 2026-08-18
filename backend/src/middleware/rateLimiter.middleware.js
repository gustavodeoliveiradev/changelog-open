const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // no máximo 5 tentativas nesse período
  message: { error: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
  standardHeaders: true, // retorna info de limite nos headers da resposta
  legacyHeaders: false,
});

module.exports = { loginLimiter };