<template>
    <section class="detail-container" v-if="cat">
      <h2>Adopsi Kucing</h2>
  
      <div class="detail-content">
        
        <div class="cat-photo">
            <button 
                class="nav-btn prev" 
                @click="prevImage" 
                v-if="cat.galeri && cat.galeri.length > 1"
            >
                &#10094;
            </button>
            
            <img :src="cat.galeri[currentImageIndex]" :alt="cat.nama" />
            
            <button 
                class="nav-btn next" 
                @click="nextImage" 
                v-if="cat.galeri && cat.galeri.length > 1"
            >
                &#10095;
            </button>
  
            <div class="dots-indicator" v-if="cat.galeri && cat.galeri.length > 1">
                <span 
                    v-for="(img, index) in cat.galeri" 
                    :key="index"
                    :class="{ active: index === currentImageIndex }"
                    @click="selectImage(index)"
                ></span>
            </div>
        </div>
        <div class="cat-info">
          <h3>{{ cat.nama }}</h3>
          <p>Umur: {{ cat.umur }}</p>
          <p>Warna: {{ cat.warnaBulu }}</p>
          <p>Jenis kelamin: {{ cat.jenisKelamin }}</p>
          <p>Alamat: {{ cat.alamat }}</p>
          <p>{{ cat.sudahSteril ? 'Sudah disteril' : 'Belum disteril' }}</p>
  
          <h4 class="price">Biaya Adopsi: {{ cat.biayaAdopsi }}</h4>
          
          <button class="ajukanadopt-btn" @click="$router.push({ name: 'AjukanAdopsi' })">
            Ajukan adopsi
          </button>
        </div>
      </div>
  
      <div class="desc">
        <h3>Deskripsi</h3>
        <p><em>{{ cat.deskripsi }}</em></p>
      </div>
  
    </section>
  </template>
  
  <script>
  export default {
    name: "AdoptDetail",
    data() {
      return {
        cat: null,
        // 1. STATE CAROUSEL: Melacak gambar mana yang aktif
        currentImageIndex: 0, 
      };
    },
    mounted() {
      // 2. LOGIC PENERIMAAN GALERI
      const galeriString = this.$route.query.galeri;
      let galeriArray = [];
  
      try {
          if (galeriString) {
              // Mengubah string JSON kembali menjadi array JavaScript
              galeriArray = JSON.parse(galeriString);
          }
      } catch (e) {
          console.error("Gagal mem-parsing galeri:", e);
      }
      
      this.cat = {
        nama: this.$route.params.nama,
        umur: this.$route.query.umur, 
        kota: this.$route.query.kota,
        warnaBulu: this.$route.query.warnaBulu,
        jenisKelamin: this.$route.query.jenisKelamin,
        alamat: this.$route.query.alamat,
        sudahSteril: this.$route.query.sudahSteril == "true",
        biayaAdopsi: this.$route.query.biayaAdopsi,
        deskripsi: this.$route.query.deskripsi,
        // Menyimpan array foto ke dalam objek cat
        galeri: galeriArray,
      };
    },
    methods: {
      // 3. METHODS CAROUSEL: Pindah ke gambar berikutnya
      nextImage() {
        const nextIndex = this.currentImageIndex + 1;
        // Kembali ke gambar pertama jika sudah mencapai akhir
        this.currentImageIndex = nextIndex < this.cat.galeri.length ? nextIndex : 0;
      },
      // Pindah ke gambar sebelumnya
      prevImage() {
        const prevIndex = this.currentImageIndex - 1;
        // Kembali ke gambar terakhir jika sudah mencapai awal
        this.currentImageIndex = prevIndex >= 0 ? prevIndex : this.cat.galeri.length - 1;
      },
      // Pindah ke gambar berdasarkan dot indicator
      selectImage(index) {
          this.currentImageIndex = index;
      }
    }
  };
  </script>
  
  <style scoped>
  .detail-container {
    background-color: #f7c58c;
    padding: 40px 60px;
  }
  
  /* Tata letak DESKTOP: Foto dan Info Samping-menyamping */
  .detail-content {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 120px; 
    margin-top: 20px;
  }
  
  /* --- CAROUSEL/FOTO (Desktop) --- */
  .cat-photo {
    position: relative;
    width: 320px; 
    height: 350px;
    border-radius: 20px;
    background-color: #7c5143;
    padding: 10px;
    overflow: hidden; 
  }
  
  .cat-photo img {
    width: 100%;
    height: 100%;
    border-radius: 15px; 
    object-fit: cover; 
    transition: opacity 0.3s ease; 
  }
  
  /* Tombol Navigasi */
  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 12px;
    cursor: pointer;
    z-index: 10;
    border-radius: 50%;
    font-size: 18px;
    line-height: 1;
  }
  
  .nav-btn.prev { left: 15px; }
  .nav-btn.next { right: 15px; }
  
  /* Indikator Dots */
  .dots-indicator {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 10;
  }
  
  .dots-indicator span {
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
  }
  
  .dots-indicator span.active {
      background-color: #f7961d;
      transform: scale(1.2);
  }
  
  /* --- INFO KUCING --- */
  .cat-info {
    max-width: 400px;
  }
  
  .price {
    margin-top: 15px;
    color: white;
    background-color: #f7961d;
    padding: 8px 12px;
    border-radius: 6px;
    display: inline-block;
  }
  
  .ajukanadopt-btn {
    display: block;
    width: fit-content;
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #ccc;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
  .ajukanadopt-btn:hover{
    background-color: #a56c54;
    color: white;
  }
  
  /* --- DESKRIPSI --- */
  .desc {
    margin: 40px 0; 
    max-width: 800px;
  }
  
  
  /* ================================================= */
  /* MEDIA QUERY UNTUK TABLET & SMARTPHONE (max-width: 992px) */
  /* ================================================= */
  @media (max-width: 992px) {
      /* Padding Container */
      .detail-container {
          padding: 20px 30px;
      }
      
      /* Mengubah tata letak detail-content menjadi satu kolom (bertumpuk) */
      .detail-content {
          flex-direction: column;
          align-items: center; 
          gap: 30px; 
      }
  
      /* Ukuran gambar kucing diperkecil di ponsel */
      .cat-photo {
          width: 100%; 
          max-width: 350px;
          height: 350px;
      }
      
      .cat-photo img {
          object-fit: contain;
      }
  
      .cat-info {
          max-width: 100%; 
          text-align: center;
      }
      
      .price {
          display: block;
          margin-left: auto;
          margin-right: auto;
          max-width: fit-content;
      }
  
      .desc {
          margin: 30px 0; 
          text-align: left;
      }
  }
  </style>