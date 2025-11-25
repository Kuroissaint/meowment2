const mysql = require('mysql2/promise');

const pool = mysql.createPool({ // ✔ tanpa await
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'meowment3'
});

module.exports = pool;
