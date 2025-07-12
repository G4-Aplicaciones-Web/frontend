<template>
  <pv-card>
    <template #title>
      Perfil de Usuario
    </template>
    <template #content>
      <form @submit.prevent="saveProfile">
        <div class="formgrid grid">
          <!-- Nombre -->
          <div class="field col-12 md:col-6">
            <label for="firstName">Nombre *</label>
            <pv-inputtext
                id="firstName"
                v-model="localProfile.firstName"
                :class="{ 'p-invalid': errors.firstName }"
                placeholder="Ingresa tu nombre"
                class="w-full"
            />
            <small v-if="errors.firstName" class="p-error">{{ errors.firstName }}</small>
          </div>

          <!-- Apellido -->
          <div class="field col-12 md:col-6">
            <label for="lastName">Apellido *</label>
            <pv-inputtext
                id="lastName"
                v-model="localProfile.lastName"
                :class="{ 'p-invalid': errors.lastName }"
                placeholder="Ingresa tu apellido"
                class="w-full"
            />
            <small v-if="errors.lastName" class="p-error">{{ errors.lastName }}</small>
          </div>

          <!-- Género -->
          <div class="field col-12 md:col-6">
            <label for="gender">Género *</label>
            <pv-dropdown
                id="gender"
                v-model="localProfile.gender"
                :options="genderOptions"
                option-label="label"
                option-value="value"
                placeholder="Selecciona tu género"
                class="w-full"
                :class="{ 'p-invalid': errors.gender }"
            />
            <small v-if="errors.gender" class="p-error">{{ errors.gender }}</small>
          </div>

          <!-- Peso -->
          <div class="field col-12 md:col-6">
            <label for="weight">Peso (kg) *</label>
            <pv-inputnumber
                id="weight"
                v-model="localProfile.weight"
                :class="{ 'p-invalid': errors.weight }"
                placeholder="Ingresa tu peso"
                class="w-full"
                :min="20"
                :max="300"
                :step="0.1"
                suffix=" kg"
            />
            <small v-if="errors.weight" class="p-error">{{ errors.weight }}</small>
          </div>

          <!-- Altura -->
          <div class="field col-12 md:col-6">
            <label for="height">Altura (cm) *</label>
            <pv-inputnumber
                id="height"
                v-model="localProfile.height"
                :class="{ 'p-invalid': errors.height }"
                placeholder="Ingresa tu altura"
                class="w-full"
                :min="100"
                :max="250"
                suffix=" cm"
            />
            <small v-if="errors.height" class="p-error">{{ errors.height }}</small>
          </div>

          <!-- Objetivo -->
          <div class="field col-12 md:col-6">
            <label for="objective">Objetivo *</label>
            <pv-dropdown
                id="objective"
                v-model="localProfile.objectiveId"
                :options="objectives"
                option-label="name"
                option-value="id"
                placeholder="Selecciona tu objetivo"
                class="w-full"
                :class="{ 'p-invalid': errors.objectiveId }"
            />
            <small v-if="errors.objectiveId" class="p-error">{{ errors.objectiveId }}</small>
          </div>

          <!-- Nivel de Actividad -->
          <div class="field col-12 md:col-6">
            <label for="activityLevel">Nivel de Actividad *</label>
            <pv-dropdown
                id="activityLevel"
                v-model="localProfile.activityLevelId"
                :options="activityLevels"
                option-label="name"
                option-value="id"
                placeholder="Selecciona tu nivel de actividad"
                class="w-full"
                :class="{ 'p-invalid': errors.activityLevelId }"
            />
            <small v-if="errors.activityLevelId" class="p-error">{{ errors.activityLevelId }}</small>
          </div>

          <!-- Botones -->
          <div class="field col-12">
            <div class="flex justify-content-end gap-2">
              <pv-button
                  type="button"
                  label="Debug"
                  severity="info"
                  @click="debugForm"
                  style="margin-right: auto;"
              />
              <pv-button
                  type="button"
                  label="Cancelar"
                  severity="secondary"
                  @click="resetForm"
              />
              <pv-button
                  type="submit"
                  label="Guardar Perfil"
                  :loading="loading"
                  :disabled="!isFormValid"
              />
            </div>
          </div>
        </div>
      </form>
    </template>
  </pv-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { ProfileService } from '@/domains/profiles/services/profile.service.js';
import { useAuthenticationStore } from '@/domains/iam/services/authentication.store.js';

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({})
  },
  objectives: {
    type: Array,
    default: () => []
  },
  activityLevels: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['saved']);

const toast = useToast();
const profileService = new ProfileService();
const authStore = useAuthenticationStore();

