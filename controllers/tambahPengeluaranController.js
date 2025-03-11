const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { tambahPengeluaran, stok, user, kategori } = require('../models');

// Create pengeluaran & update stok
exports.createTapeng = async(req, res) => {
    const { id_user, tanggal, id_stock, id_kategori, jumlah, totalHarga } = req.body;

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
                message: "Jumlah pengeluaran harus lebih dari 0!"
            });
        }

        // Tambah data ke tabel tambahPengeluaran
        const createTapeng = await tambahPengeluaran.create({
            id_user,
            tanggal,
            id_stock,
            id_kategori,
            jumlah,
            totalHarga
        });

        // Update stok di tabel stok
        const newStock = barang.stock + jumlah;
        if (newStock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stok tidak mencukupi untuk pengeluaran ini!"
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
            message: 'Pengeluaran berhasil ditambahkan & stok diperbarui!',
            data: {
                pengeluaran: createTapeng,
                stok_terbaru: { id: id_stock, namaBarang: barang.namaBarang, stock: newStock }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menambahkan pengeluaran!',
            error: error.message
        });
    }
};


// Get All pengeluaran
exports.getAllTapeng = async(req, res) => {
    try {
        const getAllTapeng = await tambahPengeluaran.findAll({
            attributes: ['id', 'id_user', 'tanggal', 'id_stock', 'id_kategori', 'jumlah', 'totalHarga'],
        });
        if (getAllTapeng.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada data pengeluaran yang ditemukan!'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Data berhasil diambil!',
            total: getAllTapeng.length,
            data: getAllTapeng
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data!',
            error: error.message
        });
    }
};

// Get pengeluaran by Id
exports.getTapengById = async(req, res) => {
    const { id } = req.params;
    try {
        const getTapengById = await tambahPengeluaran.findOne({
            where: { id },
            attributes: ['id', 'id_user', 'tanggal', 'id_kategori', 'id_stock', 'jumlah', 'totalHarga', 'createdAt', 'updatedAt']
        });
        if (!getTapengById) {
            return res.status(404).json({
                success: false,
                message: `Data dengan ID ${id} tidak ditemukan!`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data berhasil ditemukan!',
            data: getTapengById
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data!',
            error: error.message
        });
    }
};

// Update pengeluaran
exports.updateTapeng = async(req, res) => {
    const { id } = req.params;
    const { id_user, tanggal, id_stock, id_kategori, jumlah, totalHarga } = req.body;
    try {
        const TapengData = await tambahPengeluaran.findOne({ where: { id } });

        if (!TapengData) {
            return res.status(404).json({
                success: false,
                message: `Data dengan ID ${id} tidak ditemukan!`
            });
        }
        await tambahPengeluaran.update({
            id_user,
            tanggal,
            id_stock,
            id_kategori,
            jumlah,
            totalHarga
        }, { where: { id } });

        const updateTapeng = await tambahPengeluaran.findOne({ where: { id } });

        return res.status(200).json({
            success: true,
            message: 'Data berhasil diperbarui!',
            data: updateTapeng
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data!',
            error: error.message
        });
    }
};

exports.exportTapengToPDF = async(req, res) => {
    try {
        const pengeluaran = await tambahPengeluaran.findAll({
            include: [
                { model: user, attributes: ['namaPengguna'] },
                { model: stok, attributes: ['namaBarang'] },
                { model: kategori, attributes: ['namaKategori'] }
            ],
            attributes: ['id', 'tanggal', 'jumlah', 'totalHarga'],
            order: [
                ['tanggal', 'DESC']
            ]
        });

        if (pengeluaran.length === 0) {
            return res.status(404).json({ success: false, message: 'Tidak ada data pengeluaran!' });
        }

        // Nama file PDF
        const fileName = `Laporan_Pengeluaran_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../public/reports', fileName);

        // Buat direktori jika belum ada
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        const doc = new PDFDocument({ margin: 30 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header PDF
        doc.fontSize(18).text('Laporan Pengeluaran', { align: 'center' });
        doc.moveDown();

        // Tambahkan tabel laporan
        doc.fontSize(12);
        pengeluaran.forEach((item, index) => {
            doc.text(`ID: ${item.id}`);
            doc.text(`Tanggal: ${item.tanggal}`);
            doc.text(`Nama Barang: ${item.stok?.namaBarang || '-'}`);
            doc.text(`Kategori: ${item.kategori?.namaKategori || '-'}`);
            doc.text(`Jumlah: ${item.jumlah}`);
            doc.text(`Total Harga: Rp ${item.totalHarga}`);
            doc.moveDown();
            if (index < pengeluaran.length - 1) doc.moveDown();
        });

        doc.end();

        stream.on('finish', () => {
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ success: false, message: 'Gagal mengunduh laporan!' });
                }
                fs.unlinkSync(filePath); // Hapus file setelah diunduh
            });
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengekspor PDF!', error: error.message });
    }
};

// Delete pengeluaran
// exports.deleteTapeng = async(req, res) => {
//     const { id } = req.params;
//     try {
//         const TapengData = await tambahPengeluaran.findOne({ where: { id }, attributes: ['id', 'id_user', 'tanggal', 'id_kategori', 'id_stock', 'jumlah', 'totalHarga', 'createdAt', 'updatedAt'] });

//         if (!TapengData) {
//             return res.status(404).json({
//                 success: false,
//                 message: `Data dengan ID ${id} tidak ditemukan!`
//             });
//         }
//         await tambahPengeluaran.destroy({ where: { id }, attributes: ['id', 'id_user', 'tanggal', 'id_kategori', 'id_stock', 'jumlah', 'totalHarga', 'createdAt', 'updatedAt'] });
//         return res.status(200).json({
//             success: true,
//             message: 'Data berhasil dihapus!',
//             deletedData: TapengData
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'Gagal menghapus data!',
//             error: error.message
//         });
//     }
// };