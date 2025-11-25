<template>
  <div class="form-page">
    <div class="content-wrapper">
      <div class="form-container">
        <div class="badge">Laporan Kucing Hilang</div>
        <h1>Buat Laporan Baru 🐾</h1>
        <p>Isi data di bawah ini untuk melaporkan kucing anda yang hilang.</p>

        <form @submit.prevent="submitLaporan">

          <div class="form-group">
            <label>Nama Pelapor</label>
            <input v-model="form.nama" type="text" placeholder="Nama kamu" required />
          </div>
          <div class="form-group">
            <label>No. Telepon</label>
            <input v-model="form.telepon" type="text" placeholder="08xxxxxxxxxx" required />
          </div>
          <div class="form-group">
            <label>Waktu Hilang</label>
            <input v-model="form.waktu" type="datetime-local" required />
          </div>

          <div class="form-group location-group">
            <label>Lokasi Hilang</label>
            
            <select v-model="selectedProvinsi" @change="fetchKota" class="mb-2" required>
              <option value="" disabled>-- Pilih Provinsi --</option>
              <option v-for="prov in listProvinsi" :key="prov.id" :value="prov">
                {{ prov.nama_provinsi }}
              </option>
            </select>

            <select v-model="selectedKota" @change="fetchKecamatan" :disabled="!selectedProvinsi" class="mb-2" required>
              <option value="" disabled>-- Pilih Kota/Kab --</option>
              <option v-for="kota in listKota" :key="kota.id" :value="kota">
                {{ kota.nama_kabupaten_kota }}
              </option>
            </select>

            <select v-model="selectedKecamatan" :disabled="!selectedKota" class="mb-2" required>
              <option value="" disabled>-- Pilih Kecamatan --</option>
              <option v-for="kec in listKecamatan" :key="kec.id" :value="kec">
                {{ kec.nama_kecamatan }}
              </option>
            </select>

            <input v-model="detailJalan" type="text" placeholder="Detail: Nama Jalan / Patokan / No Rumah" required />
          </div>

          <div class="form-group">
            <label>Ras</label>
            <select v-model="form.ras" required>
              <option disabled value="">-- Pilih Ras --</option>
              <option value="Anggora">Anggora</option>
              <option value="Calico">Calico</option>
              <option value="Kampung">Kampung</option>
              <option value="Persia">Persia</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div class="form-group">
            <label>Ciri-ciri (Pilih sesuai kategori)</label>
            
            <div v-for="(tags, kategori) in tagsByCategory" :key="kategori" class="category-section">
              
              <h4 class="category-title">{{ kategori }}</h4>
              
              <div class="tags-wrapper">
                <div 
                  v-for="t in tags" 
                  :key="t.id" 
                  class="tag-chip"
                  :class="{ 'active': form.tags.includes(t.nama_tag) }"
                  @click="toggleTag(t.nama_tag)"
                >
                  {{ t.nama_tag }}
                </div>
              </div>
            </div>

            <small v-if="form.tags.length > 0" class="selected-info">
              Total: {{ form.tags.length }} ciri dipilih
            </small>
          </div>

          <div class="form-group">
            <label>Deskripsi</label>
            <textarea v-model="form.deskripsi" rows="4" placeholder="Tuliskan kondisi kucing"></textarea>
          </div>
          <div class="form-group">
            <label>Upload Foto (Bisa pilih banyak)</label>
            <input type="file" @change="handleFile" accept="image/*" multiple />
            
            <small v-if="form.fotos.length > 0" class="selected-info">
              {{ form.fotos.length }} foto dipilih
            </small>
          </div>

          <div class="form-buttons">
            <button type="button" class="btn-cancel" @click="router.push('/rescue')">Kembali</button>
            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Mengirim...' : 'Kirim' }}
            </button>
          </div>

        </form>
      </div>
    </div>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-box">
        <img src="../assets/kucingOyen.png" class="popup-cat" />
        <h2>Laporan Berhasil! 🎉</h2>
        <p>Terima kasih, {{ form.nama }}!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import API from '../services/api';

const router = useRouter()
const loading = ref(false);
const showPopup = ref(false);

// Data Master
const tagOptions = ref([]);
const listProvinsi = ref([]);
const listKota = ref([]);
const listKecamatan = ref([]);

// Selection State (Object biar bisa ambil namanya)
const selectedProvinsi = ref('');
const selectedKota = ref('');
const selectedKecamatan = ref('');
const detailJalan = ref('');

const form = ref({
  nama: '', telepon: '', waktu: '', ras: '', 
  tags: [], deskripsi: '', 
  fotos: [],
  lokasi: '' 
})

// --- LOGIC WILAYAH ---
// 1. Ambil Provinsi saat load
const loadProvinsi = async () => {
  try {
    const res = await API.get('/wilayah/provinsi');
    listProvinsi.value = res.data.data;
  } catch (e) { console.error(e); }
}

// 2. Ambil Kota saat Provinsi dipilih
const fetchKota = async () => {
  if(!selectedProvinsi.value) return;
  listKota.value = []; // Reset bawahnya
  listKecamatan.value = [];
  selectedKota.value = '';
  selectedKecamatan.value = '';
  
  try {
    const res = await API.get(`/wilayah/kota/${selectedProvinsi.value.id}`);
    listKota.value = res.data.data;
  } catch (e) { console.error(e); }
}

// 3. Ambil Kecamatan saat Kota dipilih
const fetchKecamatan = async () => {
  if(!selectedKota.value) return;
  listKecamatan.value = [];
  selectedKecamatan.value = '';

  try {
    const res = await API.get(`/wilayah/kecamatan/${selectedKota.value.id}`);
    listKecamatan.value = res.data.data;
  } catch (e) { console.error(e); }
}

// --- LOGIC LAINNYA (Tag & File) ---

