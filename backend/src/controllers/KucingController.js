const KucingModel = require('../models/KucingModel');
const fs = require('fs'); // Import fs
const path = require('path'); // Import path

class KucingController {
  constructor(db) {
    this.kucingModel = new KucingModel(db);
  }

  async getAllKucing(request, reply) {
    try {
      const kucing = await this.kucingModel.getAll();
      return reply.send({
        success: true,
        message: 'Berhasil mendapatkan data kucing',
        data: kucing
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Gagal mendapatkan data kucing'
      });
    }
  }

  async getKucingById(request, reply) {
    try {
      const { id } = request.params;
      const kucing = await this.kucingModel.getById(id);
      
      if (!kucing) {
        return reply.status(404).send({
          success: false,
          error: 'Kucing tidak ditemukan'
        });
      }
      
      return reply.send({
        success: true,
        message: 'Berhasil mendapatkan detail kucing',
        data: kucing
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Gagal mendapatkan detail kucing: ' + error.message
      });
    }
  }

  async searchKucing(request, reply) {
    try {
      const { q, jenis, lokasi, status } = request.query;
      
      const kucing = await this.kucingModel.searchKucing({ 
        keyword: q, 
        jenis, 
        lokasi,
        status 
      });
      
      return reply.send({
        success: true,
        message: 'Berhasil mencari kucing',
        data: kucing
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Gagal mencari kucing: ' + error.message
      });
    }
  }

  async getTags(request, reply) {
    try {
      const tags = await this.kucingModel.getAllTags();
      return reply.send({ success: true, data: tags });
    } catch (error) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  }

  // ✅ METHOD CREATE KUCING (HANYA SATU DAN SUDAH DIPERBAIKI)
  async createKucing(request, reply) {
    console.log("1️⃣ [Controller] Request masuk!"); 

    try {
      const parts = request.body;
      console.log("2️⃣ [Controller] Raw Body:", parts);
      
      // --- 1. HANDLING FOTO (SIMPAN KE DISK) ---
      let uploadedFilenames = [];

      if (parts.foto) {
        const files = Array.isArray(parts.foto) ? parts.foto : [parts.foto];
        // Buat nama file unik (Timestamp + Nama Asli)
        for (const file of files) {
          const filename = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.filename}`;
          const savePath = path.join(__dirname, '../../uploads', filename);
          
          // Buat folder jika belum ada
          if (!fs.existsSync(path.dirname(savePath))){
              fs.mkdirSync(path.dirname(savePath), { recursive: true });
            }

            // Simpan file
            fs.writeFileSync(savePath, file._buf);
            
            // Masukkan nama file ke list
            uploadedFilenames.push(filename);
        }
      }

      // --- 2. HANDLING TAGS ---
      let tagsData = [];
      if (parts.tags) {
        const rawTags = Array.isArray(parts.tags) ? parts.tags : [parts.tags];
        tagsData = rawTags.map(t => t.value);
      }

      const cleanData = {
        nama_pelapor: parts.nama_pelapor?.value || null,
        telepon: parts.telepon?.value || null,
        waktu_hilang: parts.waktu_hilang?.value || null,

        // Lokasi terakhir
        lokasi: parts.lokasi?.value || null,
        provinsi_id: parts.provinsi_id?.value || null,
        kabupaten_kota_id: parts.kabupaten_kota_id?.value || null,
        kecamatan_id: parts.kecamatan_id?.value || null,

        //Data Kucing
        nama_kucing: parts.nama_kucing?.value || 'Kucing Hilang',
        deskripsi: parts.deskripsi?.value || null,
        ras: parts.ras?.value || null,
        jenis_kucing_id: null, 
        
        // ✅ Kirim nama file yang sudah disimpan di disk
        fotos: uploadedFilenames, 
        tags: tagsData 
      };

      console.log("3️⃣ [Controller] Data Bersih:", cleanData);

      const newId = await this.kucingModel.createLaporan(cleanData);
      
      console.log("4️⃣ [Controller] Sukses! ID:", newId);

      return reply.send({
        success: true,
        message: 'Laporan berhasil dibuat!',
        data: { id: newId }
      });
  
    } catch (error) {
      console.error("❌ [Controller] Error:", error);
      return reply.status(500).send({
        success: false,
        error: 'Gagal membuat laporan: ' + error.message
      });
    }
  }
}

module.exports = KucingController;