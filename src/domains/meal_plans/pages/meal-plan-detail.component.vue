<template>
  <div>
    <!-- Detalles del meal plan -->
    <MealPlanDay :mealPlanId="mealPlanId" />
  </div>
</template>

<script setup>
import MealPlanDay from '../components/meal-plan-day.component.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const mealPlanId = parseInt(route.params.id);
console.log(mealPlanId);
</script>