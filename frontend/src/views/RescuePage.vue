<template>
  <div class="search-page">
    <div class="filter-controls">
      <button class="btn-aksi" @click="buatLaporan">Kirim Laporan</button>
      <button 
        class="btn-aksi"
        :class="{ active: showLaporan }"
        @click="toggleLaporan"
      >
        Laporan Anda
      </button>
    </div>

    <transition name="fade">
            <div v-if="showLaporan && latestUserReport" class="laporan-anda">
        <h2>Laporan Anda</h2>
        <div class="laporan-box">
          <div class="laporan-foto">
            <img :src="latestUserReport.gambar || '../assets/kucheng.png'" alt="Foto laporan" />
          </div>

          <div class="laporan-info">
            <div class="info-item" v-for="(item, index) in dynamicLaporanFields" :key="index">
              <strong>{{ item.label }}</strong><span>:</span>
              <p>{{ item.value }}</p>
            </div>

            <div class="info-item">
              <strong>Status Penanganan</strong> <span>:</span>
              <span 
    :class="['status-badge', latestUserReport.status_display === 'Sedang Diproses' ? 'sedang' : 'selesai']"
>
    {{ latestUserReport.status_display }} 
</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="showLaporan && !latestUserReport && !loading" class="laporan-anda">
        <p style="text-align: center; color: var(--dark);">Anda belum membuat laporan rescue.</p>
    </div>

    <div class="laporan-lain-section">
      <h1><strong>Update Kucing di Sekitarmu!</strong></h1>
      <p>Temukan kabar terbaru tentang kucing yang masih butuh uluran tanganmu. Sudah siap jadi pahlawan hari ini?</p>
    </div>

    <div class="results-grid">
      <template v-if="loading">
        <div style="grid-column: 1 / -1; text-align: center; color: var(--dark);">Loading laporan...</div>
      </template>
      <template v-else-if="allReports.length === 0">
        <div style="grid-column: 1 / -1; text-align: center; color: var(--dark);">Belum ada laporan rescue di sekitar Anda.</div>
      </template>
      <template v-else>
        <div v-for="report in allReports" :key="report.id" class="cat-card">
          <div class="card-image">
            <img :src="report.gambar || '../assets/kucheng.png'" alt="Foto Kucing" />
          </div>

          <div class="card-details">
            <p><strong>Status</strong> : {{ report.status_display }}</p>
            <p><strong>Lokasi</strong> : {{ report.lokasi_penemuan }}</p>
            <p><strong>Tag</strong> : {{ report.tags || 'Tidak Ada Tag' }}</p>
        </div>
          <button class="btn-selengkapnya" @click="openDetailRescue(report.id)">
            Selengkapnya
          </button>
        </div>
      </template>
      
    </div>

    <transition name="fade-pop">
      <DetailRescue 
        v-if="showDetailRescue" 
        :rescue-id="selectedRescueId" 
        @close="closeDetailRescue"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DetailRescue from '../components/DetailRescue.vue'
import axios from "../services/api";

const router = useRouter()

const showLaporan = ref(false)
const allReports = ref([])
const userReports = ref([])
const loading = ref(true)

// 🔥 Ambil laporan terbaru user
const latestUserReport = computed(() =>
  userReports.value.length > 0 ? userReports.value[0] : null
)

// 🔥 Field laporan user
const dynamicLaporanFields = computed(() => {
  const report = latestUserReport.value
  if (!report) return []

  const formattedDate = new Date(report.waktu_penemuan).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

  return [
    { label: "Nama Pelapor", value: report.nama_pelapor },
    { label: "No. Telepon", value: report.telepon },
    { label: "Waktu Penemuan", value: formattedDate },
    { label: "Lokasi", value: report.lokasi_penemuan },
    { label: "Tag", value: report.tags || "Tidak Ada" },
    { label: "Deskripsi", value: report.deskripsi }
  ]
})

/* ============================================
   🔥 FETCH GRID LAPORAN RESCUE
============================================ */
const fetchAllReports = async () => {
  try {
    const res = await axios.get('/rescue')
    allReports.value = res.data.data || []
  } catch (err) {
    console.error("Gagal ambil Grid:", err)
  }
}

/* ============================================
   🔥 FETCH LAPORAN ANDA
============================================ */
const fetchUserReports = async () => {
  const ids = JSON.parse(localStorage.getItem('myRescueReports') || '[]')
  if (ids.length === 0) {
    userReports.value = []
    return
  }

  try {
    const idsString = ids.join(',')
    const res = await axios.get(`/rescue?ids=${idsString}`)
    const newReports = res.data.data || []

    // ✅ Tambahkan laporan baru ke existing array, tanpa overwrite
    newReports.forEach(r => {
      const exists = userReports.value.find(u => u.id === r.id)
      if (!exists) userReports.value.push(r)
    })
  } catch (err) {
    console.error("Gagal ambil Laporan Anda:", err)
  }
}


