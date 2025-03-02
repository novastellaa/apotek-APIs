const { stok, tambahPengeluaran } = require('../models');

// Create stok
exports.createStok = async(req, res) => {
    const { namaBarang, stock, hargaJual, hargaBeli } = req.body;
    try {
        // Tambahkan stok baru ke tabel stok
        const createStok = await stok.create({
            namaBarang,
            stock,
            hargaBeli,
            hargaJual
        });

        // Setelah stok dibuat, tambahkan ke tabel tambahPengeluaran
        await tambahPengeluaran.create({
            stokId: createStok.id, // ID stok yang baru dibuat
            namaBarang: createStok.namaBarang,
            jumlah: createStok.stock, // Bisa diisi sesuai kebutuhan
            hargaBeli: createStok.hargaBeli
        });

        return res.status(201).json({
            success: true,
            message: 'Data stok dan pengeluaran berhasil ditambahkan!',
            data: createStok
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menambahkan data stok!',
            error: error.message
        });
    }
};

// Get All stok
exports.getAllStok = async(req, res) => {
    try {
        const getAllStok = await stok.findAll();
        return res.status(200).json({
            success: true,
            message: 'Data stok berhasil diambil!',
            total: getAllStok.length,
            data: getAllStok
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data stok!',
            error: error.message
        });
    }
};

// Get stok by Id
exports.getStokById = async(req, res) => {
    const { id } = req.params;
    try {
        const getstokById = await stok.findOne({
            where: { id }
        });

        if (!getstokById) {
            return res.status(404).json({
                success: false,
                message: `Data stok dengan ID ${id} tidak ditemukan!`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data stok berhasil ditemukan!',
            data: getstokById
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data stok!',
            error: error.message
        });
    }
};

// Update stok
exports.updateStok = async(req, res) => {
    const { id } = req.params;
    const { namaBarang, hargaJual, hargaBeli } = req.body;
    try {
        const stokData = await stok.findOne({ where: { id } });

        if (!stokData) {
            return res.status(404).json({
                success: false,
                message: `Data stok dengan ID ${id} tidak ditemukan!`
            });
        }

        await stok.update({
            namaBarang,
            hargaBeli,
            hargaJual
        }, { where: { id } });

        const updatedStok = await stok.findOne({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Data stok berhasil diperbarui!',
            data: updatedStok
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data stok!',
            error: error.message
        });
    }
};

// Delete stok
exports.deleteStok = async(req, res) => {
    const { id } = req.params;
    try {
        const stokData = await stok.findOne({ where: { id } });

        if (!stokData) {
            return res.status(404).json({
                success: false,
                message: `Data stok dengan ID ${id} tidak ditemukan!`
            });
        }

        await stok.destroy({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Data stok berhasil dihapus!',
            deletedData: stokData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus data stok!',
            error: error.message
        });
    }
};