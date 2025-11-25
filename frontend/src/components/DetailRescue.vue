<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box">
        <div class="detail-page">
          <div class="detail-card">
            <!-- Judul di Tengah -->
            <h2 class="judul-laporan">Detail Laporan</h2>
  
            <!-- Bagian Konten Utama -->
            <div class="content-wrapper">
              <!-- Foto -->
              <div class="foto-laporan">
                <img :src="laporan.foto" alt="Foto laporan" />
              </div>
  
              <!-- Info -->
              <div class="info-content">
                <div class="info-grid">
                  <div class="info-item">
                    <strong>Nama Pelapor</strong><span>:</span>
                    <p>{{ laporan.namaPelapor }}</p>
                  </div>
                  <div class="info-item">
                    <strong>No. Telepon</strong><span>:</span>
                    <p>{{ laporan.telepon }}</p>
                  </div>
                  <div class="info-item">
                    <strong>Waktu Penemuan</strong><span>:</span>
                    <p>{{ laporan.waktu }}</p>
                  </div>
                  <div class="info-item">
                    <strong>Lokasi</strong><span>:</span>
                    <p>{{ laporan.lokasi }}</p>
                  </div>
                  <div class="info-item">
                    <strong>Tag</strong><span>:</span>
                    <p>{{ laporan.tag }}</p>
                  </div>
                  <div class="info-item">
                    <strong>Deskripsi</strong><span>:</span>
                    <p>{{ laporan.deskripsi }}</p>
                  </div>
                  <div class="info-item">
                    <strong>Status Penanganan</strong><span>:</span>
                    <span :class="['status-badge', statusClass]">{{ laporan.status }}</span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Tombol Kembali -->
            <div class="btn-container">
              <button class="btn-back" @click="$emit('close')">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import kucheng from '../assets/kucheng.png'
  
  // Menerima props jika ada
  const props = defineProps({
    rescueId: [String, Number]
  })
  
  // Mendefinisikan event yang bisa dipancarkan ke parent
  const emit = defineEmits(['close'])
  
  const laporan = ref({
    foto: kucheng,
    namaPelapor: 'pau',
    telepon: '08123456789',
    waktu: '4 Nov 2025, 18:58',
    lokasi: 'Taman Kota Bandung',
    tag: 'Luka Parah',
    deskripsi: 'oren, jantan, kurus, luka di kaki kiri, butuh pertolongan segera, terlihat di taman kota bandung sekitar jam 6 sore',
    status: 'Sedang Diproses'
  })
  
  const statusClass = ref('')
  
  onMounted(() => {
    if (laporan.value.status === 'Selesai') statusClass.value = 'selesai'
    else if (laporan.value.status === 'Sedang Diproses') statusClass.value = 'sedang'
    else statusClass.value = 'belum'
  })
  </script>
  
  <style scoped>
  /* --- OVERLAY & MODAL BOX (CSS Kunci untuk Modal) --- */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    backdrop-filter: blur(5px);
  }
  
  .modal-box {
    background-color: var(--browny);
    border-radius: 30px;
    padding: 20px;
    width: 90%;
    max-width: 1000px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
    max-height: 90vh;
    overflow-y: auto;
  }
  
  /* STYLING ASLI DETAIL RESCUE (TIDAK DIUBAH) */
  .detail-page {
    min-height: auto;
    padding: 0;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    font-family: 'Poppins', sans-serif;
    animation: fadeIn 0.6s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Kartu utama */
  .detail-card {
    background: #fff;
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 950px;
    width: 100%;
    transition: 0.3s;
    position: relative;
  }
  
  .detail-card:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
  
  /* Judul di tengah */
  .judul-laporan {
    font-size: 1.8rem;
    text-align: center;
    color: #7a4a33;
    margin-bottom: 2rem;
    border-bottom: 3px solid #f4b47d;
    display: inline-block;
    padding-bottom: 6px;
    width: 100%;
  }
  
  /* Layout isi utama */
  .content-wrapper {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  /* Foto */
  .foto-laporan {
    flex: 1;
    min-width: 300px;
    max-width: 360px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  .foto-laporan img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  
  .foto-laporan img:hover {
    transform: scale(1.05);
  }
  
  /* Info */
  .info-content {
    flex: 1.2;
    color: #2c2c2c;
  }
  
  /* Grid untuk sejajarkan label, titik dua, dan isi */
  .info-item {
    display: grid;
    grid-template-columns: 180px 10px 1fr;
    align-items: start;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
  }
  
  .info-item strong {
    color: #3c2a21;
    font-weight: 600;
  }
  
  .info-item span {
    font-weight: bold;
    color: #3c2a21;
  }
  
  .info-item p {
    margin: 0;
    color: #2c2c2c;
    line-height: 1.5;
  }
  
  /* Status badge */
  .status-badge {
    padding: 0.4rem 1rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.9rem;
    color: #fff;
    margin-left: 0.5rem;
    text-transform: capitalize;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  .status-badge.selesai {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
  }
  
  .status-badge.sedang {
    background: linear-gradient(135deg, #f39c12, #f1c40f);
    color: #2c2c2c;
  }
  
  .status-badge.belum {
    background: linear-gradient(135deg, #e74c3c, #ff7675);
  }
  
  /* Tombol */
  .btn-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    width: 100%;
    margin-top: 1.5rem;
  }
  
  .btn-back {
    background: #7a4a33;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }
  
  .btn-back:hover {
    background: #5a372c;
    transform: translateY(-2px);
  }
  
  /* Responsif */
  @media (max-width: 768px) {
    .modal-box {
      width: 95%;
      padding: 15px;
    }
    
    .content-wrapper {
      flex-direction: column;
      align-items: center;
    }
  
    .foto-laporan {
      max-width: 90%;
    }
  
    .info-content {
      width: 100%;
    }
  
    .info-item {
      grid-template-columns: 120px 8px 1fr;
    }
  
    .judul-laporan {
      font-size: 1.5rem;
    }
  
    .detail-card {
      padding: 1.8rem;
    }
  }
  
  @media (max-width: 480px) {
    .modal-box {
      width: 98%;
      padding: 10px;
    }
    
    .detail-card {
      padding: 1.5rem;
    }
    
    .info-item {
      grid-template-columns: 100px 5px 1fr;
    }
  }
  </style>