<template>
  <div class="p-6 max-w-3xl mx-auto">


    <MealPlanDays v-if="mealPlanId" :mealPlanId="mealPlanId" />
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import MealPlanDays from '../components/meal-plan-day.component.vue';
import axios from 'axios';

const route = useRoute();
const mealPlanId = 1;
const mealPlan = ref(null);

const fetchMealPlan = async () => {
  const res = await axios.get(`https://alimentate-plus-api.onrender.com/meal_plans/${mealPlanId.value}`);
  mealPlan.value = res.data;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(fetchMealPlan);
</script>

<style scoped>
/* Puedes añadir estilos personalizados aquí si no estás usando Tailwind */
</style>