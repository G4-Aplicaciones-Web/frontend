<script setup>
import { ref, reactive, onMounted } from 'vue';
import TrackingCreateAndEditDialog from "@/domains/tracking/components/tracking-create-and-edit.component.vue";
import TrackingService from "@/domains/tracking/services/tracking.service.js";
import { TrackingGoalService } from "@/domains/tracking/services/tracking-goal.service.js";
import { useAuthenticationStore } from "@/domains/iam/services/authentication.store.js";

const trackingService = new TrackingService();
const trackingGoalService = new TrackingGoalService();
const authStore = useAuthenticationStore();

const searchUserId = ref('');
const tracking = reactive({
  id: 0,
  userId: 0,
  date: '',
  trackingGoal: null,
  consumedMacros: null,
  mealPlanEntries: [],
});

const showCreateDialog = ref(false);
const editingMealEntry = ref(null);
const loading = ref(false);
const error = ref('');

const getUserIdFromAuth = () => authStore.currentUserId;

const getProfileIdFromStorage = () => {
  try {
    const profileId = localStorage.getItem('profileId');
    const parsed = parseInt(profileId, 10);
    return isNaN(parsed) ? null : parsed;
  } catch (e) {
    return null;
  }
};

const createTrackingGoalAndTracking = async (profileId, userId) => {
  const trackingGoalResponse = await trackingGoalService.createFromProfile(profileId, { userId });
  const trackingGoalId = trackingGoalResponse.data.id;

  const today = new Date().toISOString().split('T')[0];
  const trackingResponse = await trackingService.create({
    userId,
    date: today,
    trackingGoalId,
  });

  return {
    trackingGoalId,
    trackingId: trackingResponse.data.id,
  };
};

const initializeTracking = async () => {
  const userId = getUserIdFromAuth();
  if (!userId) {
    error.value = 'Usuario no autenticado. Por favor inicia sesión.';
    clearTracking();
    return;
  }

  clearTracking();

  const profileId = getProfileIdFromStorage();
  if (!profileId) {
    error.value = 'No se encontró un perfil. Por favor completa tu perfil primero.';
    return;
  }

  searchUserId.value = userId.toString();

  try {
    await searchTracking();
  } catch (err) {
    try {
      loading.value = true;
      if (err.message === 'NOT_FOUND') {
        await createTrackingGoalAndTracking(profileId, userId);
        await searchTracking();
      } else {
        throw err;
      }
    } catch (createError) {
      console.error('Error al crear tracking:', createError);
      error.value = 'Error al inicializar el tracking.';
    } finally {
      loading.value = false;
    }
  }
};

function clearTracking() {
  tracking.id = 0;
  tracking.userId = 0;
  tracking.date = '';
  tracking.trackingGoal = null;
  tracking.consumedMacros = null;
  tracking.mealPlanEntries = [];
  error.value = '';
  searchUserId.value = '';
}

