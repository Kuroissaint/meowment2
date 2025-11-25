<template>
    <div class="form-wrapper">
      <h2 class="judul">Formulir Pengajuan Kucing Untuk Adopsi</h2>
  
      <form class="pengajuan-form" @submit.prevent="kirimForm">
        <div class="kolom">
          <h3 class="judul-bagian">Data Pemilik atau Pengaju</h3> <br />
  
          <label>Nama Lengkap</label>
          <input type="text" v-model="form.namaPemilik" required />
  
          <label>No HP/WA</label>
          <input type="text" v-model="form.nohp" required />
  
          <label>Alamat</label>
          <input type="text" v-model="form.alamat" required />
          
         <label>Lokasi (Provinsi)</label>
    <select v-model="form.provinsiId" @change="loadKabupaten" required>
   <option v-for="prov in provinces" :key="prov.id" :value="prov.id">
  {{ prov.nama_provinsi }}
</option>

</select>

          <label>Lokasi (Kabupaten/Kota)</label>
       <select v-model="form.kabupatenKotaId" @change="loadKecamatan" required>
    <option v-for="kab in kabupaten" :key="kab.id" :value="kab.id">
  {{ kab.nama_kabupaten_kota }}
</option>

</select>

          <label>Lokasi (Kecamatan)</label>
        <select v-model="form.kecamatanId" required>
   <option v-for="kec in kecamatan" :key="kec.id" :value="kec.id">
  {{ kec.nama_kecamatan }}
</option>

</select>

        </div>
  
        <div class="kolom">
          <h3 class="judul-bagian">Data Kucing</h3>
  
        <div class="upload-area" @click="uploadFoto">
    
    <font-awesome-icon icon="camera" class="icon-upload" />
    
    <p>{{ form.foto ? form.foto.name : 'Upload Foto Kucing' }}</p>
    
    <input 
      type="file" 
      ref="fileInput" 
      @change="handleFileUpload" 
      accept="image/jpeg,image/png" 
      hidden 
      required
    />
</div>
  
          <label>Nama Kucing</label>
          <input type="text" v-model="form.namaKucing" required />
  
          <label>Usia</label>
          <input type="text" v-model="form.usia" placeholder=required />
  
          <label>Warna Bulu</label>
          <input type="text" v-model="form.warnaBulu" required placeholder/>
  
          <label>Jenis Kelamin</label>
          <div class="radio-group">
            <label><input type="radio" v-model="form.jenisKelamin" value="Jantan" required /> Jantan</label>
            <label><input type="radio" v-model="form.jenisKelamin" value="Betina" required /> Betina</label>
          </div>

          <label>Sudah Steril?</label>
          <div class="radio-group">
            <label><input type="radio" v-model="form.sudahSteril" value="1" required /> Ya</label>
            <label><input type="radio" v-model="form.sudahSteril" value="0" required /> Tidak</label>
          </div>
  
          <label>Biaya Adopsi (Rp)</label>
          <input type="number" v-model.number="form.biayaAdopsi" required min="0" placeholder/>
  
          <label>Deskripsi Kucing</label>
          <textarea
            v-model="form.deskripsi"
            placeholder="deskripsikan kucing"
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="feedback-area">
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        </div>

        <button type="submit" class="btn-kirim" :disabled="isSubmitting">
          {{ isSubmitting ? 'Memproses...' : 'Kirim Pengajuan' }}
        </button>
      </form>
    </div>
</template>
 <script>
