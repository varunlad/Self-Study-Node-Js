// routes/auth.routes.js
const express = require('express');
const { authRequired } = require('../middleware/auth');
const { register, login, changePassword } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/change-password', authRequired, changePassword);

module.exports = router;