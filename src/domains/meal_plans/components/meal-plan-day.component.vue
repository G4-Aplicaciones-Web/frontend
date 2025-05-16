<template>
  <div>
    <h3>🍽️ Comidas del plan</h3>
    <ul v-if="meals.length">
      <li v-for="meal in meals" :key="meal.id">
        Día {{ meal.day_number }} - {{ getMealType(meal.meal_plan_type_id) }}: Receta #{{ meal.recipe_id }}
        <button @click="edit(meal)">Editar</button>
        <button @click="remove(meal.id)">Eliminar</button>
      </li>
    </ul>
    <MealPlanDayForm :editData="selected" :mealPlanId="mealPlanId" @updated="loadMeals" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAllByMealPlanId, removeMeal } from '../services/meal-plan-day.service';
import MealPlanDayForm from './meal-plan-day-form.component.vue';

const props = defineProps({ mealPlanId: Number });
const meals = ref([]);
const selected = ref(null);

const loadMeals = async () => {
  if (props.mealPlanId) {
    meals.value = await getAllByMealPlanId(props.mealPlanId);
  }
};

const remove = async (id) => {
  await removeMeal(id);
  loadMeals();
};

const edit = (data) => {
  selected.value = { ...data };
};

watch(() => props.mealPlanId, loadMeals);
onMounted(loadMeals);

const getMealType = (id) =>
    ({ 1: 'Desayuno', 2: 'Almuerzo', 3: 'Cena' }[id] || 'Desconocido');
</script>