export default {
  data() {
    return {
      provinces: [],
      kabupaten: [],
      kecamatan: [],

      form: {
        namaKucing: "",
        jenisKelamin: "Jantan",
        warnaBulu: "",
        usia: "",
        sudahSteril: 0,
        deskripsi: "",
        foto: null,

        namaPemilik: "",
        nohp: "",
        alamat: "",

        provinsiId: "",
        kabupatenKotaId: "",
        kecamatanId: "",
      },

      isSubmitting: false,
      errorMessage: null,
      successMessage: null,
    };
  },

  mounted() {
    this.loadProvinces();
  },

  methods: {
    // =======================
    // LOAD DATA LOKASI LOKAL
    // =======================

    async loadProvinces() {
      try {
        const res = await fetch("http://localhost:3001/api/provinsi");
        this.provinces = await res.json();
      } catch (err) {
        console.error("Gagal fetch provinsi:", err);
      }
    },

    async loadKabupaten() {
      this.form.kabupatenKotaId = "";
      this.form.kecamatanId = "";
      this.kabupaten = [];
      this.kecamatan = [];

      if (!this.form.provinsiId) return;

      try {
        const res = await fetch(
          `http://localhost:3001/api/kabupaten/${this.form.provinsiId}`
        );
        this.kabupaten = await res.json();
      } catch (err) {
        console.error("Gagal fetch kabupaten:", err);
      }
    },

    async loadKecamatan() {
      this.form.kecamatanId = "";
      this.kecamatan = [];

      if (!this.form.kabupatenKotaId) return;

      try {
        const res = await fetch(
          `http://localhost:3001/api/kecamatan/${this.form.kabupatenKotaId}`
        );
        this.kecamatan = await res.json();
      } catch (err) {
        console.error("Gagal fetch kecamatan:", err);
      }
    },

    // =======================
    // FILE UPLOAD
    // =======================

    handleFileUpload(event) {
      this.form.foto = event.target.files[0];
    },

    uploadFoto() {
      this.$refs.fileInput.click();
    },

    // =======================
    // KIRIM FORM
    // =======================

    async kirimForm() {
      this.errorMessage = null;
      this.successMessage = null;

      if (!this.form.foto) {
        alert("Mohon upload foto kucing.");
        return;
      }

      this.isSubmitting = true;

      const formData = new FormData();
      formData.append("pengguna_id", 1);

      // Data kucing
      formData.append("namaKucing", this.form.namaKucing);
      formData.append("jenisKelamin", this.form.jenisKelamin);
      formData.append("warnaBulu", this.form.warnaBulu);
      formData.append("usia", this.form.usia);
      formData.append("sudahSteril", this.form.sudahSteril);
      formData.append("deskripsi", this.form.deskripsi);

      // Data pemilik
      formData.append("namaPemilik", this.form.namaPemilik);
      formData.append("nohp", this.form.nohp);
      formData.append("alamat", this.form.alamat);
      formData.append('biayaAdopsi', this.form.biayaAdopsi);

      // Lokasi
      formData.append("provinsiId", this.form.provinsiId);
      formData.append("kabupatenKotaId", this.form.kabupatenKotaId);
      formData.append("kecamatanId", this.form.kecamatanId);



      formData.append("foto", this.form.foto);

      try {
        const response = await fetch("http://localhost:3001/api/kucing", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal mengajukan kucing.");
        }

        this.successMessage = "Pengajuan berhasil dikirim!";
      } catch (err) {
        this.errorMessage = "Pengajuan gagal: " + err.message;
        console.error(err);
      } finally {
        this.isSubmitting = false;
      }
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
    font-size: 26px;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 30px;
    color: #333;
}

/* FORM WRAPPER */
.pengajuan-form { 
    margin-bottom: 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px; /* Kurangi gap */
    max-width: 1000px;
    margin: 0 auto;
    background-color: #f0e5d9;
    padding: 40px 80px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* KOLOM */
.kolom {
    padding: 10px;
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

/* LABEL */
label {
    display: block;
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: 500;
    color: #444;
}

/* INPUT & TEXTAREA */
input[type="text"],
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    margin-bottom: 15px;
    background-color: white;
    font-size: 14px;
}

/* RADIO GROUP */
.radio-group {
    display: flex;
    gap: 30px;
    margin-bottom: 20px;
}
.radio-group label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 0;
}
.radio-group input[type="radio"] {
    width: auto;
    margin: 0;
}

/* UPLOAD AREA */
.upload-area {
  

    background-color: white;
    border-radius: 20px;
    width: 200px;
    padding: 30px;
    text-align: center;
    color: grey;
    margin-bottom: 30px;
    cursor: pointer;
    transition: all 0.2s;
}

.upload-area:hover {
    background-color: #fce7d2;
}

.icon-upload {
    /* Gunakan ikon atau simbol upload yang sesuai */
    content: "⬆️"; 
    font-size: 30px;
    margin-bottom: 5px;
}

/* BUTTON */
.btn-kirim {
    grid-column: 1 / span 2;
    background-color: #b38b91;
    color: white;
    border: none;
    padding: 14px 30px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    justify-self: center;
    font-size: 18px;
    transition: 0.3s;
    min-width: 300px;
}

.btn-kirim:hover:not(:disabled) {
    background-color: #a46e7a;
}

.btn-kirim:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* FEEDBACK STYLES */
.feedback-area {
    grid-column: 1 / span 2;
    text-align: center;
    margin-top: 10px;
}

.success-message, .error-message {
    padding: 12px;
    border-radius: 5px;
    font-weight: 500;
    margin-bottom: 15px;
    font-size: 15px;
}

.success-message {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.error-message {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

/* === RESPONSIVE HP & TABLET (max-width: 768px) === */
@media (max-width: 768px) {
    .pengajuan-form {
      grid-template-columns: 1fr;
      max-width: none; 
      width: 95%; 
      padding: 20px 20px; 
      gap: 30px; 
    }
    
    .btn-kirim {
      grid-column: 1 / span 1; 
      width: 100%; 
    }
  
    .radio-group {
      flex-wrap: wrap; /* Izinkan wrap jika terlalu sempit */
      gap: 15px;
    } 
}
</style>
