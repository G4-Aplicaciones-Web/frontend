<script>
export default {
  name: "about",
  title: "About Us",
}
</script>

<template>
  <div class="about-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('about.title') }}</h1>
        <div class="hero-decoration"></div>
      </div>
    </div>

    <div class="content-container">
      <section class="mission-section">
        <div class="section-icon">🎯</div>
        <h2 class="section-title">{{ $t('about.mission-title') }}</h2>
        <p class="section-text">
          {{ $t('about.mission') }}
        </p>
      </section>

      <section class="vision-section">
        <div class="section-icon">🌟</div>
        <h2 class="section-title">{{ $t('about.vision-title') }}</h2>
        <p class="section-text">
          {{ $t('about.vision') }}
        </p>
      </section>

      <section class="product-section">
        <div class="section-icon">🍎</div>
        <h2 class="section-title">Alimentate+</h2>
        <p class="section-text">
          {{ $t('about.description') }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #4CAF50 0%, #81C784 50%, #A5D6A7 100%);
}

.hero-section {
  padding: 80px 20px 60px;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #ffffff, #f1f8e9);
  margin: 0 auto;
  border-radius: 2px;
}

.content-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  gap: 40px;
}

section {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.2);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 2px solid #E8F5E8;
}

section:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
}

.section-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2E7D32;
  margin: 0 0 20px;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4A4A4A;
  margin: 0;
  text-align: justify;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .content-container {
    padding: 20px 15px;
  }
  
  section {
    padding: 30px 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>