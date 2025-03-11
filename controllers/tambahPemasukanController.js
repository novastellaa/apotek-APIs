const { tambahPemasukan, stok } = require('../models');

// Create pemasukan & update stok
exports.createTapem = async(req, res) => {
    const { id_user, tanggal, id_stock, jumlah, totalHarga } = req.body;
    try {
        // Cek apakah stok dengan id_stock ada di tabel stok
        const barang = await stok.findOne({ where: { id: id_stock } });

        if (!barang) {
            return res.status(404).json({
                success: false,
                message: `Barang dengan ID ${id_stock} tidak ditemukan!`
            });
        }

        // Pastikan jumlah stok tidak null atau undefined
        if (barang.stock === null || barang.stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Stok barang tidak valid atau belum diatur!"
            });
        }

        // Pastikan jumlah yang dimasukkan tidak negatif
        if (jumlah <= 0) {
            return res.status(400).json({
                success: false,
                message: "Jumlah pemasukan harus lebih dari 0!"
            });
        }

        // Tambah data ke tabel tambahPemasukan
        const createTapem = await tambahPemasukan.create({
            id_user,
            tanggal,
            id_stock,
            jumlah,
            totalHarga
        });

        // Update stok di tabel stok
        const newStock = barang.stock - jumlah;
        if (newStock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stok tidak mencukupi untuk pemasukan ini!"
            });
        }

        const [updated] = await stok.update({ stock: newStock }, { where: { id: id_stock } });

        if (updated === 0) {
            return res.status(500).json({
                success: false,
                message: "Gagal memperbarui stok!"
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Pemasukan berhasil ditambahkan & stok diperbarui!',
            data: {
                pemasukan: createTapem,
                stok_terbaru: { id: id_stock, namaBarang: barang.namaBarang, stock: newStock }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengurangi pemasukan!',
            error: error.message
        });
    }
};


// Get All pemasukan
exports.getAllTapem = async(req, res) => {
    try {
        const getAllTapem = await tambahPemasukan.findAll({
            attributes: ['id', 'id_user', 'tanggal', 'id_stock', 'jumlah', 'totalHarga'],
        });
        if (getAllTapem.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada data pemasukan yang ditemukan!'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Data berhasil diambil!',
            total: getAllTapem.length,
            data: getAllTapem
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data!',
            error: error.message
        });
    }
};

// Get pemasukan by Id
exports.getTapemById = async(req, res) => {
    const { id } = req.params;
    try {
        const getTapemById = await tambahPemasukan.findOne({
            where: { id },
            attributes: ['id', 'id_user', 'tanggal', 'id_stock', 'jumlah', 'totalHarga', 'createdAt', 'updatedAt']
        });
        if (!getTapemById) {
            return res.status(404).json({
                success: false,
                message: `Data dengan ID ${id} tidak ditemukan!`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data berhasil ditemukan!',
            data: getTapemById
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data!',
            error: error.message
        });
    }
};

// Update pemasukan
exports.updateTapem = async(req, res) => {
    const { id } = req.params;
    const { id_user, tanggal, id_stock, jumlah, totalHarga } = req.body;
    try {
        const TapemData = await tambahPemasukan.findOne({ where: { id } });

        if (!TapemData) {
            return res.status(404).json({
                success: false,
                message: `Data dengan ID ${id} tidak ditemukan!`
            });
        }
        await tambahPemasukan.update({
            id_user,
            tanggal,
            id_stock,
            jumlah,
            totalHarga
        }, { where: { id } });

        const updateTapem = await tambahPemasukan.findOne({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Data berhasil diperbarui!',
            data: updateTapem
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data!',
            error: error.message
        });
    }
};


// Delete pemasukan
exports.deleteTapem = async(req, res) => {
    const { id } = req.params;
    try {
        const TapemData = await tambahPemasukan.findOne({ where: { id }, attributes: ['id', 'id_user', 'tanggal', 'id_stock', 'jumlah', 'totalHarga', 'createdAt', 'updatedAt'] });

        if (!TapemData) {
            return res.status(404).json({
                success: false,
                message: `Data dengan ID ${id} tidak ditemukan!`
            });
        }
        await tambahPemasukan.destroy({ where: { id }, attributes: ['id', 'id_user', 'tanggal', 'id_stock', 'jumlah', 'totalHarga', 'createdAt', 'updatedAt'] });
        return res.status(200).json({
            success: true,
            message: 'Data berhasil dihapus!',
            deletedData: TapemData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus data!',
            error: error.message
        });
    }
};