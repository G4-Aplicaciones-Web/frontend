<template>

</template>

<script setup>
import { reactive, watch } from 'vue';
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
  if (!newProfile) {
    return;
  }

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
      const newProfile = await profileService.create(payload);
      if (newProfile && newProfile.id) {
        form.id = newProfile.id;
      }
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