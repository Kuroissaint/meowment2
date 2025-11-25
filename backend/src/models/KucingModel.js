class KucingModel {
  constructor(db) {
    this.db = db;
  }

  // ✅ 1. METHOD SEARCH (FINAL & LENGKAP)
  // Query ini mengambil semua data yang dibutuhkan kartu "Laporan Anda"
  async searchKucing(filters = {}) {
    const { keyword, lokasi, status, ids } = filters;
    
    let query = `
      SELECT 
        k.id,
        k.nama_kucing,
        k.status,
        k.deskripsi,
        k.created_at,
        
        jk.nama_jenis as jenis_kucing,
        GROUP_CONCAT(DISTINCT t.nama_tag) as tags,
        
        -- ✅ 1. FOTO TUNGGAL (Untuk SearchPage biar gak error)
        (SELECT url_gambar FROM gambar WHERE entitas_id = k.id AND jenis_entitas = 'kucing' LIMIT 1) as foto,
        
        -- ✅ 2. LIST SEMUA FOTO (Untuk MySearchPage biar bisa digeser)
        (SELECT GROUP_CONCAT(url_gambar) FROM gambar WHERE entitas_id = k.id AND jenis_entitas = 'kucing') as list_foto,
        
        -- Lokasi & Lainnya (Tetap Sama)
        CONCAT(
          COALESCE(kec.nama_kecamatan, ''), ', ', 
          COALESCE(kab.nama_kabupaten_kota, ''), ', ', 
          COALESCE(p.nama_provinsi, ''), ' - ',
          COALESCE(lh.lokasi_terakhir, '')
        ) as lokasi_display,

        lh.nama_pelapor,
        lh.telepon as kontak_pelapor,
        lh.waktu_hilang,
        
        p.nama_provinsi,
        kab.nama_kabupaten_kota

      FROM kucing k
      LEFT JOIN laporan_hilang lh ON k.id = lh.kucing_id
      LEFT JOIN provinsi p ON lh.provinsi_id = p.id
      LEFT JOIN kabupaten_kota kab ON lh.kabupaten_kota_id = kab.id
      LEFT JOIN kecamatan kec ON lh.kecamatan_id = kec.id
      LEFT JOIN jenis_kucing jk ON k.jenis_kucing_id = jk.id
      LEFT JOIN tag_kucing tk ON k.id = tk.kucing_id  
      LEFT JOIN tag t ON tk.tag_id = t.id
      
      WHERE 1=1
    `;
    
    const params = [];

    // --- Filter IDs (Khusus Laporan Anda) ---
    if (ids && Array.isArray(ids) && ids.length > 0) {
      const placeholders = ids.map(() => '?').join(',');
      query += ` AND k.id IN (${placeholders})`;
      params.push(...ids);
    } else {
      // Default Search: Hanya cari yang hilang
      // (Kecuali kalau lagi buka Laporan Anda, semua status muncul)
      if (!ids) {
         query += " AND k.status = 'hilang'";
      }
    }

    // --- Filter Keyword ---
    if (keyword) {
      query += ' AND (k.nama_kucing LIKE ? OR k.deskripsi LIKE ? OR t.nama_tag LIKE ? OR lh.lokasi_terakhir LIKE ?)';
      const searchTerm = `%${keyword}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // --- Filter Lokasi (Kota/Provinsi) ---
    if (lokasi) {
      query += ' AND (p.nama_provinsi LIKE ? OR kab.nama_kabupaten_kota LIKE ?)';
      const locTerm = `%${lokasi}%`;
      params.push(locTerm, locTerm);
    }

    query += ' GROUP BY k.id ORDER BY k.created_at DESC';

    try {
      const [rows] = await this.db.execute(query, params);
      return rows;
    } catch (error) {
      console.error("SQL Error di searchKucing:", error);
      throw error;
    }
  }
  
  // Method Standar Lainnya (Biarkan Saja)
  async getAll() {
    const [rows] = await this.db.execute(`SELECT * FROM kucing`); // Disederhanakan contohnya
    return rows;
  }
  async getById(id) {
    // Query getById yang lengkap (sama seperti sebelumnya)
    const [rows] = await this.db.execute(`
        SELECT 
          k.*, jk.nama_jenis as jenis_kucing, GROUP_CONCAT(DISTINCT t.nama_tag) as tags,
          GROUP_CONCAT(DISTINCT g.url_gambar) as list_foto_url,
          lh.nama_pelapor, lh.telepon as kontak_pelapor, lh.waktu_hilang, lh.lokasi_terakhir,
          CONCAT(COALESCE(kec.nama_kecamatan, ''), ', ', COALESCE(kab.nama_kabupaten_kota, ''), ', ', COALESCE(p.nama_provinsi, ''), ' - ', COALESCE(lh.lokasi_terakhir, '')) as lokasi_display
        FROM kucing k
        LEFT JOIN laporan_hilang lh ON k.id = lh.kucing_id
        LEFT JOIN provinsi p ON lh.provinsi_id = p.id
        LEFT JOIN kabupaten_kota kab ON lh.kabupaten_kota_id = kab.id
        LEFT JOIN kecamatan kec ON lh.kecamatan_id = kec.id
        LEFT JOIN jenis_kucing jk ON k.jenis_kucing_id = jk.id
        LEFT JOIN tag_kucing tk ON k.id = tk.kucing_id  
        LEFT JOIN tag t ON tk.tag_id = t.id
        LEFT JOIN gambar g ON k.id = g.entitas_id AND g.jenis_entitas = 'kucing'
        WHERE k.id = ? GROUP BY k.id
      `, [id]);
      return rows[0];
  }
  async getAllTags() { 
      const [rows] = await this.db.execute('SELECT * FROM tag ORDER BY kategori DESC, nama_tag ASC');
      return rows;
  }

  // ✅ 2. METHOD CREATE LAPORAN (FINAL & LENGKAP)
  async createLaporan(data) {
    let connection; 
    
    try {
      connection = await this.db.getConnection();
      await connection.beginTransaction();

      // A. Cari ID Ras (Agar Jenis tidak strip -)
      let jenisKucingId = null;
      if (data.ras) {
        const [jenisRows] = await connection.execute(
          'SELECT id FROM jenis_kucing WHERE nama_jenis = ?', [data.ras]
        );
        if (jenisRows.length > 0) jenisKucingId = jenisRows[0].id;
      }

      // B. Insert Kucing
      const [kucingResult] = await connection.execute(
        `INSERT INTO kucing (nama_kucing, jenis_kucing_id, deskripsi, status, created_at) 
         VALUES (?, ?, ?, 'hilang', NOW())`,
        [data.nama_kucing, jenisKucingId, data.deskripsi]
      );
      const newKucingId = kucingResult.insertId;

      // C. Insert Laporan Hilang (Lengkap dengan ID Wilayah)
      await connection.execute(
        `INSERT INTO laporan_hilang (
           kucing_id, nama_pelapor, telepon, waktu_hilang, 
           lokasi_terakhir, provinsi_id, kabupaten_kota_id, kecamatan_id, 
           deskripsi, status, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'hilang', NOW())`,
        [
          newKucingId, data.nama_pelapor, data.telepon, data.waktu_hilang,
          data.lokasi, data.provinsi_id, data.kabupaten_kota_id, data.kecamatan_id,
          data.deskripsi
        ]
      );

      // D. Insert Tags (Looping)
      if (data.tags && data.tags.length > 0) {
        for (const tagName of data.tags) {
           const [tagRows] = await connection.execute('SELECT id FROM tag WHERE nama_tag = ?', [tagName]);
           if (tagRows.length > 0) {
             await connection.execute(
               'INSERT INTO tag_kucing (kucing_id, tag_id, created_at) VALUES (?, ?, NOW())',
               [newKucingId, tagRows[0].id]
             );
           }
        }
      }

      // E. Insert Banyak Gambar (Looping)
      if (data.fotos && data.fotos.length > 0) {
         for (const filename of data.fotos) {
             const urlGambar = `http://localhost:3000/uploads/${filename}`;
             await connection.execute(
               `INSERT INTO gambar (jenis_entitas, entitas_id, url_gambar, nama_file, created_at) 
                VALUES ('kucing', ?, ?, ?, NOW())`,
               [newKucingId, urlGambar, filename]
             );
         }
      }

      await connection.commit();
      return newKucingId;

    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = KucingModel;