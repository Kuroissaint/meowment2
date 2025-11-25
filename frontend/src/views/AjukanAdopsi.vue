<template>
    <div class="form-wrapper">
      <h2 style="text-align: center;">Formulir Adopsi</h2>
  
      <form @submit.prevent="kirimForm" enctype="multipart/form-data">
        <div class="left-col">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" placeholder="contoh: puputw@gmail.com" required />
  
          <label for="nama">Nama Lengkap</label>
          <input type="text" id="nama" v-model="form.namaLengkap" required/>
  
          <label for="umur">Umur</label>
          <input type="number" id="umur" v-model="form.umur" required/>
  
          <label for="alamat">Alamat</label>
          <input type="text" id="alamat" v-model="form.alamat" required/>
  
          <label for="nohp">No HP / WhatsApp</label>
          <input type="text" id="nohp" v-model="form.nohp" required/>
  
          <label for="pekerjaan">Pekerjaan</label>
          <input type="text" id="pekerjaan" v-model="form.pekerjaan" required/>
  
          <p>Pernah pelihara kucing?</p>
          <label><input type="radio" v-model="form.pernahPelihara" value="Ya" required /> Ya</label>
          <label><input type="radio" v-model="form.pernahPelihara" value="Tidak" /> Tidak</label>
  
          <label for="alasan">Alasan ingin mengadopsi</label>
          <textarea id="alasan" v-model="form.alasan" placeholder="Tulis alasan Anda di sini" required></textarea>
        </div>
  
        <div class="right-info">
          <h3><i>Informasi Rekening</i></h3>
  
          <div class="info-box">
            <p>Silakan transfer biaya adopsi ke:</p>
            <p><strong>BCA:</strong> 123456789<br /><strong>BRI:</strong> 004242568</p>
            
          </div>
  
          <div class="upload-box">
            <label for="bukti">Upload Bukti Pembayaran</label><br />
            <input type="file" id="bukti" @change="handleFileUpload" accept=".jpg,.png" required />
            <p style="font-size: 13px; color: gray;">Format: JPG/PNG, maksimal 5MB</p>
          </div>
  
          <h3><i>Metode Pembayaran</i></h3>
          <div class="payment-box">
             <label><input type="radio" v-model="form.metodeBayar" value="transfer_bank" required /> Transfer Bank</label><br />
             <label><input type="radio" v-model="form.metodeBayar" value="e_wallet" /> E-Wallet</label><br />
             <label><input type="radio" v-model="form.metodeBayar" value="qris" /> QRIS</label>
          </div>
        </div>
  
        <div class="commitment">
          <label>
            <input type="checkbox" v-model="form.komitmen" required />
            Saya berkomitmen untuk merawat kucing ini dengan penuh tanggung jawab.
          </label>
        </div>
  
        <button type="submit">Kirim Formulir</button>
      </form>
    </div>
</template>
  
<script>
// PENTING: API_URL harus mengarah ke endpoint controller adopsi Anda
const API_URL = 'http://localhost:3001/api/adopsi/submit';

;

