function errorHandler(err, req, res, next) {
  console.error(err);

  // Se a resposta já começou a ser enviada, repassa pro handler padrão do Express
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Erro interno no servidor' });
}

module.exports = errorHandler;