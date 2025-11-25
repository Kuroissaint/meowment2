// backend/index.js
const express = require('express');
const cors = require('cors');
const kucingRoutes = require('./src/routes/kucingRoutes'); 
const pengajuanAdopsiRoutes = require('./src/routes/pengajuanAdopsiRoutes'); // Import routes baru
const adopsiRoutes = require('./src/routes/adopsiRoutes');
const lokasiRoutes = require('./src/routes/lokasiRoutes');


const app = express();
const PORT = 3001; 

// Middleware CORS
app.use(cors());

// Middleware untuk body parser (data JSON)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// PENTING: Middleware untuk melayani file statis (foto)
// File akan dapat diakses melalui http://localhost:3001/uploads/namafile.jpg
app.use('/uploads', express.static('uploads'));

// Routes API
app.use('/api', kucingRoutes);
app.use('/api', lokasiRoutes);

app.use('/api/pengajuan-adopsi', pengajuanAdopsiRoutes);
app.use('/api/adopsi', adopsiRoutes);




app.listen(PORT, () => {
    console.log(`Server Backend Meowment berjalan di http://localhost:${PORT}`);
});
