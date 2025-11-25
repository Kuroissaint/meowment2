const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');
const path = require('path'); // ✅ Import path

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'meowment3',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

fastify.decorate('db', pool);

fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

fastify.register(require('@fastify/multipart'), { 
  attachFieldsToBody: true, 
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas 5 MB (Sesuaikan kebutuhan)
  }
});

// ✅ REGISTER STATIC FILE (Agar foto bisa dibuka di browser)
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', // Akses via: http://localhost:3000/uploads/namafile.jpg
});

fastify.get('/health', async (request, reply) => {
  return { status: 'OK', message: 'Server is running' };
});

// Routes
fastify.register(require('./src/routes/kucingRoutes'), { prefix: '/api' });
fastify.register(require('./src/routes/wilayahRoutes'), { prefix: '/api' });

const start = async () => {
  try {
    await fastify.listen({ 
      port: 3000,
      host: '0.0.0.0'
    });
    console.log('🚀 Server running on http://localhost:3000');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();