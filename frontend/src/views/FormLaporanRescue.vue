<template>
  
  <div class="form-page" :style="{ backgroundImage: `url(${bg})` }">
  <div class="form-container">
      <h1>Buat Laporan Baru 🐾</h1>
      <p>Isi data di bawah ini untuk melaporkan penemuan kucing yang membutuhkan bantuan.</p>

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
          <label>Waktu Penemuan</label>
          <input v-model="form.waktu" type="datetime-local" required />
        </div>

        <div class="form-group">
          <label>Lokasi Penemuan</label>
          <input v-model="form.lokasi" type="text" placeholder="Contoh: Taman Kota Bandung" required />
        </div>

        <div class="form-group">
          <label>Tag</label>
          <select v-model="form.tag_id" required>
            <option disabled value="">-- Pilih Tag --</option>
            <option value="1">Terluka</option>
            <option value="2">Tersesat</option>
            <option value="3">Anak Kucing</option>
            <option value="4">Butuh Makan</option>
            <option value="5">Lainnya</option>
          </select>
        </div>

        <div class="form-group">
          <label>Deskripsi</label>
          <textarea v-model="form.deskripsi" rows="4" placeholder="Tuliskan kondisi kucing"></textarea>
        </div>

        <div class="form-group">
          <label>Upload Foto</label>
         <input type="file" name="gambar" @change="handleFile" accept="image/*" />
        </div>

        <div class="form-buttons">
          <button type="button" class="btn-cancel" @click="router.push('/rescue')">Kembali</button>
          <button type="submit" class="btn-submit">Kirim</button>
        </div>
      </form>
    </div>

    <!-- Popup sukses -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-box">
        <h2>Laporan Berhasil Dikirim 🎉</h2>
        <p>Terima kasih, {{ form.nama }}! Laporanmu sedang diproses oleh tim kami.</p>
        <p class="redirect-info">Mengalihkan ke <strong>Laporan Anda</strong>...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from "../services/api"
import bg from '../assets/background_fix.png'


const router = useRouter()
const showPopup = ref(false)

const form = ref({
  nama: '',
  telepon: '',
  waktu: '',
  lokasi: '',
  tag_id: '',
  deskripsi: '',
  foto: null
})

const handleFile = (e) => {
  form.value.foto = e.target.files[0]
}

const submitLaporan = async () => {
  try {
    showPopup.value = true
    const formData = new FormData()
    const deviceId = localStorage.getItem("device_id")
    formData.append("device_id", deviceId)
    formData.append("nama_pelapor", form.value.nama)
    formData.append("telepon", form.value.telepon)
    formData.append("lokasi_penemuan", form.value.lokasi)
    formData.append("deskripsi", form.value.deskripsi)
    formData.append("tag_id", form.value.tag_id)
    formData.append("waktu_penemuan", form.value.waktu || new Date().toISOString())
    formData.append("kucing_id", 0)
    if (form.value.foto) formData.append("gambar", form.value.foto)

    const response = await api.post("/rescue", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    if (response.data.success) {
  const stored = JSON.parse(localStorage.getItem("myRescueReports")) || []
  stored.push(response.data.id)
  localStorage.setItem("myRescueReports", JSON.stringify(stored))

  // Buat object laporan baru
  const newReport = {
    id: response.data.id,
    nama_pelapor: form.value.nama,
    telepon: form.value.telepon,
    waktu_penemuan: form.value.waktu || new Date().toISOString(),
    lokasi_penemuan: form.value.lokasi,
    deskripsi: form.value.deskripsi,
    status_display: 'Sedang Diproses',
    tags: '',           
    url_gambar_utama: form.value.foto ? URL.createObjectURL(form.value.foto) : null
  }

  // Tambahkan hanya jika belum ada
  const exists = userReports.value.find(r => r.id === newReport.id)
  if (!exists) userReports.value.push(newReport)
}




    console.log("ID rescue baru:", response.data.id)

    setTimeout(() => {
      showPopup.value = false
      router.push('/rescue') // kembali ke halaman grid
    }, 1000)

  } catch (error) {
    console.error("Gagal submit rescue:", error)
    alert("Gagal mengirim laporan rescue")
    showPopup.value = false
  }
}
</script>


  <style scoped>
.form-page {
  min-height: 100vh;
  background-size: cover;      /* cover seluruh layar */
  background-position: center; /* tengah */
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.form-container {
  width: 90%; /* fleksibel di mobile */
  background-color: rgba(255, 255, 255, 0.85); /* semi-transparan supaya form terbaca */
  padding: 2rem;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 480px) {
  .form-container {
    padding: 1rem;
  }

  .form-buttons {
    flex-direction: column;
    gap: 0.8rem;
  }

  .btn-submit, .btn-cancel {
    width: 100%;
  }
}

  
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  h1 {
    text-align: center;
    color: #9E7363;
    margin-bottom: 0.5rem;
  }
  
  p {
    text-align: center;
    color: #444;
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }
  
  .form-group {
    margin-bottom: 1.2rem;
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-weight: 600;
    color: #3c2a21;
    margin-bottom: 0.4rem;
  }
  
  input, textarea, select {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 0.7rem 0.9rem;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  input:focus, textarea:focus, select:focus {
    border-color: #9E7363;
    box-shadow: 0 0 6px rgba(158,115,99,0.3);
  }
  
  .form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1.8rem;
  }
  
  .btn-submit {
    background-color: #9E7363;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .btn-submit:hover {
    background-color: #5a372c;
  }
  
  .btn-cancel {
    background-color: #ccc;
    color: #333;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .btn-cancel:hover {
    background-color: #999;
  }
  
  /* Popup sukses */
  .popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s;
  }
  
  .popup-box {
    background: #fff;
    padding: 2rem 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    text-align: center;
    max-width: 400px;
    animation: slideUp 0.4s ease-out;
  }
  
  .popup-box h2 {
    color: #9E7363;
    margin-bottom: 0.5rem;
  }
  
  .popup-box p {
    color: #555;
  }
  
  .redirect-info {
    font-size: 0.9rem;
    color: #888;
    margin-top: 1rem;
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>
