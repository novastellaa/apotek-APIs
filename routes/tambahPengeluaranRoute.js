const express = require('express');
const tapengController = require('../controllers/tambahPengeluaranController');
const app = express();
app.use(express.json());

const routeTapeng = express.Router();

routeTapeng.get('/get', tapengController.getAllTapeng);
routeTapeng.get('/get/:id', tapengController.getTapengById);
routeTapeng.post('/create', tapengController.createTapeng);
routeTapeng.put('/update/:id', tapengController.updateTapeng);
routeTapeng.get('/export-pdf', tapengController.exportTapengToPDF);
// routeTapeng.delete('/delete/:id', tapengController.deleteTapeng);

module.exports = routeTapeng;