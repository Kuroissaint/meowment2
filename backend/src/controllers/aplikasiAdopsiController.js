// backend/src/controllers/aplikasiController.js
const  db = require('../config/db'); // Asumsi Anda punya db.getConnection()
const AplikasiAdopsiModel = require('../models/aplikasiAdopsiModel');
const PembayaranModel = require('../models/PembayaranModel');
const TransaksiAdopsiModel = require('../models/transaksiAdopsiModel');
const PengajuanAdopsiModel = require('../models/pengajuanAdopsi'); // Untuk ambil biaya

// Fungsi utility (pastikan ini di luar exports)
const generateUniqueCode = () => `TX-${Date.now()}`; 
const generatePaymentUrl = (code) => `/payment/checkout/${code}`;


exports.submitAplikasiAdopsi = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection(); 
        await connection.beginTransaction(); // Mulai Transaksi Database

        // Ambil data dari body (biayaAdopsi DIHAPUS dari input)
        const { 
            kucingId, namaLengkap, umur, alamat, nohp, 
            pekerjaan, pernahPelihara, alasan, penggunaId, metodeBayar,
             kabupatenKotaId = null, kecamatanId = null
        } = req.body; 

        const bukti_transfer = req.file ? req.file.path : null; 
// Jika Anda yakin selalu ada (atau ingin menggunakan variabel yang sama)
// dan sudah mengunggah, gunakan req.file.path
// =========================================================





        // PENTING: TAMBAHKAN LOG DEBUG INI
        //console.log('[DEBUG] Kucing ID (RAW):', kucingId);
       // console.log('[DEBUG] Pengguna ID (RAW):', penggunaId);
       /// console.log('[DEBUG] Metode Bayar (RAW):', metodeBayar);
        // =========================================================



       // console.log('Kucing ID yang Diterima di Controller:', kucingId);

       // PENTING: KONVERSI ID DARI STRING KE INTEGER
        const parsedKucingId = parseInt(kucingId, 10);
        const parsedPenggunaId = parseInt(penggunaId, 10);

        // Pastikan ID yang sudah di-parse valid
        if (isNaN(parsedKucingId) || isNaN(parsedPenggunaId) || !metodeBayar) {
             await connection.rollback();
             return res.status(400).json({ message: 'Data wajib atau ID tidak valid.' });
        }





        if (!kucingId || !penggunaId || !metodeBayar) {
             // Pastikan semua data penting ada
             await connection.rollback();
             return res.status(400).json({ message: 'Data wajib tidak lengkap.' });
        }
        

        // ambil email pengguna dari databse
        const emailPengguna = await AplikasiAdopsiModel.getEmailPengguna(parsedPenggunaId);
        if(!emailPengguna){
            await connection.rollback();
            return res.status(404).json({message: "email pengguna tidak ditemukan." })
        }

        

        // --- LANGKAH 1A: AMBIL BIAYA ADOPSI ---
       // Ambil ID pengajuan terkait kucing ini, lalu ambil biayanya.
       const pengajuanData = await PengajuanAdopsiModel.getPengajuanByKucingId(parsedKucingId, connection);
       if (!pengajuanData || !pengajuanData.biaya_adopsi) {
             await connection.rollback();
            return res.status(404).json({ message: 'Data listing (biaya adopsi) kucing tidak ditemukan.' });
       }
        const biaya_adopsi = pengajuanData.biaya_adopsi;
        const pengajuan_id = pengajuanData.id;

        // --- LANGKAH 1B: INSERT data ke APLIKASI_ADOPSI ---
        const resultAplikasi = await AplikasiAdopsiModel.create({
            pengguna_id: parsedPenggunaId,
            kucing_id: parsedKucingId, // Asumsi tabel aplikasi_adopsi masih menyimpan kucing_id
            pengajuan_id: pengajuan_id, // Tambahkan ID Pengajuan
            nama_lengkap: namaLengkap,
            umur: umur,
            telepon: nohp,
            alamat_lengkap: alamat,
            pekerjaan: pekerjaan,
            pernah_pelihara_kucing: pernahPelihara,
            alasan_adopsi: alasan,
            kabupaten_kota_id: kabupatenKotaId || null,
            kecamatan_id:kecamatanId || null
            // biaya_adopsi TIDAK DISIMPAN DI SINI
        }, connection);
        const aplikasi_adopsi_id = resultAplikasi.insertId;

        // --- LANGKAH 2: INSERT data ke PEMBAYARAN ---
        const kodeTransaksi = generateUniqueCode();
        const urlPembayaran = generatePaymentUrl(kodeTransaksi);

        const resultPembayaran = await PembayaranModel.create({
            pengguna_id: parsedPenggunaId, 
            jenis_transaksi: 'adopsi',
            jumlah: biaya_adopsi, // Menggunakan biaya dari listing
            metode_bayar: metodeBayar,
            status: 'menunggu',
            kode_transaksi: kodeTransaksi,
            url_pembayaran: urlPembayaran,
        }, connection);
        const pembayaran_id = resultPembayaran.insertId;

        // --- LANGKAH 3: INSERT data ke TRANSAKSI_ADOPSI (Penghubung) ---
        await TransaksiAdopsiModel.create({
            aplikasi_adopsi_id: aplikasi_adopsi_id,
            bukti_transfer: bukti_transfer, // KONEKSI KRITIS!
            status_pembayaran: 'pending' 
        }, connection);
        
        // Selesai: Commit semua perubahan
        await connection.commit();

        res.status(201).json({ 
            message: 'Aplikasi dan pembayaran berhasil dibuat.',
            pembayaran_id: pembayaran_id,
            kode_transaksi: kodeTransaksi,
            url_pembayaran: urlPembayaran 
        });
        
    } catch (error) {
        // Rollback jika ada kegagalan
        if (connection) await connection.rollback();
        console.error("Error submit aplikasi adopsi:", error);
        res.status(500).json({ message: 'Gagal mengirim aplikasi adopsi: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
};