<template>
  <div class="profile-management p-4">
    <h2 class="text-primary">Bienvenido, {{ username }}!</h2>

    <div class="grid mt-4">
      <div class="col-12 md:col-4">
        <pv-card>
          <template #title>
            Información de Registro
          </template>
          <template #content>
            <p>Aquí puedes ver tu información general de usuario.</p>
            <p><strong>Usuario:</strong> {{ username }}</p>
          </template>
        </pv-card>
      </div>

      <div class="col-12 md:col-8">
        <profile-form
            :profile="profile"
            :objectives="objectives"
            :activity-levels="activityLevels"
            @saved="refreshProfile"/>
      </div>
    </div>

    <!-- Formulario de preferencias separado -->
    <div class="grid mt-4" v-if="profile.id">
      <div class="col-12">
        <preferences-form
            :profile-id="profile.id"
            :allergies="profile.allergies"
            @updated="refreshProfile"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthenticationStore } from '@/domains/iam/services/authentication.store.js';
import { ProfileService} from "@/domains/profiles/services/profile.service.js";
import { ActivityLevelService} from "@/domains/profiles/services/activity-level.service.js";
import { ObjectiveService} from "@/domains/profiles/services/objective.service.js";
import ProfileForm from '@/domains/profiles/components/profile-form.component.vue';
import PreferencesForm from '@/domains/profiles/components/preferences-form.component.vue';

const authStore = useAuthenticationStore();
const username = authStore.currentUsername;
const userId = authStore.currentUserId;

const profileService = new ProfileService();
const activityLevelService = new ActivityLevelService();
const objectiveService = new ObjectiveService();

const profile = ref({});
const objectives = ref([]);
const activityLevels = ref([]);
const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    // Cargar perfil
    try {
      profile.value = await profileService.getByUserId(userId);
      console.log('Perfil cargado:', profile.value);
    } catch (error) {
      console.log('No se encontró perfil existente, se creará uno nuevo');
      profile.value = {}; // No hay perfil creado aún
    }

    // Cargar objetivos y niveles de actividad
    const [objectivesData, activityLevelsData] = await Promise.all([
      objectiveService.getAll(),
      activityLevelService.getAll()
    ]);

    objectives.value = objectivesData.data || objectivesData;
    activityLevels.value = activityLevelsData.data || activityLevelsData;

    console.log('Objetivos cargados:', objectives.value);
    console.log('Niveles de actividad cargados:', activityLevels.value);

  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
};

const refreshProfile = async () => {
  try {
    profile.value = await profileService.getByUserId(userId);
    console.log('Perfil actualizado:', profile.value);
  } catch (error) {
    console.error('Error refreshing profile:', error);
  }
};

onMounted(loadData);
</script>

