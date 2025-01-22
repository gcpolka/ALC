const express = require('express'); // Require express directly
const authController = require('../controllers/authController');

const authRouter = express.Router(); 

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

module.exports = authRouter;
