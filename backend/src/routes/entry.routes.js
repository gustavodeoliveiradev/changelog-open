const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createEntry,
  listEntries,
  updateEntry,
  deleteEntry,
} = require('../controllers/entry.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', createEntry);
router.get('/', listEntries);
router.put('/:entryId', updateEntry);
router.delete('/:entryId', deleteEntry);

module.exports = router;