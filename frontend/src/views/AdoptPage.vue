<template>
    <section class="adopt-header">
      <!-- SEARCH FIELD BESAR -->
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Search lokasi..." 
          v-model="pencarian" 
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
            <p><strong>Umur</strong> : {{ kucing.umur }}</p>
            <p><strong>Lokasi</strong> : {{ kucing.kota }}</p>
            <p><strong>Jenis Kelamin</strong> : {{ kucing.jenisKelamin }}</p>
          </div>
  
          <button class="btn-selengkapnya" @click="lihatDetail(kucing)">
            Lihat detail
          </button>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  export default {
    name: "AdoptPage",
    data() {
      return {
        pencarian: "",
        kucingList: [
          {
            nama: "Molly",
            umur: "7 bulan",
            kota: "Bandung",
            warnaBulu: "Orange",
            jenisKelamin: "Jantan",
            alamat: "jalan setiabudi", 
            sudahSteril: true,
            biayaAdopsi: "Rp200.000,00",
            deskripsi: "Molly adalah kucing jinak yang suka tidur di tempat hangat dan mudah beradaptasi dengan orang baru.",
            galeri:[
               new URL("/src/assets/molly.png", import.meta.url).href,
               new URL("/src/assets/molly.png", import.meta.url).href,
               new URL("/src/assets/molly.png", import.meta.url).href,
            ]
          },
          {
            nama: "Ciyo",
            umur: "6 bulan",
            kota: "Medan",
            warnaBulu: "Putih Abu",
            jenisKelamin: "Betina",
            alamat: "jalan setiabudi", 
            sudahSteril: false,
            biayaAdopsi: "Rp150.000,00",
            deskripsi: "Ciyo aktif dan suka bermain bola kecil, cocok untuk keluarga dengan anak kecil.",
            galeri:[
               new URL("/assets/ciyo.png", import.meta.url).href,
               new URL("/assets/ciyo.png", import.meta.url).href,
               new URL("/assets/ciyo.png", import.meta.url).href,
            ]
          },
          {
            nama: "Miko",
            umur: "6 bulan",
            kota: "Bandung",
            warnaBulu: "Hitam Putih",
            jenisKelamin: "Jantan",
            alamat: "jalan setiabudi", 
            sudahSteril: true,
            biayaAdopsi: "Rp180.000,00",
            deskripsi: "Miko lucu dan manja, suka duduk di pangkuan.",
            galeri:[
               new URL("/src/assets/miko.png", import.meta.url).href,
               new URL("/src/assets/miko.png", import.meta.url).href,
               new URL("/src/assets/miko.png", import.meta.url).href,
            ]
          },
          {
            nama: "Loly",
            umur: "6 bulan",
            kota: "Cianjur",
            warnaBulu: "Abu-abu",
            jenisKelamin: "Betina",
            alamat: "jalan setiabudi", 
            sudahSteril: false,
            biayaAdopsi: "Rp150.000,00",
            deskripsi: "Loly lembut dan penurut, sangat cocok untuk kamu yang ingin peliharaan tenang.",
            galeri:[
              new URL("/src/assets/loly.png", import.meta.url).href,
              new URL("/src/assets/loly.png", import.meta.url).href,
              new URL("/src/assets/loly.png", import.meta.url).href,
            ] 
          },
          {
            nama: "Telon",
            umur: "5 bulan",
            kota: "Jakarta",
            warnaBulu: "Coklat Muda",
            jenisKelamin: "Jantan",
            alamat: "jalan setiabudi", 
            sudahSteril: false,
            biayaAdopsi: "Rp120.000,00",
            deskripsi: "Telon suka bermain dan mudah akrab dengan kucing lain.",
            galeri:[
              new URL("/src/assets/telon.png", import.meta.url).href,
              new URL("/src/assets/telon.png", import.meta.url).href,
              new URL("/src/assets/telon.png", import.meta.url).href,
            ] 
          },
          {
            nama: "Miow",
            umur: "5 bulan",
            kota: "Jakarta",
            warnaBulu: "Coklat Muda",
            jenisKelamin: "Jantan",
            alamat: "jalan setiabudi", 
            sudahSteril: false,
            biayaAdopsi: "Rp120.000,00",
            deskripsi: "Miow suka bermain dan mudah akrab dengan kucing lain.",
            galeri:[
               new URL("/src/assets/miow.png", import.meta.url).href,
               new URL("/src/assets/miow.png", import.meta.url).href,
               new URL("/src/assets/miow.png", import.meta.url).href,
            ]
          },
          {
            nama: "Cilow",
            umur: "5 bulan",
            kota: "Jakarta",
            warnaBulu: "Coklat Muda",
            jenisKelamin: "Jantan",
            alamat: "jalan setiabudi", 
            sudahSteril: false,
            biayaAdopsi: "Rp120.000,00",
            deskripsi: "Cilow suka bermain dan mudah akrab dengan kucing lain.",
            galeri:[
              new URL("/src/assets/cilow.png", import.meta.url).href,
              new URL("/src/assets/cilow.png", import.meta.url).href,
              new URL("/src/assets/cilow.png", import.meta.url).href,
            ] 
          },
          {
            nama: "Bubul",
            umur: "7 bulan",
            kota: "Bandung",
            warnaBulu: "Hitam",
            jenisKelamin: "Betina",
            alamat: "jalan setiabudi", 
            sudahSteril: true,
            biayaAdopsi: "Rp200.000,00",
            deskripsi: "Bubul cerdas dan mudah dilatih, cocok untuk lingkungan apartemen.",
            galeri:[
              new URL("/src/assets/bubul.png", import.meta.url).href,
              new URL("/src/assets/bubul.png", import.meta.url).href,
              new URL("/src/assets/bubul.png", import.meta.url).href,
            ] 
          },
        ],
      };
    },
    computed: {
      filteredCats() {
        return this.kucingList.filter((kucing) =>
          kucing.kota.toLowerCase().includes(this.pencarian.toLowerCase())
        );
      },
    },
    methods: {
      lihatDetail(kucing) {
        this.$router.push({
          name: "AdoptDetail",
          params: { nama: kucing.nama },
          query: {
            umur: kucing.umur,
            kota: kucing.kota,
            warnaBulu: kucing.warnaBulu,
            jenisKelamin: kucing.jenisKelamin,
            alamat: "jalan setiabudi", 
            sudahSteril: kucing.sudahSteril,
            biayaAdopsi: kucing.biayaAdopsi,
            deskripsi: kucing.deskripsi,
            galeri: JSON.stringify(kucing.galeri),
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
  }
  
  body {
    background-color: #f7c58f;
  }
  
  /* HEADER BARU - SEARCH BESAR & BUTTON DI KANAN */
  .adopt-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 60px;
    background-color: #f7c58f;
    gap: 20px;
  }
  
  /* CONTAINER SEARCH BIAR LEBIH BESAR */
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
  
  /* BUTTON AJUKAN DI POJOK KANAN */
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
    background-color: var(--primary);
    color: white;
    font-weight: 600;
    text-decoration: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
    font-size: 0.95rem;
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
