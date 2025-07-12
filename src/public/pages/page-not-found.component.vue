<script>
export default {
  name: "page-not-found",
  data() {
    return {
      unavailableRoute: null,
    }
  },
  created() {
    this.unavailableRoute = this.$route.path;
  }
}
</script>

<template>
  <div class="not-found-container">
    <div class="card">
      <h1>{{ $t('notFound.title') }}</h1>
      <p class="route">
        {{ $t('notFound.message') }}
        <code>{{ unavailableRoute }}</code>
      </p>
      <router-link class="home-link" to="/home">
        {{ $t('notFound.goHome') }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  background-color: #f9fafb;
  padding: 1rem;
}

.card {
  text-align: center;
  padding: 3rem 2rem;
  background: #e2ffea;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.card h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.card .route {
  color: #555;
  margin-bottom: 2rem;
}

.card .route code {
  background-color: #eee;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.home-link {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.home-link:hover {
  background-color: var(--primary-color-hover);
}
</style>