export default {
    name: "AjukanAdopsi",
    data() {
      return {
        form: {
          email: "",
          namaLengkap: "", // Ganti dari 'nama'
          umur: null,      // Ganti dari 'umur'
          alamat: "",
          nohp: "",        // Ganti dari 'nohp'
          pekerjaan: "",
          pernahPelihara: "",
          alasan: "",
          bukti: null,     // Tetap ada
          metodeBayar: "", // Ganti dari 'pembayaran'
          komitmen: false,
        },
        // GANTI DENGAN NILAI YANG DINAMIS:
        kucingId:  this.$route.query.id, // Ambil dari URL Route
        biayaAdopsi: this.$route.query.biayaAdopsi,
        penggunaId: 1, // GANTI DENGAN ID PENGGUNA YANG SEDANG LOGIN
      };
    },
    methods: {
      handleFileUpload(event) {
        // Menyimpan objek File dari input
        this.form.bukti = event.target.files[0];
      },

      async kirimForm() {
        if (!this.form.komitmen) {
            alert('Anda harus berkomitmen untuk merawat kucing ini sebelum mengirim formulir.');
            return;
        }

        // --- 1. SIAPKAN DATA UNTUK BACKEND (Menggunakan FormData karena ada file) ---
        const formData = new FormData();

        // Tambahkan semua field teks
        
        formData.append('penggunaId', this.penggunaId);
        formData.append('kucingId', this.kucingId);
        formData.append('email', this.form.email);
        formData.append('namaLengkap', this.form.namaLengkap);
        formData.append('umur', this.form.umur);
        formData.append('alamat', this.form.alamat);
        formData.append('nohp', this.form.nohp);
      
        formData.append('pekerjaan', this.form.pekerjaan);
        formData.append('pernahPelihara', this.form.pernahPelihara);
        formData.append('alasan', this.form.alasan);
        formData.append('metodeBayar', this.form.metodeBayar);
        
        // Tambahkan file bukti transfer
        if (this.form.bukti) {
            formData.append('bukti', this.form.bukti); // Key 'bukti' harus sama dengan Multer di Controller
        } else {
             alert('Bukti pembayaran wajib di-upload.');
             return;
        }
        
        // --- 2. KIRIM KE BACKEND MENGGUNAKAN FETCH ---
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                // PENTING: Jangan set Content-Type: 'multipart/form-data', 
                // Biarkan browser yang menentukannya agar boundary ditambahkan
                body: formData 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengirim data ke server.');
            }

            // --- 3. SUKSES & REDIRECT ---
            alert('Aplikasi Adopsi berhasil dikirim! Menunggu konfirmasi admin.');
            
            // Redirect ke halaman sukses atau list transaksi
            this.$router.push("/transaksi-sukses"); 

        } catch (error) {
            console.error("Gagal mengirim aplikasi:", error);
            // Tangkap error Multer/Controller
            alert(`Gagal! ${error.message || 'Terjadi kesalahan jaringan atau server.'}`);
        }
      },
    },
};
</script>
  
<style scoped>
/*
  ... (Semua styling CSS Anda di sini, tidak ada perubahan) ...
*/
/* Tetap pertahankan semua styling CSS di bawah ini */

body {
  font-family: Arial, sans-serif;
  background-color: #f7c58f;
  margin: 0;
  padding: 0;
}

/* === WRAPPER UTAMA === */
form {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 70px;
  background-color: #F0E5D9;
  padding: 40px 80px;
  width: 80%;
  margin: 40px auto;
  border-radius: 8px;
  padding-bottom: 200px;
}

/* === BAGIAN KIRI (FORM INPUT) === */
form label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
  margin-bottom: 4px;
}

form input[type="text"],
form input[type="email"],
form textarea,
form input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

form textarea {
  height: 70px;
}

/* Radio dan checkbox */
input[type="radio"],
input[type="checkbox"] {
  accent-color: #b47b6a;
}

/* === BAGIAN KANAN (INFO REKENING & PEMBAYARAN) === */
h3, h4 {
  text-align: center;
  font-weight: 600;
}

.right-info {
  background-color: #F0E5D9;
}

.info-box {
  background-color: #d6d2d2;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
}

.upload-box {
  background-color: #d6d2d2;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  margin-top: 20px;
  color: #5f5f5f;
}

.payment-box {
  background-color: #d6d2d2;
  border-radius: 8px;
  padding: 10px 15px;
  margin-top: 20px;
}

/* === TOMBOL KIRIM === */
button {
  grid-column: 1 / span 2;
  justify-self: center;
  background-color: #f7961d;
  color: white;
  border: none;
  padding: 10px 50px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #d9820f;
}

/* === RESPONSIVE HP === */
@media (max-width: 768px) {
  form {
    grid-template-columns: 1fr;
    width: 90%;
    padding: 20px;
  }
  button {
    width: 100%;
  }
}

/* === RESPONSIVE HP & TABLET (max-width: 900px) === */
@media (max-width: 900px) {
  form {
    grid-template-columns: 1fr;
    width: 95%;
    padding: 20px 20px;
    gap: 30px;
    margin: 20px auto;
  }

  .left-col p {
    margin-top: 15px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .left-col label:has(input[type="radio"]) {
    display: inline-block;
    margin-right: 15px;
    font-weight: normal;
  }
  
  .commitment {
      margin-top: 10px;
  }

  button {
    width: 100%;
    grid-column: 1 / span 1;
    padding: 12px 0;
  }
}

/* Penyesuaian untuk smartphone sangat kecil */
@media (max-width: 480px) {
  form {
    padding: 15px; 
  }
}
</style>
