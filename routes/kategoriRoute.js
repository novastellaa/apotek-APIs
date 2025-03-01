const express = require('express');
const kategoriController = require('../controllers/kategoriController');
const app = express();
app.use(express.json());

const routeKategori = express.Router();

routeKategori.get('/get', kategoriController.getAllKategori);
routeKategori.get('/get/:id', kategoriController.getKategoriById);
routeKategori.post('/create', kategoriController.createKategori);
routeKategori.put('/update/:id', kategoriController.updateKategori);
routeKategori.delete('/delete/:id', kategoriController.deleteKategori);

module.exports = routeKategori;