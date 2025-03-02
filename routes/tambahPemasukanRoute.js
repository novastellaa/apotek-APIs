const express = require('express');
const tapemController = require('../controllers/tambahPemasukanController');
const app = express();
app.use(express.json());

const routeTapem = express.Router();

routeTapem.get('/get', tapemController.getAllTapem);
routeTapem.get('/get/:id', tapemController.getTapemById);
routeTapem.post('/create', tapemController.createTapem);
routeTapem.put('/update/:id', tapemController.updateTapem);
routeTapem.delete('/delete/:id', tapemController.deleteTapem);

module.exports = routeTapem;