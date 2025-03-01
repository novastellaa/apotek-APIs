const { kategori } = require('../models');

// Create kategori
exports.createKategori = async(req, res) => {
    const { namaKategori } = req.body;
    try {
        const createKategori = await kategori.create({
            namaKategori: namaKategori
        });
        return res.status(201).json({
            success: true,
            message: 'Data kategori berhasil ditambahkan!',
            data: createKategori
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menambahkan data kategori!',
            error: error.message
        });
    }
};

// Get All kategori
exports.getAllKategori = async(req, res) => {
    try {
        const getAllKategori = await kategori.findAll();
        return res.status(200).json({
            success: true,
            message: 'Data kategori berhasil diambil!',
            total: getAllKategori.length,
            data: getAllKategori
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori!',
            error: error.message
        });
    }
};

// Get kategori by Id
exports.getKategoriById = async(req, res) => {
    const { id } = req.params;
    try {
        const getKategoriById = await kategori.findOne({
            where: { id }
        });

        if (!getKategoriById) {
            return res.status(404).json({
                success: false,
                message: `Data kategori dengan ID ${id} tidak ditemukan!`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data kategori berhasil ditemukan!',
            data: getKategoriById
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori!',
            error: error.message
        });
    }
};

// Update kategori
exports.updateKategori = async(req, res) => {
    const { id } = req.params;
    const { namaKategori } = req.body;
    try {
        const kategoriData = await kategori.findOne({ where: { id } });

        if (!kategoriData) {
            return res.status(404).json({
                success: false,
                message: `Data kategori dengan ID ${id} tidak ditemukan!`
            });
        }
        await kategori.update({
            namaKategori
        }, { where: { id } });

        const updatedkategori = await kategori.findOne({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Data kategori berhasil diperbarui!',
            data: updatedkategori
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data kategori!',
            error: error.message
        });
    }
};

// Delete kategori
exports.deleteKategori = async(req, res) => {
    const { id } = req.params;
    try {
        const kategoriData = await kategori.findOne({ where: { id } });

        if (!kategoriData) {
            return res.status(404).json({
                success: false,
                message: `Data kategori dengan ID ${id} tidak ditemukan!`
            });
        }

        await kategori.destroy({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Data kategori berhasil dihapus!',
            deletedData: kategoriData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus data kategori!',
            error: error.message
        });
    }
};