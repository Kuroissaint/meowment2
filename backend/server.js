// server.js
const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');
const cors = require('@fastify/cors');
// server.js (Contoh)

const path = require('path')
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', // harus sama dengan url_gambar di DB
});


// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'meowment3',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

// Make db available globally in Fastify
fastify.decorate('db', pool);

// Register CORS
fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000'], // frontend ports
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', message: 'Server is running' };
});

// Register routes
fastify.register(require('@fastify/multipart'), {
  attachFieldsToBody: true
});

fastify.register(require('./src/routes/rescueRoutes'), { prefix: '/api/rescue' });
// nanti kalau ada route lain misal donate, adopt tinggal register:
// fastify.register(require('./src/routes/donateRoutes'), { prefix: '/api/donate' });


// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: 3000,
      host: '0.0.0.0'
    });
    console.log('🚀 Server running on http://localhost:3000');
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

start();
