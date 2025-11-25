const RescueModel = require('../models/RescueModel');
const GambarModel = require("../models/GambarModel");

// Fungsi untuk ambil .value jika body berbentuk object
const fs = require('fs').promises;

function extract(val) {
  return typeof val === "object" && val !== null ? val.value : val;
}

class RescueController {
  constructor(db) {
    this.rescueModel = new RescueModel(db);
    this.gambarModel = new GambarModel(db);

  }
  
  

  // ✅ FUNGSI BARU: searchRescue (Pengganti getAll & fetchUserReports)
async searchRescue(request, reply) {
    try {
        const { ids, status } = request.query; 

        let idsArray = [];
        if (ids) {
            // Ubah string "1,2,3" menjadi array angka [1, 2, 3]
            idsArray = ids.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
        }
        
        const laporan = await this.rescueModel.searchRescue({ 
            status: status,
            ids: idsArray // Mengirim array ID ke Model
        });
        
        return reply.send({
            success: true,
            message: 'Berhasil mencari laporan rescue',
            data: laporan
        });
    } catch (error) {
        return reply.status(500).send({
            success: false,
            error: 'Gagal mencari laporan rescue: ' + error.message
        });
    }
}

  async getRescueById(request, reply) {
    try {
      const { id } = request.params;
      const data = await this.rescueModel.getById(id);

      if (!data) {
        return reply.status(404).send({
          success: false,
          message: 'Data rescue tidak ditemukan'
        });
      }
      // src/controllers/RescueController.js (Baris sekitar 60)
// ...
        console.log("✅ FASTIFY LOG: Jumlah Data Dikirim:", laporan.length); // <--- TAMBAH INI

      return reply.send({
        success: true,
        message: 'Berhasil mendapatkan detail rescue',
        data
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Gagal mendapatkan detail rescue'
      });
    }
  }
  
async createRescue(request, reply) {
  try {
    console.log("REQUEST BODY:", request.body);

    const nama_pelapor    = extract(request.body.nama_pelapor);
    const telepon         = extract(request.body.telepon);
    const lokasi_penemuan = extract(request.body.lokasi_penemuan);
    const deskripsi       = extract(request.body.deskripsi);

    // Logika Pengguna ID (sudah benar)
    const pengguna_id_raw = extract(request.body.pengguna_id);
    let pengguna_id = null;
    if (pengguna_id_raw) {
      const parsedId = parseInt(pengguna_id_raw);
      if (!isNaN(parsedId) && parsedId > 0) {
        pengguna_id = parsedId;
      }
    }

    const waktu_penemuan  = extract(request.body.waktu_penemuan);
    const tag_id_raw = extract(request.body.tag_id);
    const tag_id = tag_id_raw ? parseInt(tag_id_raw) : null;

    // 1️⃣ Insert kucing dulu
    const kucingData = {
      nama_kucing: null,
      jenis_kucing_id: null,
      jenis_kelamin: null,
      tanggal_lahir: null,
      warna_bulu: null,
      deskripsi: deskripsi || null,
      sudah_steril: null,
      status: null,
      dibuat_oleh: pengguna_id,
      created_at: new Date(),
      updated_at: new Date()
    };
    const kucingId = await this.rescueModel.createKucing(kucingData);

    // 2️⃣ Insert laporan rescue
    const laporanId = await this.rescueModel.create({
      nama_pelapor,
      telepon,
      lokasi_penemuan,
      deskripsi,
      pengguna_id,
      kucing_id: kucingId,
      waktu_penemuan,
      tag_id,
    });

    // 3️⃣ Insert tag kucing (jika ada)
    if (tag_id) {
      await this.rescueModel.addTagKucing({
        kucing_id: kucingId,
        tag_id,
        created_at: new Date()
      });
    }

    if (request.isMultipart()) {
  try {
    const file = request.body.gambar;

    if (file && file.filename) {
      const buffer = await file.toBuffer();
      const filename = Date.now() + "_" + file.filename;
      const filepath = `uploads/${filename}`;

      const fs = require("fs");
      await fs.promises.writeFile(filepath, buffer);

      // Simpan ke DB dengan jenis_entitas = 'laporan_rescue'
      await this.gambarModel.addGambar({
        jenis_entitas: "laporan_rescue",
        entitas_id: laporanId,
        url_gambar: `/uploads/${filename}`,
        nama_file: filename,
        urutan_tampil: 1
      });

      console.log("📌 GAMBAR BERHASIL DIMASUKKAN KE DB");
    } else {
      console.log("⚠ TIDAK ADA FILE DENGAN FIELDNAME 'gambar'");
    }
  } catch (err) {
    console.error("ERROR SAAT MEMPROSES GAMBAR:", err);
  }
}


    return reply.send({
      success: true,
      message: "Laporan rescue berhasil dibuat",
      id: laporanId
    });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      success: false,
      message: "Terjadi kesalahan saat membuat laporan rescue"
    });
  }
}



  async updateStatus(request, reply) {
    try {
      const { id } = request.params;
      const { status } = request.body;

      await this.rescueModel.updateStatus(id, status);

      return reply.send({
        success: true,
        message: 'Status laporan rescue berhasil diupdate'
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Gagal update status laporan rescue'
      });
    }
  }

  async deleteRescue(request, reply) {
    try {
      const { id } = request.params;

      await this.rescueModel.delete(id);

      return reply.send({
        success: true,
        message: 'Laporan rescue berhasil dihapus'
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Gagal menghapus laporan rescue'
      });
    }
  }



  
}




module.exports = RescueController;
