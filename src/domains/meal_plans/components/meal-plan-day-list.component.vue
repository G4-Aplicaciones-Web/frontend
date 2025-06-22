<template>
  <ul v-if="meals.length">
    <li v-for="meal in meals" :key="meal.id">
      Día {{ meal.day_number }} - {{ getMealType(meal.meal_plan_type_id) }}: Receta #{{ meal.recipe_id }}
      <button @click="$emit('edit', meal)">Editar</button>
      <button @click="$emit('remove', meal.id)">Eliminar</button>
    </li>
  </ul>
  <p v-else>No hay comidas aún.</p>
</template>

<script setup>
const props = defineProps({ meals: Array });

const getMealType = (id) =>
    ({ 1: 'Desayuno', 2: 'Almuerzo', 3: 'Cena' }[id] || 'Desconocido');
</script>
