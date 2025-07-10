<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <footer class="mt-4 py-1 text-center">
    <div class="container">
      <p class="mb-1">
        Copyright &copy; {{ currentYear }}. NutriPlus
      </p>
      <p class="mb-0">
        {{ $t('authoring-phrase.intro') }} <i class="pi pi-heart"/>
        {{ $t('authoring-phrase.use') }}
        <a href="https://primevue.org/" target="_blank" class="text-secondary-300 hover:underline">PrimeVue</a>
        {{ $t('authoring-phrase.author', { brand: 'NutriPlus' }) }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.container {
  max-width: 1200px; /* Ancho máximo para el contenido */
  margin: 0 auto; /* Centra el contenedor horizontalmente */
  padding: 0 1rem; /* Espacio a los lados en pantallas pequeñas */
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-0 {
  margin-bottom: 0;
}

.hover\:underline:hover {
  text-decoration: underline;
}
</style>