// backend/src/models/TransaksiAdopsiModel.js
const db = require('../config/db');

class TransaksiAdopsiModel {
  static async create(data, connection) {
    const query = `
      INSERT INTO transaksi_adopsi (
          aplikasi_adopsi_id, bukti_transfer, status_pembayaran
      )
      VALUES (?, ?, ?)
    `;

    const [result] = await connection.query(
      query,
      [
        data.aplikasi_adopsi_id,
          data.bukti_transfer,
        data.status_pembayaran,
       // Ini adalah URL/path file
      ]
    );
    return result;
  }
}

module.exports = TransaksiAdopsiModel;

// await connection.query(query, values);