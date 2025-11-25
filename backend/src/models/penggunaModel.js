// models/PenggunaModel.js
const db = require('../config/db');

class PenggunaModel {
    static async getById(id) {
        const [rows] = await db.query(
            `SELECT id, username, email, provinsi_id, foto_profil 
             FROM pengguna WHERE id = ?`,
            [id]
        );
        return rows[0];
    }
}

module.exports = PenggunaModel;
