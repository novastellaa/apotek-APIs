const express = require('express');
const userController = require('../controllers/userController');
const app = express();
app.use(express.json());

const routeUser = express.Router();

routeUser.post('/regist', userController.createUser);
routeUser.post('/login', userController.loginUser);
routeUser.delete('/delete', userController.loginUser);

module.exports = routeUser;