const tagsByCategory = computed(() => {
  const groups = {};
  
  tagOptions.value.forEach(tag => {
    // Kalau ada kolom kategori di DB, pakai itu. Kalau null, masuk 'Lainnya'
    const k = tag.kategori || 'Lainnya';
    
    if (!groups[k]) {
      groups[k] = [];
    }
    groups[k].push(tag);
  });
  
  // (Opsional) Urutkan kunci kategori agar Warna selalu di atas (jika mau)
  return groups; 
});

onMounted(() => {
  loadProvinsi();
  API.get('/tags').then(res => tagOptions.value = res.data.data);
});

const toggleTag = (tagName) => {
  if (form.value.tags.includes(tagName)) form.value.tags = form.value.tags.filter(t => t !== tagName);
  else form.value.tags.push(tagName);
}

const handleFile = (event) => {
  form.value.fotos = Array.from(event.target.files);
}

// --- SUBMIT ---
const submitLaporan = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    
    // --- Append Data (Sama seperti sebelumnya) ---
    if (selectedProvinsi.value) formData.append('provinsi_id', selectedProvinsi.value.id);
    if (selectedKota.value) formData.append('kabupaten_kota_id', selectedKota.value.id);
    if (selectedKecamatan.value) formData.append('kecamatan_id', selectedKecamatan.value.id);
    formData.append('lokasi', detailJalan.value);
    formData.append('nama_pelapor', form.value.nama);
    formData.append('telepon', form.value.telepon);
    formData.append('waktu_hilang', form.value.waktu);
    formData.append('nama_kucing', 'Kucing Hilang'); 
    formData.append('ras', form.value.ras);
    formData.append('deskripsi', form.value.deskripsi);
    
    form.value.tags.forEach(tag => formData.append('tags', tag));
    if (form.value.fotos && form.value.fotos.length > 0) {
        form.value.fotos.forEach(file => {
            formData.append('foto', file); 
        });
    } else {
        console.warn("Tidak ada foto yang dipilih!");
    }

    // 1. KIRIM KE BACKEND
    const response = await API.post('/kucing', formData);

    // ✅ 2. SIMPAN ID KE BROWSER (INI KUNCINYA!)
    const newId = response.data.data.id;
    
    // Ambil data lama
    let myReports = JSON.parse(localStorage.getItem('my_reports') || '[]');
    
    // Masukkan ID baru kalau belum ada
    if (!myReports.includes(newId)) {
        myReports.push(newId);
        localStorage.setItem('my_reports', JSON.stringify(myReports));
    }

    console.log("Laporan tersimpan di browser:", myReports); // Cek console nanti

    // 3. Tampilkan Popup & Redirect
    showPopup.value = true;
    setTimeout(() => {
      showPopup.value = false;
      router.push({ name: 'MySearch' }); // Pindah ke halaman Laporan Anda
    }, 2500);

  } catch (error) {
    console.error("Gagal lapor:", error);
    alert("Terjadi kesalahan saat mengirim laporan.");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>

/* Tambahan dikit buat lokasi */
.location-group select {
  margin-bottom: 10px; /* Jarak antar dropdown */
}

/* ... paste CSS estetik tadi ... */
/* (Biar gak kepanjangan, saya asumsikan kamu pakai CSS estetik sebelumnya) */
.form-page {
  background: url(../assets/paw-pattern.png);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Poppins', sans-serif;
}
.content-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
}
.form-container {
  background: white;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}
.form-group { margin-bottom: 1.3rem; display: flex; flex-direction: column; }
label { font-weight: 600; color: #3c2a21; margin-bottom: 0.4rem; }
input, textarea, select {
  border: 1px solid #d8c5bb;
  background: #fffdfb;
  border-radius: 12px;
  padding: 0.75rem 0.9rem;
  width: 100%;
  box-sizing: border-box;
}

.category-section {
  margin-bottom: 15px;
}

.category-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #8d5e46;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px dashed #ddd; /* Garis pemisah tipis */
  padding-bottom: 4px;
  width: 100%;
}

.tags-wrapper {
  margin-top: 0; /* Reset margin karena sudah ada title */
}

.tags-wrapper { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 10px; 
  margin-top: 5px; 
}
.tag-chip {
  background: #f0ebe8; 
  padding: 8px 16px; 
  border-radius: 25px; 
  font-size: 0.9rem; 
  cursor: pointer; 
  user-select: none;
}
.tag-chip.active {
  background: linear-gradient(135deg, #a7775a, #8d5e46); color: white;
}
.form-buttons { 
  display: flex; 
  gap: 1rem; 
  margin-top: 2rem; 
}
.btn-submit, .btn-cancel { 
  flex: 1; 
  padding: 0.8rem; 
  border-radius: 10px; 
  cursor: pointer; 
  border: none; 
}
.btn-submit { 
  background: #a7775a; 
  color: white; 
}
.btn-cancel { 
  background: #ddd; 
}
.popup-overlay { 
  position: fixed; inset: 0; 
  background: rgba(0,0,0,0.5); 
  display: flex; 
  justify-content: center; 
  align-items: center; 
}
.popup-box { 
  background: white; 
  padding: 2rem; 
  border-radius: 15px; 
  text-align: center; 
}
.popup-cat { 
  width: 80px; 
}

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 768px) {
  .form-page { padding: 1rem 0.5rem; } /* Kurangi padding luar */
  
  .form-container {
    padding: 1.5rem; /* Kurangi padding dalam */
    border-radius: 16px;
  }
  
  h1 { font-size: 1.5rem; }
  
  .form-buttons {
    flex-direction: column-reverse; /* Tombol kirim di atas cancel */
    gap: 12px;
  }
  
  .btn-submit, .btn-cancel { width: 100%; }
}
</style>