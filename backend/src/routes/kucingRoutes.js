// backend/src/routes/kucingRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const kucingController = require('../controllers/kucingController');

// --- Konfigurasi Multer untuk Foto Kucing ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Folder tempat file akan disimpan
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Membuat nama file unik
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Maks 5MB
});

// GET /api/kucing: Mengambil daftar semua kucing (AdoptPage.vue)
router.get('/kucing', kucingController.getDaftarKucing);

// POST /api/kucing: Mengajukan kucing baru (AjukanKucing.vue)
// 'foto' harus sesuai dengan field name yang di-append di FormData frontend
router.post('/kucing', upload.single('foto'), kucingController.ajukanKucing); 

module.exports = router;