/* ============================================
   🔥 REFRESH DATA
============================================ */
const refreshData = async () => {
  loading.value = true
  await fetchAllReports()
  await fetchUserReports()
  loading.value = false
}

/* ============================================
   ACTION / BUTTONS
============================================ */
const toggleLaporan = () => showLaporan.value = !showLaporan.value
const buatLaporan = () => router.push({ name: 'FormLaporanRescue' })

/* ============================================
   DETAIL RESCUE POPUP
============================================ */
const showDetailRescue = ref(false)
const selectedRescueId = ref(null)

const openDetailRescue = (id) => {
  selectedRescueId.value = id
  showDetailRescue.value = true
  document.body.style.overflow = 'hidden'
}

const closeDetailRescue = () => {
  showDetailRescue.value = false
  selectedRescueId.value = null
  document.body.style.overflow = 'auto'
  refreshData()
}

onMounted(() => refreshData())
</script>



<style scoped>
.search-page {
  background-color: var(--browny);
  padding: 2rem 5rem;
  min-height: 90vh;
}

/* Tombol aksi */
.filter-controls {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.btn-aksi {
  background-color: white;
  color: var(--dark);
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  flex: 1;
  max-width: 200px;
}

.btn-aksi:hover {
  background-color: var(--primary);
  color: white;
}

.btn-aksi.active {
  background-color: var(--primary);
  color: white;
}

/* Laporan Anda Box */
.laporan-anda {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-width: 850px;
  margin: 0 auto 3rem auto;
}

.laporan-anda h2 {
  color: var(--primary);
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Layout isi laporan */
.laporan-box {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.laporan-foto {
  flex-shrink: 0;
  width: 230px;
  height: 230px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.laporan-foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info teks */
.laporan-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.info-item {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: #333;
}

.info-item strong {
  width: 170px;
  flex-shrink: 0;
}

.info-item p {
  margin: 0;
}

/* Badge status */
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
}

.status-badge.selesai {
  background-color: #2ecc71;
}

.status-badge.sedang {
  background-color: #f39c12;
}

.status-badge.belum {
  background-color: #e74c3c;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Transition untuk modal */
.fade-pop-enter-active, .fade-pop-leave-active {
  transition: opacity 0.3s ease;
}

.fade-pop-enter-from, .fade-pop-leave-to {
  opacity: 0;
}

/* Judul tengah */
.laporan-lain-section {
  text-align: center;
  margin-bottom: 2rem;
}

.laporan-lain-section h1 {
  font-size: 2rem;
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.laporan-lain-section p {
  color: var(--dark);
  max-width: 700px;
  margin: 0 auto;
  font-size: 1rem;
}

/* Grid laporan lain */
.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.8rem;
  padding: 0 20px;
}

/* CARD RESCUE */
.cat-card {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.cat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 15px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-details {
  padding: 0 10px;
  color: var(--dark);
  font-size: 0.95rem;
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 15px;
}

.btn-selengkapnya {
  display: block;
  text-align: center;
  padding: 0.75rem;
  background-color: var(--primary);
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-selengkapnya:hover {
  background-color: #e07b20;
}

/* RESPONSIVE DESIGN */
@media (max-width: 1200px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .search-page {
    padding: 2rem 3rem;
  }
}

@media (max-width: 992px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .search-page {
    padding: 1.5rem 2rem;
  }
  
  .laporan-box {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .laporan-foto {
    width: 100%;
    max-width: 300px;
    height: 200px;
  }
  
  .laporan-info {
    width: 100%;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }
  
  .info-item strong {
    width: auto;
  }
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 10px;
  }
  
  .search-page {
    padding: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .btn-aksi {
    max-width: 100%;
    width: 100%;
  }
  
  .laporan-anda {
    padding: 1.5rem;
    margin: 0 auto 2rem auto;
  }
  
  .laporan-lain-section h1 {
    font-size: 1.5rem;
  }
  
  .laporan-lain-section p {
    font-size: 0.9rem;
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .search-page {
    padding: 0.5rem;
  }
  
  .results-grid {
    padding: 0 5px;
    gap: 1rem;
  }
  
  .cat-card {
    padding: 10px;
  }
  
  .card-image {
    height: 150px;
  }
  
  .card-details {
    font-size: 0.85rem;
    padding: 0 5px;
  }
  
  .btn-selengkapnya {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .laporan-anda {
    padding: 1rem;
  }
  
  .laporan-lain-section h1 {
    font-size: 1.3rem;
  }
}

</style>
