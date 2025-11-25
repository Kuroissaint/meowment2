// backend/src/routes/adopsiRoutes.js
const express = require('express');
const router = express.Router();
//const multer = require('multer');
//const path = require('path');
const controller = require("../controllers/pengajuanAdopsiController");

router.post("/pengajuan-adopsi", controller.buatPengajuan);
router.get("/pengajuan-adopsi/:pengguna_id", controller.getPengajuanUser);

module.exports = router;
