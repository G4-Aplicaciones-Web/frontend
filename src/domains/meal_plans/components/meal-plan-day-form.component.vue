<template>
  <form @submit.prevent="submit">
    <label>Receta ID: <input v-model="form.recipe_id" required type="number" /></label><br />
    <label>Día: <input v-model="form.day_number" required type="number" /></label><br />
    <label>Tipo:
      <select v-model="form.meal_plan_type_id" required>
        <option value="1">Desayuno</option>
        <option value="2">Almuerzo</option>
        <option value="3">Cena</option>
      </select>
    </label><br />
    <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { createMeal, updateMeal } from '../services/meal-plan-day.service';

const emit = defineEmits(['updated']);
const props = defineProps({
  editData: Object,
  mealPlanId: Number
});

const form = reactive({
  id: null,
  recipe_id: '',
  meal_plan_type_id: '',
  day_number: ''
});

watch(() => props.editData, (val) => {
  if (val) Object.assign(form, val);
});

const reset = () => {
  Object.assign(form, {
    id: null,
    recipe_id: '',
    meal_plan_type_id: '',
    day_number: ''
  });
};

const submit = async () => {
  const payload = { ...form, meal_plan_id: props.mealPlanId };
  form.id ? await updateMeal(payload) : await createMeal(payload);
  reset();
  emit('updated');
};
</script>