<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">📝 {{ mealPlan?.description }}</h2>
      <div class="grid grid-cols-2 gap-4 text-gray-700">
        <div><strong>📅 Fecha de creación:</strong> {{ formatDate(mealPlan?.created_at) }}</div>
        <div><strong>🔥 Calorías:</strong> {{ mealPlan?.total_calories }} kcal</div>
        <div><strong>🍞 Carbohidratos:</strong> {{ mealPlan?.total_carbs }} g</div>
        <div><strong>🍗 Proteínas:</strong> {{ mealPlan?.total_proteins }} g</div>
        <div><strong>🥑 Grasas:</strong> {{ mealPlan?.total_fats }} g</div>
        <div><strong>📊 Puntuación:</strong> {{ mealPlan?.min_score }} - {{ mealPlan?.max_score }}</div>
      </div>
    </div>

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