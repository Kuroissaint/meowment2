// backend/src/models/AplikasiAdopsiModel.js
const db = require('../config/db');

class aplikasiAdopsiModel {

  // ambil emamil pengguna

    // Ambil email pengguna berdasarkan id
  static async getEmailPengguna(pengguna_id) {

    const query = `SELECT email FROM pengguna WHERE id = ?`;
    const [rows] = await db.query(query, [pengguna_id]);

    // Cek 1: Apakah query menemukan baris?
    if (rows.length === 0) {
        console.log(`Peringatan: Pengguna ID ${pengguna_id} tidak ditemukan.`);
        return null; // Mengembalikan null jika pengguna tidak ada
    }

    // Cek 2: Apakah kolom 'email' di baris tersebut NULL/kosong?
    if (!rows[0].email) {
         console.log(`Peringatan: Email untuk Pengguna ID ${pengguna_id} kosong di DB.`);
    }

    return rows[0].email || null;
}

  

  static async create(data, connection) {
    const query = `
      INSERT INTO aplikasi_adopsi (
          pengguna_id, kucing_id, nama_lengkap, telepon, umur, kabupaten_kota_id, kecamatan_id, alamat_lengkap,
          pekerjaan, pernah_pelihara_kucing, alasan_adopsi
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Catatan: Model ini tidak perlu transaksi karena tidak melibatkan operasi INSERT ke tabel kucing
    const [result] = await connection.query(
      query,
      [
        data.pengguna_id,
        data.kucing_id,
        data.nama_lengkap,
        data.telepon,
        data.umur,
        data.kabupaten_kota_id,
        data.kecamatan_id,
        data.alamat_lengkap,
        data.pekerjaan,
        data.pernah_pelihara_kucing,
        data.alasan_adopsi
     
      
      ]
    );
    return result;
  }
}

module.exports = aplikasiAdopsiModel;