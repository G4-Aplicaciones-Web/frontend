<script>

export default {
  name: 'NutritionApp',
  components: {},
  data() {
    return {
      drawer: false,
      items: [
        {label: 'option.home', to: '/'},
        {label: 'option.recommendations', to: '/nutrition/recommendations'},
        {label: 'option.sign-in', to: '/sign-in'}
      ]
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    }
  }
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="flex flex-column justify-content-between">
    <header>
      <pv-toolbar class="bg-primary">
        <template #start>
          <pv-button class="p-button-text" icon="pi pi-bars" @click="toggleDrawer"/>
          <h3>Nutrition Recommendation System</h3>
        </template>
        <template #center>
          <div class="flex-column">
            <pv-button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
              <router-link :to="item.to" :class="slotProps['class']">{{ $t(item.label) }}</router-link>
            </pv-button>
          </div>
        </template>
        <template #end>

        </template>
      </pv-toolbar>
      <pv-drawer v-model:visible="drawer"/>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<style scoped>
/* General container styling */
.recommendation-system {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

/* Header/navigation styling */
.header {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

/* Main content area */
.main-content {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Management controls */
.management-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

/* Recommendation table */
.recommendation-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.recommendation-table th,
.recommendation-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.recommendation-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

/* Pagination controls */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #f2f2f2;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .header {
    flex-direction: column;
    gap: 15px;
  }

  .management-controls {
    flex-direction: column;
    gap: 10px;
  }

  .recommendation-table {
    font-size: 14px;
  }
}
</style>