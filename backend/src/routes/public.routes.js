const express = require('express');
const { getPublicChangelog } = require('../controllers/public.controller');

const router = express.Router();

router.get('/:slug', getPublicChangelog);

module.exports = router;