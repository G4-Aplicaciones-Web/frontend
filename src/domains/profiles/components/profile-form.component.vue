<!-- profile-form.component.vue -->
<template>
  <pv-card class="profile-card">
    <template #title>
      <div class="card-title">
        <i class="pi pi-user profile-icon"></i>
        Perfil de Usuario
      </div>
    </template>
    <template #content>
      <form @submit.prevent="saveProfile" class="profile-form">
        <div class="formgrid grid">
          <!-- Nombre -->
          <div class="field col-12 md:col-6">
            <label for="firstName" class="field-label">
              <i class="pi pi-user"></i>
              Nombre *
            </label>
            <pv-inputtext
                id="firstName"
                v-model="localProfile.firstName"
                :class="{ 'p-invalid': errors.firstName }"
                placeholder="Ingresa tu nombre"
                class="w-full modern-input"
            />
            <small v-if="errors.firstName" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errors.firstName }}
            </small>
          </div>

          <!-- Apellido -->
          <div class="field col-12 md:col-6">
            <label for="lastName" class="field-label">
              <i class="pi pi-user"></i>
              Apellido *
            </label>
            <pv-inputtext
                id="lastName"
                v-model="localProfile.lastName"
                :class="{ 'p-invalid': errors.lastName }"
                placeholder="Ingresa tu apellido"
                class="w-full modern-input"
            />
            <small v-if="errors.lastName" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errors.lastName }}
            </small>
          </div>

          <!-- Género -->
          <div class="field col-12 md:col-6">
            <label for="gender" class="field-label">
              <i class="pi pi-users"></i>
              Género *
            </label>
            <pv-dropdown
                id="gender"
                v-model="localProfile.gender"
                :options="genderOptions"
                option-label="label"
                option-value="value"
                placeholder="Selecciona tu género"
                class="w-full modern-dropdown"
                :class="{ 'p-invalid': errors.gender }"
            />
            <small v-if="errors.gender" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errors.gender }}
            </small>
          </div>

          <!-- Peso -->
          <div class="field col-12 md:col-6">
            <label for="weight" class="field-label">
              <i class="pi pi-chart-line"></i>
              Peso (kg) *
            </label>
            <pv-inputnumber
                id="weight"
                v-model="localProfile.weight"
                :class="{ 'p-invalid': errors.weight }"
                placeholder="Ingresa tu peso"
                class="w-full modern-input"
                :min="20"
                :max="300"
                :step="0.1"
                suffix=" kg"
            />
            <small v-if="errors.weight" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errors.weight }}
            </small>
          </div>

          <!-- Altura -->
          <div class="field col-12 md:col-6">
            <label for="height" class="field-label">
              <i class="pi pi-arrows-v"></i>
              Altura (cm) *
            </label>
            <pv-inputnumber
                id="height"
                v-model="localProfile.height"
                :class="{ 'p-invalid': errors.height }"
                placeholder="Ingresa tu altura"
                class="w-full modern-input"
                :min="100"
                :max="250"
                suffix=" cm"
            />
            <small v-if="errors.height" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errors.height }}
            </small>
          </div>

          <!-- Objetivo -->
          <div class="field col-12 md:col-6">
            <label for="objective" class="field-label">
              <i class="pi pi-flag"></i>
              Objetivo *
            </label>
            <pv-dropdown
                id="objective"
                v-model="localProfile.objectiveId"
                :options="objectives"
                option-label="name"
                option-value="id"
                placeholder="Selecciona tu objetivo"
                class="w-full modern-dropdown"
                :class="{ 'p-invalid': errors.objectiveId }"
            />
            <small v-if="errors.objectiveId" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errors.objectiveId }}
            </small>
          </div>

          <!-- Nivel de Actividad -->
          <div class="field col-12 md:col-6">
            <label for="activityLevel" class="field-label">
              <i class="pi pi-bolt"></i>
              Nivel de Actividad *
            </label>
            <pv-dropdown
                id="activityLevel"
                v-model="localProfile.activityLevelId"
                :options="activityLevels"
                option-label="name"
                option-value="id"
                placeholder="Selecciona tu nivel de actividad"
                class="w-full modern-dropdown"
                :class="{ 'p-invalid': errors.activityLevelId }"
            />
            <small v-if="errors.activityLevelId" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errors.activityLevelId }}
            </small>
          </div>

          <!-- Botones -->
          <div class="field col-12">
            <div class="action-buttons">

              <div class="main-actions">
                <pv-button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="resetForm"
                    class="cancel-btn"
                    icon="pi pi-times"
                />
                <pv-button
                    type="submit"
                    label="Guardar Perfil"
                    :loading="loading"
                    :disabled="!isFormValid"
                    class="save-btn"
                    icon="pi pi-check"
                />
              </div>
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
/* Variables CSS personalizadas - Colores actualizados */
.profile-card {
  --primary-color: #63B663;
  --primary-color-hover: #45A049;
  --text-color: #333333;
  --text-color-light: #666666;
  --background-color: #ffffff;
  --background-color-alt: #f5f7fa;
  --border-color: #e0e0e0;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  --border-radius: 16px;
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Estilos de la tarjeta principal */
.profile-card {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: var(--transition);
  overflow: hidden;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
}

/* Título de la tarjeta */
.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #63B663;
  margin: 0;
}

