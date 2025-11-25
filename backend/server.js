// backend/server.js

const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');
const path = require('path');

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'meowment',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

// Make db available globally in fastify
fastify.decorate('db', pool);

// ✅ PERBAIKAN: Update CORS untuk mengizinkan localhost:5174
fastify.register(require('@fastify/cors'), {
  origin: [
    'http://localhost:8080', 
    'http://127.0.0.1:8080',
    'http://localhost:5174',    // ✅ TAMBAH INI
    'http://127.0.0.1:5174'     // ✅ TAMBAH INI
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

// Atau untuk development, bisa allow semua origin:
// fastify.register(require('@fastify/cors'), {
//   origin: true, // ✅ Allow semua origin di development
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// });

// 💡 PERBAIKAN UTAMA: Daftarkan Fastify Multipart
fastify.register(require('@fastify/multipart'), {
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 💡 BARU: Layanan untuk file statis (gambar yang diunggah)
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', 
});

// ✅ HEALTH CHECK 
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', message: 'Server is running' };
});

// ✅ REGISTER ROUTES
fastify.register(require('./src/routes/kucingRoutes'), { prefix: '/api' });
fastify.register(require('./src/routes/pengajuanAdopsiRoutes'), { prefix: '/api' }); 

// 💡 PERBAIKAN UTAMA: FUNGSI YANG MENGEMBALIKAN INSTANCE FASTIFY
async function buildServer() {
    return fastify; 
}

module.exports = buildServer;
