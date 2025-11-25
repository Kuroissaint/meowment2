const pool = require('../config/db');

class RescueModel {
  constructor(db) {
    this.db = db;
  }

  // ============================================
  // SEARCH RESCUE (SUDAH FIX TANPA UBAH STRUKTUR)
  // ============================================
  async searchRescue(filters = {}) {
    const { ids, status } = filters;

    let query = `
    SELECT 
        lr.id,
        lr.nama_pelapor,
        lr.telepon,
        lr.waktu_penemuan,
        lr.lokasi_penemuan,
        lr.deskripsi,
        lr.status,
        lr.created_at,

        COALESCE(k.status, 'Sedang Diproses') AS status_display,
        COALESCE(jk.nama_jenis, 'Tidak diketahui') AS ras_kucing,

        (SELECT url_gambar FROM gambar
         WHERE entitas_id = lr.id AND jenis_entitas = 'laporan_rescue'
         LIMIT 1) AS url_gambar_utama,

        (SELECT t.nama_tag 
         FROM tag t 
         JOIN tag_kucing tk ON tk.tag_id = t.id 
         WHERE tk.kucing_id = lr.kucing_id 
         LIMIT 1) AS tags
    FROM laporan_rescue lr
    LEFT JOIN kucing k ON lr.kucing_id = k.id
    LEFT JOIN jenis_kucing jk ON k.jenis_kucing_id = jk.id
    WHERE 1=1
    `;

    const params = [];

    if (ids && Array.isArray(ids) && ids.length > 0) {
      const placeholders = ids.map(() => '?').join(',');
      query += ` AND lr.id IN (${placeholders})`;
      params.push(...ids);
    }

    query += ' GROUP BY lr.id ORDER BY lr.created_at DESC';

    console.log("==========================================");
    console.log("🚨 DEBUG QUERY RESCUE PAGE (FIXED SCHEMA):");
    console.log("Query SQL:", query);
    console.log("Parameters:", params);
    console.log("==========================================");

    try {
      const [rows] = await this.db.execute(query, params);

   rows.forEach(r => {
  r.gambar = r.url_gambar_utama
    ? `${process.env.BASE_URL}${r.url_gambar_utama}`
    : null;

  r.status_display = r.status || "Sedang Diproses";
  r.status = r.status_display;
  r.tags = r.tags || "-";
});


    // ===============================================

    console.log("✅ DEBUG RESULT COUNT:", rows.length);
    return rows;

    } catch (error) {
      console.error("❌ SQL Error di searchRescue:", error);
      throw error;
    }
  }

  // ============================================
  // CREATE KUCING (TIDAK DIUBAH)
  // ============================================
  async createKucing(data) {
    const sql = `
      INSERT INTO kucing
        (nama_kucing, jenis_kucing_id, jenis_kelamin, tanggal_lahir, warna_bulu, deskripsi, sudah_steril, status, dibuat_oleh, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.nama_kucing,
      data.jenis_kucing_id,
      data.jenis_kelamin,
      data.tanggal_lahir,
      data.warna_bulu,
      data.deskripsi,
      data.sudah_steril,
      data.status,
      data.dibuat_oleh,
      data.created_at,
      data.updated_at
    ];
    const [result] = await this.db.execute(sql, params);
    return result.insertId;
  }

  // ============================================
  // CREATE RESCUE (SUDAH DIBENERIN PARAMETER)
  // ============================================
  async create(data) {
    const sql = `
      INSERT INTO laporan_rescue
      (nama_pelapor, telepon, lokasi_penemuan, deskripsi, pengguna_id, kucing_id, waktu_penemuan, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await this.db.execute(sql, [
      data.nama_pelapor,
      data.telepon,
      data.lokasi_penemuan,
      data.deskripsi || null,
      data.pengguna_id || null,
      data.kucing_id,
      data.waktu_penemuan,
      data.status || 'dilaporkan'   // <== fix: parameter ke-8 HARUS ada
    ]);
    return result.insertId;
  }

  // ============================================
  // UPDATE STATUS (TIDAK DIUBAH)
  // ============================================
  async updateStatus(id, status) {
    await this.db.execute(
      'UPDATE laporan_rescue SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  // ============================================
  // DELETE RESCUE (TIDAK DIUBAH)
  // ============================================
  async delete(id) {
    await this.db.execute(
      'DELETE FROM laporan_rescue WHERE id = ?',
      [id]
    );
  }

  // ============================================
  // ADD TAG KUCING (TIDAK DIUBAH)
  // ============================================
  async addTagKucing(data) {
    const sql = `INSERT INTO tag_kucing (kucing_id, tag_id, created_at)
                 VALUES (?, ?, ?)`;
    const [result] = await this.db.execute(sql, [
      data.kucing_id,
      data.tag_id,
      data.created_at
    ]);
    return result.insertId;
  }

}

module.exports = RescueModel;