.profile-icon {
  font-size: 1.8rem;
  color: #63B663;
}

/* Formulario */
.profile-form {
  padding: 1rem 0;
}

/* Campos del formulario */
.field {
  margin-bottom: 1.5rem;
  position: relative;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333333;
  font-size: 0.95rem;
}

.field-label i {
  color: #63B663;
  font-size: 1rem;
}

/* Inputs modernos */
.modern-input,
.modern-dropdown {
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  padding: 12px 16px;
  font-size: 1rem;
  transition: var(--transition);
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.modern-input:focus,
.modern-dropdown:focus,
.modern-input:focus-within,
.modern-dropdown:focus-within {
  border-color: #63B663;
  box-shadow: 0 0 0 3px rgba(99, 182, 99, 0.1);
  outline: none;
}

.modern-input:hover,
.modern-dropdown:hover {
  border-color: #9ca3af;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Estados de error */
.p-invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Botones de acción */
.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.main-actions {
  display: flex;
  gap: 1rem;
}

.debug-btn,
.cancel-btn,
.save-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: var(--transition);
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.debug-btn {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.debug-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.cancel-btn {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #333333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
}

.save-btn {
  background: linear-gradient(135deg, #63B663 0%, #45A049 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 182, 99, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 182, 99, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .main-actions {
    width: 100%;
    justify-content: center;
  }

  .debug-btn {
    align-self: flex-start;
  }

  .modern-input,
  .modern-dropdown {
    padding: 14px 16px;
    font-size: 16px; /* Previene zoom en iOS */
  }
}

/* Animaciones adicionales */
.field {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.field:nth-child(1) { animation-delay: 0.1s; }
.field:nth-child(2) { animation-delay: 0.2s; }
.field:nth-child(3) { animation-delay: 0.3s; }
.field:nth-child(4) { animation-delay: 0.4s; }
.field:nth-child(5) { animation-delay: 0.5s; }
.field:nth-child(6) { animation-delay: 0.6s; }
.field:nth-child(7) { animation-delay: 0.7s; }
.field:nth-child(8) { animation-delay: 0.8s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para el modo oscuro */
@media (prefers-color-scheme: dark) {
  .profile-card {
    background: linear-gradient(145deg, #242424, #1a1a1a);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .field-label {
    color: #63B663;
  }

  .modern-input,
  .modern-dropdown {
    background: #2a2a2a;
    border-color: #414141;
    color: rgba(255, 255, 255, 0.87);
  }

  .modern-input:focus,
  .modern-dropdown:focus {
    border-color: #63B663;
  }

  .cancel-btn {
    color: rgba(255, 255, 255, 0.87);
  }
}
</style>