// routes/user.routes.js
const express = require('express');
const { authRequired } = require('../middleware/auth');
const { me } = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', authRequired, me);

module.exports = router;