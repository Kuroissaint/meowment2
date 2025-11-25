<template>
  <section class="hero">
    <img :src="heroImage" alt="Hero Image" class="hero-image-full" />
    <div class="overlay"></div>

    <div class="content">
      <h1>Selamatkan, Adopsi, Sayangi</h1>
      <p>Bersama kita bisa membuat dunia lebih ramah bagi kucing.</p>
      <button>Mulai Sekarang</button>
    </div>
  </section>
</template>

<script setup>
// Perbaikan: Import statis aset
import heroImage from '../assets/hero6.jpg'
</script>

<style scoped>
.hero {
  position: relative; 
  height: 90vh; 
  display: flex;
  align-items: center;
  padding: 0 6rem;
  color: beige;
  overflow: hidden;
  background-color: var(--browny); 
}

.hero-image-full {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.content {
  z-index: 3;
  max-width: 500px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

button {
  background-color: var(--primary);
  color: beige;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
</style>