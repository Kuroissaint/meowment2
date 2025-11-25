// backend/src/models/kucingModel.js
const db = require('../config/db');


class KucingModel {
    // 1. Fungsi untuk INSERT data kucing baru
    static async create(data) {
        // Query INSERT yang dipindahkan dari Controller
        const [result] = await db.query(
            `INSERT INTO kucing (
                nama_kucing, jenis_kelamin, umur, warna_bulu, deskripsi,
                sudah_steril
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.namaKucing,
                data.jenisKelamin,
                data.usia,
                data.warnaBulu,
                data.deskripsi,
                data.sudahSteril
              
            ]
        );
        return result;
    }


    static async addKucingImage(kucingId, url, filename, connection) {
    const [result] = await connection.query(
        `INSERT INTO gambar (entitas_id, jenis_entitas, url_gambar, nama_file)
         VALUES (?, 'kucing', ?, ?)`,
        [kucingId, url, filename]
    );
    return result;
}


   // 2. Fungsi untuk SELECT semua daftar kucing, list semua kucing,find byid buat adopt detail
static async findAll() {
    const [rows] = await db.query(
        `SELECT 
            k.id,
            k.nama_kucing,
            k.jenis_kelamin,
            k.umur,
            k.warna_bulu,
            k.deskripsi,
            k.sudah_steril,

            pa.biaya_adopsi,
            pa.alamat_lengkap,
            
            p.nama_provinsi,
            kk.nama_kabupaten_kota,
            kc.nama_kecamatan,


         

            g.url_gambar
         FROM kucing k

         LEFT JOIN pengajuan_adopsi pa on pa.kucing_id = k.id
         LEFT JOIN provinsi p ON pa.provinsi_id = p.id
          LEFT JOIN kabupaten_kota kk ON pa.kabupaten_kota_id = kk.id
        LEFT JOIN kecamatan kc ON pa.kecamatan_id = kc.id
         LEFT JOIN gambar g 
            ON k.id = g.entitas_id 
            AND g.jenis_entitas = 'kucing'
         ORDER BY k.created_at DESC`
    );
    return rows;
}

static async findById(id) {
    const [rows] = await db.query(
        `SELECT 
            k.id,
            k.nama_kucing,
            k.umur,              /* DITAMBAHKAN */
            k.jenis_kelamin,     /* DITAMBAHKAN */
            k.warna_bulu,
            k.deskripsi,
            k.sudah_steril,
            
            pa.alamat_lengkap,   /* DITAMBAHKAN */
            pa.biaya_adopsi,     /* DITAMBAHKAN */
            pa.telepon as no_telepon_pemilik, /* Contoh: ambil data pemilik untuk detail */
            pa.nama_lengkap as nama_pemilik,
            
            p.nama_provinsi,
            kk.nama_kabupaten_kota,
            kc.nama_kecamatan,
         

            g.url_gambar
         FROM kucing k

         LEFT JOIN pengajuan_adopsi pa on pa.kucing_id = k.id
         LEFT JOIN provinsi p ON pa.provinsi_id = p.id
         LEFT JOIN kabupaten_kota kk ON pa.kabupaten_kota_id = kk.id
         LEFT JOIN kecamatan kc ON pa.kecamatan_id = kc.id
         LEFT JOIN gambar g 
            ON k.id = g.entitas_id 
            AND g.jenis_entitas = 'kucing'
         WHERE k.id = ?
         LIMIT 1`, // Ambil hanya satu hasil
        [id] // Parameter ID dimasukkan ke query
    );
    return rows[0] || null; // Kembalikan objek tunggal atau null jika tidak ditemukan
}

// 3. FUNGSI getPengajuanByKucingId (FUNGSI BARU DITAMBAHKAN DI SINI)
        async getPengajuanByKucingId(kucing_id, connection) {
        const query = `
        SELECT id, biaya_adopsi 
        FROM pengajuan_adopsi 
        WHERE kucing_id = ? 
        LIMIT 1
        `;
        // Gunakan connection yang sudah ada karena ini dipanggil di dalam controller transaksi
        const runner = connection || db;
        const [rows] = await runner.query(query, [kucing_id]);

        return rows[0] || null;
        }
    };



module.exports = KucingModel;