const loading = ref(false);
const errors = ref({});

const localProfile = ref({
  firstName: '',
  lastName: '',
  gender: '',
  weight: null,
  height: null,
  objectiveId: null,
  activityLevelId: null
});

const genderOptions = [
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' },
  { label: 'Otro', value: 'other' }
];

// Computed para validar el formulario
const isFormValid = computed(() => {
  return localProfile.value.firstName &&
      localProfile.value.lastName &&
      localProfile.value.gender &&
      localProfile.value.weight &&
      localProfile.value.height &&
      localProfile.value.objectiveId &&
      localProfile.value.activityLevelId;
});

// Watcher para sincronizar con el prop profile
watch(() => props.profile, (newProfile) => {
  if (newProfile && Object.keys(newProfile).length > 0) {
    localProfile.value = {
      ...newProfile
    };
  }
}, { immediate: true });

// Función para validar campos
const validateField = (field, value) => {
  switch (field) {
    case 'firstName':
    case 'lastName':
      return value ? '' : 'Este campo es requerido';
    case 'gender':
      return value ? '' : 'El género es requerido';
    case 'weight':
      return value && value >= 20 && value <= 300 ? '' : 'El peso debe estar entre 20 y 300 kg';
    case 'height':
      return value && value >= 100 && value <= 250 ? '' : 'La altura debe estar entre 100 y 250 cm';
    case 'objectiveId':
      return value ? '' : 'El objetivo es requerido';
    case 'activityLevelId':
      return value ? '' : 'El nivel de actividad es requerido';
    default:
      return '';
  }
};

// Función para validar todo el formulario
const validateForm = () => {
  const newErrors = {};

  Object.keys(localProfile.value).forEach(field => {
    const error = validateField(field, localProfile.value[field]);
    if (error) {
      newErrors[field] = error;
    }
  });

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// Función para guardar el perfil
const saveProfile = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Error de validación',
      detail: 'Por favor, completa todos los campos requeridos',
      life: 5000
    });
    return;
  }

  loading.value = true;

  try {
    const profileData = {
      ...localProfile.value,
      userId: authStore.currentUserId
    };

    console.log('Datos a enviar:', profileData);
    console.log('¿Existe perfil?', props.profile && props.profile.id);

    let result;
    if (props.profile && props.profile.id) {
      // Actualizar perfil existente
      console.log('Actualizando perfil con ID:', props.profile.id);
      result = await profileService.update(props.profile.id, profileData);
    } else {
      // Crear nuevo perfil
      console.log('Creando nuevo perfil...');
      result = await profileService.create(profileData);

      // ✅ Aquí ya es el objeto, NO necesitas `.data`
      if (result && result.id) {
        localStorage.setItem('profileId', result.id.toString());
        console.log('ProfileId guardado en localStorage:', result.id);
      }
    }

    console.log('Resultado:', result);

    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Perfil guardado correctamente',
      life: 3000
    });

    emit('saved', result);

  } catch (error) {
    console.error('Error completo:', error);
    console.error('Response:', error.response?.data);
    console.error('Status:', error.response?.status);

    let errorMessage = 'No se pudo guardar el perfil. Inténtalo de nuevo.';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

// Función para resetear el formulario
const resetForm = () => {
  if (props.profile && Object.keys(props.profile).length > 0) {
    localProfile.value = {
      ...props.profile
    };
  } else {
    localProfile.value = {
      firstName: '',
      lastName: '',
      gender: '',
      weight: null,
      height: null,
      objectiveId: null,
      activityLevelId: null
    };
  }
  errors.value = {};
};

// Función de debug temporal
const debugForm = () => {
  console.log('=== DEBUG FORM ===');
  console.log('localProfile:', localProfile.value);
  console.log('props.profile:', props.profile);
  console.log('props.objectives:', props.objectives);
  console.log('props.activityLevels:', props.activityLevels);
  console.log('isFormValid:', isFormValid.value);
  console.log('errors:', errors.value);
  console.log('userId:', authStore.currentUserId);
  console.log('profileId en localStorage:', localStorage.getItem('profileId'));
  console.log('==================');
};

// Función para obtener profileId del localStorage
const getProfileIdFromStorage = () => {
  return localStorage.getItem('profileId');
};

// Función para limpiar profileId del localStorage (si es necesario)
const clearProfileIdFromStorage = () => {
  localStorage.removeItem('profileId');
  console.log('ProfileId eliminado del localStorage');
};

onMounted(() => {
  resetForm();
});
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.p-error {
  color: #e24c4c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.p-invalid {
  border-color: #e24c4c;
}
</style>