const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { user } = require('../models');

dotenv.config();
// Create user
exports.createUser = async(req, res) => {
    const { username, password } = req.body;

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
        const user = await user.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password salah'
            });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            success: true,
            message: 'Login berhasil!',
            data: { username: user.username, id_user: user.id, token }
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