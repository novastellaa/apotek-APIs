const express = require('express');
const router = express.Router();

const stokRoute = require('./stokRoute');
const kategoriRoute = require('./kategoriRoute');
const userRoute = require('./userRoute');
const tapengRoute = require('./tambahPengeluaranRoute')

router.use('/stok', stokRoute);
router.use('/kategori', kategoriRoute);
router.use('/auth', userRoute);
router.use('/tapeng', tapengRoute);

module.exports = router;