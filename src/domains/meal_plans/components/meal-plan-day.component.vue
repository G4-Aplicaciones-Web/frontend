<template>
  <div>
    <h3>🍽️ Comidas del Plan</h3>
    <MealPlanDayList :meals="meals" @edit="edit" @remove="removeMeal" />
    <MealPlanDayForm :editData="selected" :mealPlanId="mealPlanId" @updated="loadMeals" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAllByMealPlanId, removeMeal as deleteMeal  } from '../services/meal-plan-day.service';
import MealPlanDayForm from './meal-plan-day-form.component.vue';
import MealPlanDayList from './meal-plan-day-list.component.vue';

const props = defineProps({ mealPlanId: Number });
const meals = ref([]);
const selected = ref(null);

const loadMeals = async () => {
  if (props.mealPlanId) {
    meals.value = await getAllByMealPlanId(props.mealPlanId);
  }
};

const edit = (data) => {
  selected.value = { ...data };
};

const removeMeal = async (id) => {
  await deleteMeal(id);
  loadMeals();
};

watch(() => props.mealPlanId, loadMeals, { immediate: true });
</script>
