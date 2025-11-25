<template>
    <div class="form-wrapper">
      <h2 style="text-align: center;">Formulir Adopsi</h2>
  
      <form @submit.prevent="kirimForm" enctype="multipart/form-data">
        <!-- Kolom kiri -->
        <div class="left-col">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" placeholder="contoh: puputw@gmail.com" required />
  
          <label for="nama">Nama Lengkap</label>
          <input type="text" id="nama" v-model="form.nama"/>
  
          <label for="umur">Umur</label>
          <input type="number" id="umur" v-model="form.umur"/>
  
          <label for="alamat">Alamat</label>
          <input type="text" id="alamat" v-model="form.alamat"/>
  
          <label for="nohp">No HP / WhatsApp</label>
          <input type="text" id="nohp" v-model="form.nohp"/>
  
          <label for="pekerjaan">Pekerjaan</label>
          <input type="text" id="pekerjaan" v-model="form.pekerjaan" />
  
          <p>Pernah pelihara kucing?</p>
          <label><input type="radio" v-model="form.pernahPelihara" value="ya" required /> Ya</label>
          <label><input type="radio" v-model="form.pernahPelihara" value="tidak" /> Tidak</label>
  
          <label for="alasan">Alasan ingin mengadopsi</label>
          <textarea id="alasan" v-model="form.alasan" placeholder="Tulis alasan Anda di sini" required></textarea>
        </div>
  
        <!-- Kolom kanan -->
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
            <label><input type="radio" v-model="form.pembayaran" value="transfer" required /> Transfer Bank</label><br />
            <label><input type="radio" v-model="form.pembayaran" value="ewallet" /> E-Wallet</label><br />
            <label><input type="radio" v-model="form.pembayaran" value="qris" /> QRIS</label>
          </div>
        </div>
  
        <!-- Bagian bawah -->
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
  export default {
    name: "AjukanKucing",
    data() {
      return {
        form: {
          email: "",
          nama: "",
          umur: "",
          alamat: "",
          nohp: "",
          pekerjaan: "",
          pernahPelihara: "",
          alasan: "",
          bukti: null,
          pembayaran: "",
          komitmen: false,
        },
      };
    },
    methods: {
      handleFileUpload(event) {
        this.form.bukti = event.target.files[0];
      },
      kirimForm() {
        alert(`Formulir adopsi berhasil dikirim`);
        console.log(this.form);
        // ditambah kirim ke backend / API
        this.$router.push("/"); // contoh redirect balik ke home
      },
    },
  };
  </script>
  
  <style scoped>
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
  /* ... ATURAN CSS DESKTOP SEBELUMNYA ... */
  
  /* === RESPONSIVE HP & TABLET (max-width: 900px) === */
  @media (max-width: 900px) {
    /*
    --- FORM UTAMA ---
    Ubah grid dari 2 kolom (1.3fr 1fr) menjadi 1 kolom (1fr)
    */
    form {
      grid-template-columns: 1fr;
      width: 95%; /* Lebih lebar di ponsel */
      padding: 20px 20px; /* Padding lebih kecil */
      gap: 30px; /* Jarak antar kolom vertikal */
      margin: 20px auto; /* Margin atas-bawah dikurangi */
    }
  
    /*
    --- RADIO BUTTONS (YA/TIDAK) ---
    Mengubah tampilan radio button agar tidak bertabrakan
    */
    .left-col p {
      margin-top: 15px;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .left-col label:has(input[type="radio"]) {
      display: inline-block; /* Agar label radio button bersebelahan */
      margin-right: 15px;
      font-weight: normal;
    }
    
    /*
    --- CHECKBOX & TOMBOL KIRIM ---
    Pastikan checkbox dan tombol kirim menempati 1 kolom penuh
    */
    .commitment {
        margin-top: 10px;
    }
  
    button {
      width: 100%;
      grid-column: 1 / span 1; /* Hanya menempati 1 kolom */
      padding: 12px 0; /* Padding vertikal lebih besar */
    }
  }
  
  /* Penyesuaian untuk smartphone sangat kecil */
  @media (max-width: 480px) {
    /* Padding minimal di layar sangat sempit */
    form {
      padding: 15px; 
    }
  }
  </style>