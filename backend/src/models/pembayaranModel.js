// backend/src/models/PembayaranModel.js

const db = require('../config/db'); 

const PembayaranModel = {
    create: async (data, connection) => {
        const query = `
            INSERT INTO pembayaran (
                pengguna_id, jenis_transaksi, metode_bayar, jumlah,
                status, kode_transaksi, url_pembayaran
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.query(query, [
            data.pengguna_id,
            data.jenis_transaksi,
            data.jumlah, // Diambil dari biaya_adopsi di Controller
            data.metode_bayar,
            data.status, // Contoh: 'menunggu'
            data.kode_transaksi,
            data.url_pembayaran
        ]);
        return result;
    }
    // ... (Fungsi model lainnya)
};

module.exports = PembayaranModel;