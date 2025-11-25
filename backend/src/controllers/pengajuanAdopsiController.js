// backend/src/controllers/adopsiController.js
const db = require('../config/db');
const PengajuanAdopsiModel = require('../models/pengajuanAdopsi');
const PenggunaModel = require('../models/penggunaModel');

const fs = require('fs');
exports.buatPengajuan = (req, res) => {
  const data = {
    pengguna_id: req.body.pengguna_id,
    kucing_id: req.body.kucing_id,
    nama_lengkap: req.body.nama_lengkap,
    telepon: req.body.telepon,
    provinsi_id: req.body.provinsi_id,
    kabupaten_kota_id: req.body.kabupaten_kota_id,
    kecamatan_id: req.body.kecamatan_id,
    alamat_lengkap: req.body.alamat_lengkap
  };

  PengajuanAdopsi.create(data, (err, result) => {
    if (err) {
      console.error("Gagal insert pengajuan:", err);
      return res.status(500).json({ message: "Gagal membuat pengajuan" });
    }
    res.status(201).json({ message: "Pengajuan berhasil dibuat", id: result.insertId });
  });
};

exports.getPengajuanUser = (req, res) => {
  const userId = req.params.pengguna_id;

  PengajuanAdopsi.getByUserId(userId, (err, rows) => {
    if (err) {
      console.error("Error fetch pengajuan:", err);
      return res.status(500).json({ message: "Gagal mengambil data" });
    }
    res.json(rows);
  });
};