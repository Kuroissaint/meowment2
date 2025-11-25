// backend/src/models/gambarModel.js
const db = require('../config/db');


class GambarModel {
    /**
     * Menyimpan data gambar ke tabel 'gambar'.
     * @param {number} entitasId - ID entitas yang terkait (kucingId).
     * @param {string} url - Path URL gambar (misal: /uploads/foto-123.jpg).
     * @param {string} filename - Nama file yang disimpan di server.
     * @param {string} jenisEntitas - Tipe entitas (default: 'kucing').
     * @returns {Object} Hasil dari query INSERT.
     */
    static async create(entitasId, url, filename, jenisEntitas = 'kucing') {
        const [result] = await db.query(
            `INSERT INTO gambar (
                entitas_id, jenis_entitas, url_gambar, nama_file
            ) VALUES (?, ?, ?, ?)`,
            [
                entitasId, 
                jenisEntitas, 
                url, 
                filename
            ]
        );
        return result;
    }
}

module.exports = GambarModel;