<!--<style scoped>-->
<!--/* Estilos para el componente de gestión de perfil */-->
<!--.profile-management {-->
<!--  max-width: 1400px;-->
<!--  margin: 0 auto;-->
<!--  padding: 2rem;-->
<!--  background: linear-gradient(135deg, var(&#45;&#45;background-color) 0%, var(&#45;&#45;background-color-alt) 100%);-->
<!--  border-radius: 20px;-->
<!--  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);-->
<!--  position: relative;-->
<!--  overflow: hidden;-->
<!--}-->

<!--/* Decoración de fondo sutil */-->
<!--.profile-management::before {-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  top: -50%;-->
<!--  right: -50%;-->
<!--  width: 200%;-->
<!--  height: 200%;-->
<!--  background: radial-gradient(circle, rgba(99, 182, 99, 0.03) 0%, transparent 70%);-->
<!--  pointer-events: none;-->
<!--  z-index: 0;-->
<!--}-->

<!--/* Contenido principal por encima del fondo */-->
<!--.profile-management > * {-->
<!--  position: relative;-->
<!--  z-index: 1;-->
<!--}-->

<!--/* Título de bienvenida mejorado */-->
<!--.profile-management h2 {-->
<!--  font-family: 'Poppins', sans-serif;-->
<!--  font-weight: 700;-->
<!--  font-size: 2.5rem;-->
<!--  color: var(&#45;&#45;primary-color);-->
<!--  margin-bottom: 0.5rem;-->
<!--  text-align: center;-->
<!--  background: linear-gradient(135deg, var(&#45;&#45;primary-color) 0%, var(&#45;&#45;primary-color-hover) 100%);-->
<!--  -webkit-background-clip: text;-->
<!--  -webkit-text-fill-color: transparent;-->
<!--  background-clip: text;-->
<!--  text-shadow: 0 2px 4px rgba(99, 182, 99, 0.2);-->
<!--}-->

<!--/* Subtítulo de bienvenida */-->
<!--.profile-management h2::after {-->
<!--  content: '¡Gestiona tu perfil y preferencias!';-->
<!--  display: block;-->
<!--  font-size: 1rem;-->
<!--  font-weight: 400;-->
<!--  color: var(&#45;&#45;text-color-light);-->
<!--  background: none;-->
<!--  -webkit-text-fill-color: var(&#45;&#45;text-color-light);-->
<!--  margin-top: 0.5rem;-->
<!--  text-shadow: none;-->
<!--}-->

<!--/* Grid mejorado - mantiene el layout original */-->
<!--.profile-management .grid {-->
<!--  margin-top: 2.5rem;-->
<!--}-->

<!--/* Solo añadir estilos visuales sin cambiar el layout */-->
<!--.profile-management .grid > div {-->
<!--  position: relative;-->
<!--}-->

<!--/* Estilos para mejorar las tarjetas PrimeVue sin afectar su estructura */-->
<!--.profile-management :deep(.p-card) {-->
<!--  background: rgba(255, 255, 255, 0.95);-->
<!--  backdrop-filter: blur(10px);-->
<!--  border: 1px solid rgba(99, 182, 99, 0.1);-->
<!--  border-radius: 16px;-->
<!--  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);-->
<!--  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);-->
<!--  position: relative;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.profile-management :deep(.p-card)::before {-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  right: 0;-->
<!--  height: 4px;-->
<!--  background: linear-gradient(90deg, var(&#45;&#45;primary-color) 0%, var(&#45;&#45;primary-color-hover) 100%);-->
<!--  opacity: 0;-->
<!--  transition: opacity 0.3s ease;-->
<!--}-->

<!--.profile-management :deep(.p-card):hover {-->
<!--  transform: translateY(-4px);-->
<!--  box-shadow: 0 16px 48px rgba(99, 182, 99, 0.15);-->
<!--  border-color: rgba(99, 182, 99, 0.2);-->
<!--}-->

<!--.profile-management :deep(.p-card):hover::before {-->
<!--  opacity: 1;-->
<!--}-->

<!--/* Estilos específicos para la tarjeta de información de usuario */-->
<!--.profile-management .col-12.md\\:col-4 :deep(.p-card) {-->
<!--  background: linear-gradient(135deg, rgba(99, 182, 99, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%);-->
<!--}-->

<!--/* Título de las tarjetas PrimeVue */-->
<!--.profile-management :deep(.p-card-title) {-->
<!--  font-family: 'Poppins', sans-serif;-->
<!--  font-weight: 600;-->
<!--  color: var(&#45;&#45;primary-color);-->
<!--  margin-bottom: 1rem;-->
<!--}-->

<!--/* Contenido de las tarjetas PrimeVue */-->
<!--.profile-management :deep(.p-card-content) p {-->
<!--  font-weight: 400;-->
<!--  color: var(&#45;&#45;text-color);-->
<!--  margin-bottom: 0.75rem;-->
<!--  line-height: 1.6;-->
<!--}-->

<!--.profile-management :deep(.p-card-content) p:last-child {-->
<!--  margin-bottom: 0;-->
<!--}-->

<!--/* Información destacada en la tarjeta */-->
<!--.profile-management :deep(.p-card-content) p strong {-->
<!--  color: var(&#45;&#45;primary-color);-->
<!--  font-weight: 600;-->
<!--}-->

<!--/* Estilos para los componentes de formulario sin cambiar su estructura */-->
<!--.profile-management .col-12.md\\:col-8,-->
<!--.profile-management .col-12:last-child {-->
<!--  position: relative;-->
<!--}-->

<!--.profile-management .col-12.md\\:col-8 > *,-->
<!--.profile-management .col-12:last-child > * {-->
<!--  background: rgba(255, 255, 255, 0.95);-->
<!--  backdrop-filter: blur(10px);-->
<!--  border: 1px solid rgba(99, 182, 99, 0.1);-->
<!--  border-radius: 16px;-->
<!--  padding: 2rem;-->
<!--  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);-->
<!--  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);-->
<!--  position: relative;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.profile-management .col-12.md\\:col-8 > *::before,-->
<!--.profile-management .col-12:last-child > *::before {-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  right: 0;-->
<!--  height: 4px;-->
<!--  background: linear-gradient(90deg, var(&#45;&#45;primary-color) 0%, var(&#45;&#45;primary-color-hover) 100%);-->
<!--  opacity: 0;-->
<!--  transition: opacity 0.3s ease;-->
<!--}-->

<!--.profile-management .col-12.md\\:col-8 > *:hover,-->
<!--.profile-management .col-12:last-child > *:hover {-->
<!--  transform: translateY(-4px);-->
<!--  box-shadow: 0 16px 48px rgba(99, 182, 99, 0.15);-->
<!--  border-color: rgba(99, 182, 99, 0.2);-->
<!--}-->

<!--.profile-management .col-12.md\\:col-8 > *:hover::before,-->
<!--.profile-management .col-12:last-child > *:hover::before {-->
<!--  opacity: 1;-->
<!--}-->

<!--/* Mantener el layout original del grid PrimeVue */-->

<!--/* Indicador de sección activa */-->
<!--.profile-management .grid:not(:first-of-type) {-->
<!--  position: relative;-->
<!--  margin-top: 3rem;-->
<!--}-->

<!--.profile-management .grid:not(:first-of-type)::before {-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  top: -1.5rem;-->
<!--  left: 50%;-->
<!--  transform: translateX(-50%);-->
<!--  width: 100px;-->
<!--  height: 2px;-->
<!--  background: linear-gradient(90deg, transparent 0%, var(&#45;&#45;primary-color) 50%, transparent 100%);-->
<!--}-->

<!--/* Estados de carga */-->
<!--.profile-management.loading {-->
<!--  opacity: 0.7;-->
<!--  pointer-events: none;-->
<!--}-->

<!--.profile-management.loading::after {-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  width: 40px;-->
<!--  height: 40px;-->
<!--  border: 3px solid rgba(99, 182, 99, 0.3);-->
<!--  border-top: 3px solid var(&#45;&#45;primary-color);-->
<!--  border-radius: 50%;-->
<!--  animation: spin 1s linear infinite;-->
<!--  z-index: 10;-->
<!--}-->

<!--@keyframes spin {-->
<!--  0% { transform: translate(-50%, -50%) rotate(0deg); }-->
<!--  100% { transform: translate(-50%, -50%) rotate(360deg); }-->
<!--}-->

<!--/* Responsive design - mantiene el comportamiento original */-->
<!--@media (max-width: 768px) {-->
<!--  .profile-management {-->
<!--    padding: 1.5rem;-->
<!--    margin: 1rem;-->
<!--    border-radius: 16px;-->
<!--  }-->

<!--  .profile-management h2 {-->
<!--    font-size: 2rem;-->
<!--  }-->

<!--  .profile-management .grid {-->
<!--    gap: 1.5rem;-->
<!--  }-->

<!--  .profile-management :deep(.p-card) {-->
<!--    padding: 1.5rem;-->
<!--  }-->

<!--  .profile-management .col-12.md\\:col-8 > *,-->
<!--  .profile-management .col-12:last-child > * {-->
<!--    padding: 1.5rem;-->
<!--  }-->

<!--  .profile-management .grid:not(:first-of-type) {-->
<!--    margin-top: 2rem;-->
<!--  }-->
<!--}-->

<!--@media (max-width: 480px) {-->
<!--  .profile-management {-->
<!--    padding: 1rem;-->
<!--    margin: 0.5rem;-->
<!--  }-->

<!--  .profile-management h2 {-->
<!--    font-size: 1.75rem;-->
<!--  }-->

<!--  .profile-management :deep(.p-card) {-->
<!--    padding: 1.25rem;-->
<!--  }-->

<!--  .profile-management .col-12.md\\:col-8 > *,-->
<!--  .profile-management .col-12:last-child > * {-->
<!--    padding: 1.25rem;-->
<!--  }-->
<!--}-->

<!--/* Animaciones de entrada */-->
<!--@keyframes fadeInUp {-->
<!--  from {-->
<!--    opacity: 0;-->
<!--    transform: translateY(30px);-->
<!--  }-->
<!--  to {-->
<!--    opacity: 1;-->
<!--    transform: translateY(0);-->
<!--  }-->
<!--}-->

<!--.profile-management > * {-->
<!--  animation: fadeInUp 0.6s ease forwards;-->
<!--}-->

<!--.profile-management .grid:nth-child(2) {-->
<!--  animation-delay: 0.2s;-->
<!--}-->

<!--.profile-management .grid:nth-child(3) {-->
<!--  animation-delay: 0.4s;-->
<!--}-->

<!--/* Modo oscuro - solo estilos visuales */-->
<!--@media (prefers-color-scheme: dark) {-->
<!--  .system-preferred-dark .profile-management {-->
<!--    background: linear-gradient(135deg, var(&#45;&#45;background-color) 0%, var(&#45;&#45;background-color-alt) 100%);-->
<!--  }-->

<!--  .system-preferred-dark .profile-management::before {-->
<!--    background: radial-gradient(circle, rgba(99, 182, 99, 0.05) 0%, transparent 70%);-->
<!--  }-->

<!--  .system-preferred-dark .profile-management :deep(.p-card) {-->
<!--    background: rgba(42, 42, 42, 0.95);-->
<!--    border-color: rgba(99, 182, 99, 0.2);-->
<!--  }-->

<!--  .system-preferred-dark .profile-management .col-12.md\\:col-4 :deep(.p-card) {-->
<!--    background: linear-gradient(135deg, rgba(99, 182, 99, 0.1) 0%, rgba(42, 42, 42, 0.95) 100%);-->
<!--  }-->

<!--  .system-preferred-dark .profile-management .col-12.md\\:col-8 > *,-->
<!--  .system-preferred-dark .profile-management .col-12:last-child > * {-->
<!--    background: rgba(42, 42, 42, 0.95);-->
<!--    border-color: rgba(99, 182, 99, 0.2);-->
<!--  }-->
<!--}-->
<!--</style>-->