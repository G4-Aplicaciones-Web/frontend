<template>
  <div>
    <h3 class="text-lg font-semibold mb-2">Tu Información Física</h3>

    <form @submit.prevent="saveProfile" class="p-fluid">
      <div class="field">
        <label for="gender">Género</label>
        <pv-dropdown v-model="form.gender" :options="genderOptions" option-label="label" option-value="value" />
      </div>

      <div class="field">
        <label for="height">Altura (cm)</label>
        <pv-input-number v-model="form.height" inputId="height" :min="0" />
      </div>

      <div class="field">
        <label for="weight">Peso (kg)</label>
        <pv-input-number v-model="form.weight" inputId="weight" :min="0" />
      </div>

      <div class="field">
        <label for="activityLevel">Nivel de Actividad</label>
        <pv-dropdown
            v-model="form.activityLevelId"
            :options="activityLevels"
            option-label="name"
            option-value="id"
        />
      </div>

      <div class="field">
        <label for="objective">Objetivo</label>
        <pv-dropdown
            v-model="form.objectiveId"
            :options="objectives"
            option-label="name"
            option-value="id"
        />
      </div>

      <pv-button type="submit" label="Guardar" class="mt-3 w-full" />
    </form>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch } from 'vue';
import { ProfileService } from '@/domains/profiles/services/profile.service.js';

const props = defineProps({
  profile: { type: Object, required: true },
  objectives: { type: Array, required: true },
  activityLevels: { type: Array, required: true }
});

const emit = defineEmits(['saved']);
const profileService = new ProfileService();

const genderOptions = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' },
  { label: 'Otro', value: 'Otro' }
];

const form = reactive({
  id: null,
  gender: '',
  height: 0,
  weight: 0,
  activityLevelId: null,
  objectiveId: null
});

// Prellenar formulario al recibir datos
watch(() => props.profile, (newProfile) => {
  if (!newProfile) return;
  form.id = newProfile.id;
  form.gender = newProfile.gender || '';
  form.height = newProfile.height || 0;
  form.weight = newProfile.weight || 0;
  form.activityLevelId = newProfile.activityLevelId || null;
  form.objectiveId = newProfile.objectiveId || null;
}, { immediate: true });

const saveProfile = async () => {
  const payload = {
    gender: form.gender,
    height: form.height,
    weight: form.weight,
    activityLevelId: form.activityLevelId,
    objectiveId: form.objectiveId
  };

  try {
    if (form.id) {
      await profileService.update(form.id, payload);
    } else {
      await profileService.create(payload);
    }
    emit('saved');
  } catch (error) {
    console.error('Error al guardar perfil:', error);
  }
};
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}
</style>
