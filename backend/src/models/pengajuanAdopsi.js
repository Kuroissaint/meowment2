// backend/src/models/pengajuanAdopsi.js
const db = require('../config/db');

// Mengubah dari Object callback ke Class/Object Promise/Async
const PengajuanAdopsi = {


  // FUNGSI BARU UNTUK MENGAMBIL DATA BIAYA ADOPSI
  async getPengajuanByKucingId(kucingId, connection) { 

    
    // Menggunakan connection.query karena ini adalah bagian dari transaksi
    // Mengambil ID pengajuan dan Biaya Adopsi yang dibutuhkan Controller (biaya_adopsi ada di tabel)
    const query = `
        SELECT id, biaya_adopsi 
        FROM pengajuan_adopsi 
        WHERE kucing_id = ? 
        LIMIT 1
    `;
    const [rows] = await connection.query(query, [kucingId]);
    
    // Mengembalikan baris pertama atau null jika tidak ditemukan
    return rows[0] || null;
  },

  
  
  // 1. FUNGSI CREATE (Wajib diubah ke async/await dan menerima 'connection')
  async create(data, connection) { 
    // TAMBAH KOLOM status_pengajuan (yang wajib diisi)
    const query = `
      INSERT INTO pengajuan_adopsi
      (pengguna_id, kucing_id, nama_lengkap, telepon, provinsi_id, kabupaten_kota_id, kecamatan_id, alamat_lengkap, biaya_adopsi) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `; 
    // PENTING: Gunakan connection.query agar query ini menjadi bagian dari transaction
    const [result] = await connection.query( 
      query,
      [
        data.pengguna_id,
        data.kucing_id,
        data.nama_lengkap,
        data.telepon,
        data.provinsi_id,
        data.kabupaten_kota_id,
        data.kecamatan_id,
        data.alamat_lengkap,
        data.biaya_adopsi

      ]
    );
    return result;
  },




  // 2. FUNGSI getByUserId (Diubah ke async/await agar konsisten)
  async getByUserId(pengguna_id) { 
    // Menggunakan db.query karena ini bukan bagian dari transaksi POST
    const [rows] = await db.query( 
      "SELECT * FROM pengajuan_adopsi WHERE pengguna_id = ?",
      [pengguna_id]
    );
    return rows;
  }
};

module.exports = PengajuanAdopsi;