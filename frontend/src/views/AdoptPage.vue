<template>
    <section class="adopt-header">
      <!-- SEARCH FIELD BESAR -->
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Search lokasi" v-model="pencarian" 
          class="search-input"
        />
      </div>
      
      <!-- BUTTON DI POJOK KANAN -->
      <button class="ajukan-btn" @click="$router.push({ name: 'AjukanKucing' })">
        Ajukan kucing untuk adopsi
      </button>
    </section>
  
    <main class="adopt-container">
      <h2>Adopsi Kucing</h2>
      <div class="cat-grid">
        <div
          v-for="kucing in filteredCats"
          :key="kucing.nama"
          class="cat-card"
        >
          <!-- GAMBAR SEPERTI CARD LAIN -->
          <div class="card-image">
            <img :src="kucing.galeri[0]" :alt="kucing.nama" />
          </div>
  
          <!-- DETAIL SEPERTI CARD LAIN -->
          <div class="card-details">
            <h4>{{ kucing.nama }}</h4>
            <p><strong>Usia</strong> : {{ kucing.umur }} bulan</p>
            <p><strong>Lokasi</strong> : {{ kucing.kota }}</p>
          </div>
  
          <button class="btn-selengkapnya" @click="lihatDetail(kucing)">
            Lihat detail
          </button>
        </div>
      </div>
    </main>
  </template>
 // AdoptPage.vue - Bagian <script>
export default {
    data() {
        return {
            pencarian: '',
            kucingList: [], // Data kucing kosong, akan diisi dari API
            isLoading: false,
            // Anda mungkin memiliki data 'filterJenisKelamin' dll. Biarkan tetap ada jika diperlukan
        };
    },
    computed: {
        // Fungsi ini tetap sama, hanya memfilter data yang sudah di-fetch
        filteredCats() {
            if (!this.pencarian) {
                return this.kucingList;
            }
            const term = this.pencarian.toLowerCase();
            return this.kucingList.filter(kucing =>
                kucing.kota.toLowerCase().includes(term) ||
                kucing.nama.toLowerCase().includes(term)
            );
        }
    },
    created() {
        this.fetchKucingList(); // Panggil fungsi saat komponen dibuat

    },
    methods: {
        async fetchKucingList() {
            this.isLoading = true;
            try {
                const response = await fetch('http://localhost:3001/api/kucing');
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari server');
                }
                const data = await response.json();
                
                // PENTING: Map data dari backend ke format yang diharapkan frontend
                this.kucingList = data.map(k => ({
                    id: k.id,
                    nama: k.nama_kucing,
                    jenisKelamin: k.jenis_kelamin,
                    warnaBulu: k.warna_bulu,
                    deskripsi: k.deskripsi,
                    alamatLengkap: k.alamat_lengkap,
                    biayaAdopsi: k.biaya_adopsi,

                    // Lokasi: gabungkan kecamatan/kabupaten/provinsi (fallback kalau ada salah satu)
      kota: (k.nama_kecamatan || k.nama_kabupaten_kota || k.nama_provinsi)
            ? `${k.nama_kecamatan ? k.nama_kecamatan + ', ' : ''}${k.nama_kabupaten_kota ? k.nama_kabupaten_kota + ', ' : ''}${k.nama_provinsi ? k.nama_provinsi : ''}`
            : "Tidak ada lokasi",
      lokasi: (k.nama_kecamatan || k.nama_kabupaten_kota || k.nama_provinsi)
            ? `${k.nama_kabupaten_kota || ""}, ${k.nama_provinsi || ""}`.replace(/^, |, $/g,'').trim()
            : "Tidak ada lokasi",
      galeri: k.url_gambar ? [`http://localhost:3001${k.url_gambar}`] : [],
                    
                    // Umur dan Biaya Adopsi mungkin tidak ada di tabel KUCING, 
                    // namun dibutuhkan untuk tampilan di kartu dan detail
                    umur: k.umur, 
                   // biaya: 500000, // Asumsi biaya default jika tidak ada
                    
                    // URL foto harus lengkap: http://localhost:3001/uploads/namafile.jpg
                    // Galeri dijadikan array agar AdoptDetail.vue bisa menggunakannya
                  //  lokasi: `${k.nama_kabupaten_kota}, ${k.nama_provinsi}`,

                   // galeri: [`http://localhost:3001${k.url_gambar}`], 
                    
                }));

            } catch (error) {
                console.error('Error saat mengambil daftar kucing:', error);
                alert('Gagal mengambil data kucing: ' + error.message);
            } finally {
                this.isLoading = false;
            }
        },
        // Fungsi ini mengirimkan data kucing yang sudah di-fetch ke AdoptDetail.vue
        lihatDetail(kucing) {
            this.$router.push({ 
                name: 'AdoptDetail',
                query: { 
                    id: kucing.id,
                    nama: kucing.nama,
               
                    // Mengirim semua data yang dibutuhkan AdoptDetail melalui query params
                    galeri: JSON.stringify(kucing.galeri), 
                    umur: kucing.umur,
                    warnaBulu: kucing.warnaBulu,
                    jenisKelamin: kucing.jenisKelamin,
                    deskripsi: kucing.deskripsi,
                    alamat: kucing.alamat,
                    biaya: kucing.biayaAdopsi,// Biaya adopsi yang akan digunakan di AjukanAdopsi.vue
                    alamatLengkap: kucing.alamatLengkap
                }
            });
        },
        // ... (metode lainnya)
    }
}
</script>
  
<style scoped>
/* CSS TIDAK BERUBAH (tetap sama seperti yang Anda punya) */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background-color: #f7c58f;
}

.adopt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 60px;
  background-color: #f7c58f;
  gap: 20px;
}

.search-container {
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  border-radius: 25px;
  border: 2px solid #ddd;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  border-color: #f7961d;
  box-shadow: 0 0 8px rgba(247, 150, 29, 0.3);
}

.ajukan-btn {
  background-color: #f7961d;
  border: none;
  padding: 15px 25px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ajukan-btn:hover {
  background-color: #e58a12;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* GRID KUCING */
.adopt-container {
  padding: 20px 60px;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-top: 20px;
}

/* CARD BARU - KONSISTEN DENGAN PAGE LAIN */
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

/* GAMBAR SEPERTI CARD LAIN */
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

/* DETAIL SEPERTI CARD LAIN */
.card-details {
  padding: 0 10px;
  color: var(--dark);
  font-size: 0.95rem;
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 15px;
}

.card-details h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.card-details p {
  margin-bottom: 8px;
  color: #444;
}

/* BUTTON SEPERTI CARD LAIN */
.btn-selengkapnya {
  display: block;
  text-align: center;
  padding: 12px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 0.95rem;
  background-color: #f7961d; /* Warna Primary */
}

.btn-selengkapnya:hover {
  background-color: #e07b20;
}

/* MEDIA QUERY UNTUK TABLET (Layar sampai 1024px) */
@media (max-width: 1024px) {
  .cat-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .adopt-container, .adopt-header {
    padding: 20px 30px;
  }
  
  .adopt-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-container {
    max-width: 100%;
  }
  
  .ajukan-btn {
    width: 100%;
    text-align: center;
  }
}

/* MEDIA QUERY UNTUK SMARTPHONE (Layar sampai 600px) */
@media (max-width: 600px) {
  .cat-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .adopt-header {
    padding: 15px 20px;
  }
}
</style> 
