const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Koneksi database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "meowment",
});

// 🔹 GET semua provinsi
router.get("/provinsi", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM provinsi ORDER BY nama_provinsi ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil provinsi" });
  }
});

// 🔹 GET kabupaten berdasarkan provinsi
router.get("/kabupaten/:provinsiId", async (req, res) => {
  try {
    const provinsiId = req.params.provinsiId;
    const [rows] = await pool.query(
      "SELECT * FROM kabupaten_kota WHERE provinsi_id = ? ORDER BY nama_kabupaten_kota ASC",
      [provinsiId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil kabupaten" });
  }
});

// 🔹 GET kecamatan berdasarkan kabupaten
router.get("/kecamatan/:kabupatenId", async (req, res) => {
  try {
    const kabupatenId = req.params.kabupatenId;
    const [rows] = await pool.query(
      "SELECT * FROM kecamatan WHERE kabupaten_kota_id = ? ORDER BY nama_kecamatan ASC",
      [kabupatenId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil kecamatan" });
  }
});

module.exports = router;
