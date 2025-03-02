const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { user } = require('../models');

dotenv.config();


// Create user
exports.createUser = async(req, res) => {
    const { namaPengguna, username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'username dan password harus diisi'
        });
    }

    try {
        const existingUser = await user.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'username sudah digunakan'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            namaPengguna,
            username,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: 'User berhasil dibuat!',
            data: newUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal membuat user!',
            error: error.message
        });
    }
};

// Update user
exports.updateUser = async(req, res) => {
    const { id } = req.params;
    const { namaLengkap, username, password } = req.body;
    try {
        // Cek apakah user dengan ID tersebut ada
        const existingUser = await user.findByPk(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: `User dengan ID ${id} tidak ditemukan!`
            });
        }

        // Cek apakah username baru sudah digunakan oleh user lain
        if (username && username !== existingUser.username) {
            const usernameExists = await user.findOne({ where: { username } });
            if (usernameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Username sudah digunakan oleh user lain!'
                });
            }
        }

        // Jika password diisi, hash password baru
        let hashedPassword = existingUser.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update data user
        await user.update({
            namaLengkap: namaLengkap || existingUser.namaLengkap,
            username: username || existingUser.username,
            password: hashedPassword
        }, { where: { id } });

        // Ambil data user yang telah diperbarui
        const updatedUser = await user.findByPk(id);

        return res.status(200).json({
            success: true,
            message: 'User berhasil diperbarui!',
            data: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui user!',
            error: error.message
        });
    }
};

// User login
exports.loginUser = async(req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'username dan password harus diisi'
        });
    }

    try {
        const User = await user.findOne({ where: { username } });
        if (!User) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password salah'
            });
        }

        const token = jwt.sign({ id: User.id, username: User.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            success: true,
            message: 'Login berhasil!',
            data: { username: User.username, id_user: User.id, token }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal login!',
            error: error.message
        });
    }
};

// Delete user
exports.deleteUser = async(req, res) => {
    const { id } = req.params;

    try {
        const user = await user.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        await User.destroy({ where: { id } });
        return res.status(200).json({
            success: true,
            message: 'User berhasil dihapus!',
            deletedData: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus user!',
            error: error.message
        });
    }
};