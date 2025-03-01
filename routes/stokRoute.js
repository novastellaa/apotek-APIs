const express = require('express');
const stockController = require('../controllers/stokController');
const app = express();
app.use(express.json());

const routeStock = express.Router();

routeStock.get('/get', stockController.getAllStok);
routeStock.get('/get/:id', stockController.getStokById);
routeStock.post('/create', stockController.createStok);
routeStock.put('/update/:id', stockController.updateStok);
routeStock.delete('/delete/:id', stockController.deleteStok);

module.exports = routeStock;