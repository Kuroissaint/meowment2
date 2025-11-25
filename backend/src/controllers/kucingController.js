// backend/src/controllers/kucingController.js (Final Revision for AjukanKucing)
const KucingModel = require('../models/kucingModel'); 
const PenggunaModel = require('../models/penggunaModel'); 
const PengajuanAdopsiModel = require('../models/pengajuanAdopsi');
const GambarModel = require('../models/gambarModel'); // <--- BARU
const db = require('../config/db');
const fs = require('fs');

exports.ajukanKucing = async (req, res) => {
    let connection;
    let foto_url = null;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Foto kucing wajib diupload' });
        }

        foto_url = `/uploads/${req.file.filename}`;

        connection = await db.getConnection();
        await connection.beginTransaction();

        const penggunaId = req.body.pengguna_id;
        if (!penggunaId) {
            throw new Error("pengguna_id wajib dikirim dari frontend");
        }

        // 1. Simpan data kucing
       const createResult = await KucingModel.create(req.body);
      const kucingId = createResult.insertId;


        // 2. Simpan data pengajuan
        await PengajuanAdopsiModel.create({
            pengguna_id: penggunaId,
            kucing_id: kucingId,
            nama_lengkap: req.body.namaPemilik,
            telepon: req.body.nohp,
            provinsi_id: req.body.provinsiId,
            kabupaten_kota_id: req.body.kabupatenKotaId,
            kecamatan_id: req.body.kecamatanId,
            alamat_lengkap: req.body.alamat,
            biaya_adopsi: req.body.biayaAdopsi
        }, connection);

        // 3. Simpan gambar
        await KucingModel.addKucingImage(kucingId, foto_url, req.file.filename, connection);

        await connection.commit();

        res.status(201).json({ 
            message: "Pengajuan kucing berhasil disimpan!",
            kucing_id: kucingId
        });

    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: `Gagal memproses pengajuan: ${error.message}` });
    } finally {
        if (connection) connection.release();
    }
};



exports.getKucingDetail = async (req, res) => {
    try {
        const kucingId = req.params.id; // Asumsi ID diambil dari URL parameter (misalnya /api/kucing/12)
        
        // Memanggil fungsi findById yang baru
        const kucingDetail = await KucingModel.findById(kucingId); 

        if (!kucingDetail) {
            return res.status(404).json({ message: "Kucing tidak ditemukan." });
        }

        res.status(200).json(kucingDetail);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil detail kucing: " + error.message });
    }
};


exports.getDaftarKucing = async (req, res) => {
    try {
        const kucingList = await KucingModel.findAll();
        res.status(200).json(kucingList);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil daftar kucing: " + error.message });
    }
};
