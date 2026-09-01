const express = require('express');
const router = express.Router();
const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');
const entryRoutes = require('./entry.routes');

// Todas as rotas de projeto exigem estar logado
router.use(authMiddleware);

router.post('/', createProject);
router.get('/', listProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.use('/:projectId/entries', entryRoutes);

module.exports = router;