function getProgress(type) {
  const consumed = tracking.consumedMacros?.[type] || 0;
  const target = tracking.trackingGoal?.[`target${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0;
  return target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
}

async function searchTracking() {
  const userId = parseInt(searchUserId.value);
  if (!userId || userId <= 0) {
    error.value = 'Por favor ingresa un ID de usuario válido';
    return;
  }

  loading.value = true;
  try {
    const [trackingData, goalData] = await Promise.all([
      trackingService.getByUserId(userId).then(res => res.data),
      trackingService.getTrackingGoalByUserId(userId).then(res => res.data)
    ]);

    tracking.id = trackingData.id;
    tracking.userId = trackingData.userId;
    tracking.date = trackingData.date;
    tracking.trackingGoal = {
      ...goalData,
      targetCalories: goalData.targetMacros.calories,
      targetProtein: goalData.targetMacros.proteins,
      targetCarbs: goalData.targetMacros.carbs,
      targetFats: goalData.targetMacros.fats,
    };

    const macrosRes = await trackingService.getConsumedMacros(trackingData.id);
    tracking.consumedMacros = macrosRes.data;

    const mealsRes = await trackingService.getAllMealsByTrackingId(trackingData.id);
    tracking.mealPlanEntries = mealsRes.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      clearTracking();
      throw new Error('NOT_FOUND');
    }
    clearTracking();
    throw err;
  } finally {
    loading.value = false;
  }
}

async function createTrackingManually() {
  const userId = getUserIdFromAuth();
  const profileId = getProfileIdFromStorage();

  if (!userId || !profileId) {
    error.value = 'Faltan datos requeridos.';
    return;
  }

  loading.value = true;
  try {
    await createTrackingGoalAndTracking(profileId, userId);
    await searchTracking();
    error.value = '';
  } catch (err) {
    console.error('Error creating tracking manually:', err);
    error.value = 'Error al crear el tracking manualmente.';
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  editingMealEntry.value = null;
  showCreateDialog.value = true;
}

function openEditDialog(entry) {
  editingMealEntry.value = entry;
  showCreateDialog.value = true;
}

async function onMealPlanEntryAdded(event) {
  try {
    loading.value = true;
    await trackingService.createMealPlanEntry(event.trackingId, event.entry);
    showCreateDialog.value = false;
    await refreshMealPlanEntries();
  } catch (err) {
    error.value = 'Error al agregar la entrada del plan de comida';
  } finally {
    loading.value = false;
  }
}

async function onMealPlanEntryUpdated(event) {
  try {
    loading.value = true;
    await trackingService.updateMealPlanEntry(event.entryId, event.entry);
    showCreateDialog.value = false;
    await refreshMealPlanEntries();
  } catch (err) {
    error.value = 'Error al actualizar la entrada del plan de comida';
  } finally {
    loading.value = false;
  }
}

async function deleteMealPlanEntry(entry) {
  try {
    loading.value = true;
    await trackingService.removeMealPlanEntry(tracking.id, entry.id);
    await refreshMealPlanEntries();
  } catch (err) {
    error.value = 'Error al eliminar la entrada del plan de comida';
  } finally {
    loading.value = false;
  }
}

async function refreshMealPlanEntries() {
  if (tracking.id) {
    try {
      const mealsRes = await trackingService.getAllMealsByTrackingId(tracking.id);
      tracking.mealPlanEntries = mealsRes.data;

      const macrosRes = await trackingService.getConsumedMacros(tracking.id);
      tracking.consumedMacros = macrosRes.data;
    } catch (err) {
      console.error('Error al refrescar las comidas:', err);
    }
  }
}

function onEditCanceled() {
  showCreateDialog.value = false;
  editingMealEntry.value = null;
}

function confirmDelete(entry) {
  deleteMealPlanEntry(entry);
}

onMounted(() => {
  authStore.initializeFromStorage();
  initializeTracking();
});
</script>


<template>
  <div class="tracking-management">
    <pv-card class="main-card">
      <template #header>
        <div class="card-header">
          <h2 class="page-title">Gestión de Seguimiento</h2>
        </div>
      </template>

      <template #content>
        <div class="card-content">
          <div v-if="error" class="error-message">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ error }}</span>
          </div>


          <div v-if="tracking.trackingGoal" class="goal-section">
            <pv-card class="goal-card card">
              <template #header>
                <div class="goal-header">
                  <i class="pi pi-chart-line"></i>
                  <h3>Macronutrientes Objetivo</h3>
                </div>
              </template>

              <template #content>
                <div class="goal-content">
                  <div class="targets-grid">
                    <div class="target-item">
                      <div class="target-icon">
                        <i class="pi pi-bolt"></i>
                      </div>
                      <span class="target-label">Calorías</span>
                      <span class="target-value">{{ tracking.trackingGoal.targetCalories }}</span>
                    </div>
                    <div class="target-item">
                      <div class="target-icon">
                        <i class="pi pi-shield"></i>
                      </div>
                      <span class="target-label">Proteínas</span>
                      <span class="target-value">{{ tracking.trackingGoal.targetProtein }}g</span>
                    </div>
                    <div class="target-item">
                      <div class="target-icon">
                        <i class="pi pi-star"></i>
                      </div>
                      <span class="target-label">Carbohidratos</span>
                      <span class="target-value">{{ tracking.trackingGoal.targetCarbs }}g</span>
                    </div>
                    <div class="target-item">
                      <div class="target-icon">
                        <i class="pi pi-circle"></i>
                      </div>
                      <span class="target-label">Grasas</span>
                      <span class="target-value">{{ tracking.trackingGoal.targetFats }}g</span>
                    </div>
                  </div>
                </div>
              </template>
            </pv-card>
          </div>

          <div v-if="tracking.id" class="meals-section">
            <pv-card class="meals-card card">
              <template #header>
                <div class="meals-header">
                  <h3>Entradas del Plan de Comida</h3>
                  <pv-button
                      label="Agregar Entrada"
                      icon="pi pi-plus"
                      class="primary-button"
                      @click="openCreateDialog"
                  />
                </div>
              </template>

              <template #content>
                <pv-data-table
                    v-if="tracking.mealPlanEntries.length > 0"
                    :value="tracking.mealPlanEntries"
                    :paginator="true"
                    :rows="10"
                    :loading="loading"
                    responsiveLayout="scroll"
                    class="meals-table"
                >
                  <pv-column field="recipeId" header="ID Receta" sortable />
                  <pv-column field="mealPlanType" header="Tipo de Comida" sortable>
                    <template #body="{ data }">
                      <pv-tag
                          :value="data.mealPlanType"
                          :severity="
                            data.mealPlanType === 'Breakfast' ? 'success' :
                            data.mealPlanType === 'Lunch' ? 'info' :
                            data.mealPlanType === 'Dinner' ? 'warning' : 'secondary'
                          "
                      />
                    </template>
                  </pv-column>
                  <pv-column field="dayNumber" header="Día" sortable />
                  <pv-column header="Acciones">
                    <template #body="{ data }">
                      <div class="action-buttons">
                        <pv-button
                            icon="pi pi-pencil"
                            severity="info"
                            size="small"
                            @click="openEditDialog(data)"
                        />
                        <pv-button
                            icon="pi pi-trash"
                            severity="danger"
                            size="small"
                            @click="confirmDelete(data)"
                        />
                      </div>
                    </template>
                  </pv-column>
                </pv-data-table>

                <div v-else class="no-data">
                  <i class="pi pi-inbox no-data-icon"></i>
                  <p>No se encontraron entradas del plan de comida para este seguimiento.</p>
                </div>
              </template>
            </pv-card>
          </div>
        </div>
      </template>
    </pv-card>

    <TrackingCreateAndEditDialog
        v-if="tracking.id"
        :visible="showCreateDialog"
        :tracking="tracking"
        :editing-meal-entry="editingMealEntry"
        @meal-plan-entry-added="onMealPlanEntryAdded"
        @meal-plan-entry-updated="onMealPlanEntryUpdated"
        @edit-canceled="onEditCanceled"
    />
  </div>
</template>

<style scoped>
.tracking-management {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.main-card {
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-hover) 100%);
  color: white;
  border-radius: 0;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;
}

.search-section {
  background: var(--background-color-alt);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.search-controls {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.search-input {
  min-width: 200px;
}

.search-buttons {
  display: flex;
  gap: 0.5rem;
}

.goal-section {
  margin-top: 1rem;
}

.goal-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: #f8fdf8 !important;
  border: 1px solid #e8f5e8 !important;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 182, 99, 0.15);
}

.goal-header {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 0.75rem !important;
  padding: 1rem;
  background: linear-gradient(135deg, #63B663 0%, #5aa75a 100%) !important;
  border-bottom: none;
  color: white;
  text-align: center !important;
}

.goal-header i {
  font-size: 1.25rem;
  color: white;
}

.goal-header h3 {
  margin: 0;
  color: white;
  font-weight: 600;
  text-align: center;
}

.goal-content {
  padding: 1.5rem;
}

.targets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.primary-button {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.primary-button:hover {
  background-color: var(--primary-color-hover) !important;
  border-color: var(--primary-color-hover) !important;
}

.primary-button:focus {
  box-shadow: 0 0 0 2px rgba(99, 182, 99, 0.2) !important;
}

.target-item {
  background: linear-gradient(135deg, #63B663 0%, #5aa75a 100%);
  padding: 1.25rem;
  border-radius: 8px;
  text-align: center;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
}

.target-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 182, 99, 0.3);
}

.target-icon {
  background: rgba(255, 255, 255, 0.2);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.target-icon i {
  font-size: 1.25rem;
  color: white;
}

.target-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.target-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.progress-section h4 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  font-weight: 500;
}

.meals-section {
  margin-top: 1rem;
}

/* Updated meals card styling with soft green theme */
.meals-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: #f4faf4 !important; /* Soft green background, less tenue */
  border: 1px solid #d4ebd4 !important; /* More visible green border */
}

.meals-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 182, 99, 0.25); /* Stronger green shadow on hover */
}

.meals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(99, 182, 99, 0.18) 0%, rgba(99, 182, 99, 0.12) 100%) !important; /* Less tenue green gradient */
  border-bottom: 1px solid rgba(99, 182, 99, 0.3); /* More visible green border */
}

.meals-header h3 {
  margin: 0;
  color: #63B663; /* Darker green for text */
  font-weight: 600;
}

.meals-table {
  margin-top: 1rem;
}

/* Data table styling to match the green theme */
.meals-table :deep(.p-datatable) {
  background: #fafcfa !important; /* Soft white with more green hint */
  border: 1px solid rgba(99, 182, 99, 0.2) !important;
}

.meals-table :deep(.p-datatable-thead th) {
  background: rgba(99, 182, 99, 0.15) !important; /* More visible green header */
  color: #63B663 !important; /* Dark green text */
  border-bottom: 1px solid rgba(99, 182, 99, 0.3) !important;
}

.meals-table :deep(.p-datatable-tbody td) {
  color: #2d5a2d !important; /* Dark green text */
  border-bottom: 1px solid rgba(99, 182, 99, 0.15) !important;
}

.meals-table :deep(.p-datatable-tbody tr) {
  background: #fafcfa !important; /* Soft white with green hint */
}

.meals-table :deep(.p-datatable-tbody tr:hover) {
  background: rgba(99, 182, 99, 0.1) !important; /* More visible green on hover */
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--text-color-light);
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  color: var(--text-color-light);
}

.no-data p {
  font-weight: 300;
  color: var(--text-color-light);
}

@media (max-width: 768px) {
  .tracking-management {
    padding: 1rem;
  }

  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-buttons {
    justify-content: center;
  }

  .meals-header {
    flex-direction: column;
    gap: 1rem;
  }

  .targets-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .goal-content {
    padding: 1rem;
  }

  .target-item {
    min-width: 120px;
    padding: 1rem;
  }
}
</style>