// backend/src/routes/adopsiRoutes.js

const express = require('express');
const router = express.Router();
// Pastikan nama file controller Anda:
const aplikasiController = require('../controllers/aplikasiAdopsiController'); // KOREKSI: Sesuaikan namanya
const upload = require('../config/upload'); // PENTING: Import Multer

// Rute harus sama persis dengan yang dipanggil oleh frontend: /adopsi/submit
// CATATAN: Karena route ini di-prefix /api/adopsi/ di app.js, 
// kita hanya perlu mendefinisikan /submit di sini.
router.post('/submit', // KOREKSI: Ubah path dari '/aplikasi' menjadi '/submit'
 upload.single('bukti'), // Middleware Multer untuk file upload
    aplikasiController.submitAplikasiAdopsi // KOREKSI: Gunakan nama import yang konsisten
);

module.exports = router;