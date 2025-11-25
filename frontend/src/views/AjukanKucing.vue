<template>
    <div class="form-wrapper">
      <h2 class="judul">Formulir Pengajuan Kucing Untuk Adopsi</h2>
  
      <form class="pengajuan-form" @submit.prevent="kirimForm">
        <!-- Kolom kiri -->
        <div class="kolom">
          <h3 class="judul-bagian">Data Pemilik/Pengaju</h3> <br />
  
          <label>Nama Lengkap</label>
          <input type="text" v-model="form.namaPemilik" />
  
          <label>No HP/WA</label>
          <input type="text" v-model="form.nohp" />
  
          <label>Alamat</label>
          <input type="text" v-model="form.alamat" />
        </div>
  
        <!-- Kolom kanan -->
        <div class="kolom">
          <h3 class="judul-bagian">Data Kucing</h3>
  
          <div class="upload-area" @click="uploadFoto">
            <div class="icon-upload"></div>
            <p>{{ form.foto ? form.foto.name : 'Upload foto kucing' }}</p>
            <input type="file" ref="fileInput" @change="handleFileUpload" accept=".jpg,.png" hidden />
          </div>
  
  
          <label>Nama Kucing</label>
          <input type="text" v-model="form.namaKucing" />
  
          <label>Usia</label>
          <input type="text" v-model="form.usia" />
  
          <label>Jenis Kelamin</label>
          <div class="radio-group">
            <label><input type="radio" v-model="form.jenisKelamin" value="Jantan" /> Jantan</label>
            <label><input type="radio" v-model="form.jenisKelamin" value="Betina" /> Betina</label>
          </div>
  
          <label>Biaya Adopsi</label>
          <input type="text" v-model="form.biayaAdopsi" />
  
          <label>Deskripsi Kucing</label>
          <textarea
            v-model="form.deskripsi"
            placeholder="deskripsikan kucing"
          ></textarea>
        </div>
  
        <button type="submit" class="btn-kirim">Kirim Pengajuan</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "AjukanKucing",
    data() {
      return {
        form: {
          namaPemilik: "",
          nohp: "",
          alamat: "",
          namaKucing: "",
          usia: "",
          jenisKelamin: "",
          biayaAdopsi: "",
          deskripsi: "",
          foto: null,
        },
      };
    },
    methods: {
      uploadFoto() {
        this.$refs.fileInput.click();
      },
      handleFileUpload(event) {
        this.form.foto = event.target.files[0];
      },
      kirimForm() {
        alert("Formulir pengajuan berhasil dikirim!");
        console.log(this.form);
        this.$router.push("/adopt"); // setelah submit, balik ke halaman adopsi
      },
    },
  };
  </script>
  
  <style scoped>
  /* RESET */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
  }
  
  /* BODY */
  body {
    background-color: #f7c58f;
    padding-bottom: 50px;
  }
  
  /* JUDUL UTAMA */
  .judul {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  
  /* FORM WRAPPER */
  .pengajuan-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    max-width: 1000px;
    margin: 0 auto;
    background-color: #f0e5d9;
    padding: 40px 80px;
    border-radius: 8px;
    padding-bottom: 40px ;
  }
  
  /* KOLOM */
  .kolom {
    background-color: #f0e5d9;
  }
  
  /* JUDUL BAGIAN */
  .judul-bagian {
    background-color: #f7961d;
    color: white;
    font-style: normal;
    padding: 8px 15px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 20px;
  }
  
  /* INPUT & TEXTAREA */
  input[type="text"],
  textarea {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
    margin-bottom: 15px;
    background-color: white;
  }
  
  /* RADIO GROUP */
  .radio-group {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }
  
  /* UPLOAD AREA */
  .upload-area {
    background-color: white;
    border: 2px dashed #ddd;
    border-radius: 10px;
    padding: 25px;
    text-align: center;
    color: #555;
    margin-bottom: 20px;
    cursor: pointer;
  }
  
  .icon-upload {
    font-size: 30px;
    margin-bottom: 5px;
  }
  
  /* BUTTON */
  .btn-kirim {
    grid-column: 1 / span 2;
    background-color: #b38b91;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    justify-self: center;
    font-size: 16px;
    transition: 0.3s;
  }
  
  .btn-kirim:hover {
    background-color: #a46e7a;
  }
  /* ... ATURAN CSS DESKTOP SEBELUMNYA ... */
  
  /* === RESPONSIVE HP & TABLET (max-width: 768px) === */
  @media (max-width: 768px) {
    .pengajuan-form {
      /* Perubahan utama: Ubah grid dari 2 kolom menjadi 1 kolom */
      grid-template-columns: 1fr;
      
      /* Ganti max-width dengan width: 95% agar form lebih lebar */
      max-width: none; 
      width: 95%; 
      
      /* Kurangi padding horizontal agar konten tidak terlalu sempit */
      padding: 20px 20px; 
      
      gap: 30px; /* Kurangi jarak antar kolom vertikal */
    }
    
    /* Pastikan tombol Kirim Pengajuan menempati 1 kolom penuh */
    .btn-kirim {
      /* Di desktop: grid-column: 1 / span 2; */
      grid-column: 1 / span 1; /* Di ponsel: hanya 1 kolom */
      width: 100%; /* Agar tombol full-width */
    }
  
    /* Pastikan elemen di dalam kolom (input, textarea) mengisi lebar penuh */
    input[type="text"],
    textarea {
      width: 100%;
    }
  
    /* Jika radio group terlalu lebar di ponsel, susun vertikal */
    .radio-group {
      flex-direction: column;
      gap: 5px;
      margin-bottom: 15px;
    }
  }
  
  /* Penyesuaian untuk smartphone sangat kecil (max-width: 480px) */
  @media (max-width: 480px) {
    .pengajuan-form {
      padding: 15px;
      width: 100%; /* Ambil lebar penuh */
    }
  }
  /* ... */
  </style>