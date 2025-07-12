<script setup>
import { ref, reactive, onMounted } from 'vue';
import TrackingCreateAndEditDialog from "@/domains/tracking/components/tracking-create-and-edit.component.vue";
import TrackingService from "@/domains/tracking/services/tracking.service.js";


const trackingService = new TrackingService();

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

function clearTracking() {
  tracking.id = 0;
  tracking.userId = 0;
  tracking.date = '';
  tracking.trackingGoal = null;
  tracking.consumedMacros = null;
  tracking.mealPlanEntries = [];
  error.value = '';
}

function getProgress(type) {
  const consumed = tracking.consumedMacros?.[type] || 0;
  const target = tracking.trackingGoal?.[`target${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0;
  return target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
}

async function searchTracking() {
  clearTracking();
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
    console.error('Error fetching tracking info:', err);
    error.value = 'Error al cargar los datos de seguimiento. Por favor intenta nuevamente.';
    clearTracking();
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
    console.error('Error adding meal plan entry:', err);
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
    console.error('Error updating meal plan entry:', err);
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
    console.error('Error deleting meal plan entry:', err);
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
      console.error('Error refreshing meal plan entries:', err);
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
</script>

<template>
  <div class="tracking-management">
    <pv-card>
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

          <div class="search-section">
            <div class="search-controls">
              <pv-float-label>
                <pv-input-number
                    id="searchUserId"
                    v-model="searchUserId"
                    :min="1"
                    :disabled="loading"
                    class="search-input"
                />
                <label for="searchUserId">ID de Usuario</label>
              </pv-float-label>

              <div class="search-buttons">
                <pv-button
                    label="Buscar"
                    icon="pi pi-search"
                    :loading="loading"
                    @click="searchTracking"
                />
                <pv-button
                    label="Limpiar"
                    icon="pi pi-times"
                    severity="secondary"
                    @click="clearTracking"
                />
              </div>
            </div>
          </div>

          <div v-if="tracking.trackingGoal" class="goal-section">
            <pv-card class="goal-card">
              <template #header>
                <div class="goal-header">
                  <h3>Objetivo de Seguimiento</h3>
                </div>
              </template>

              <template #content>
                <div class="goal-content">

                  <div class="targets-grid">
                    <div class="target-item">
                      <span class="target-label">Calorías</span>
                      <span class="target-value">{{ tracking.trackingGoal.targetCalories }}</span>
                    </div>
                    <div class="target-item">
                      <span class="target-label">Proteínas</span>
                      <span class="target-value">{{ tracking.trackingGoal.targetProtein }}g</span>
                    </div>
                    <div class="target-item">
                      <span class="target-label">Carbohidratos</span>
                      <span class="target-value">{{ tracking.trackingGoal.targetCarbs }}g</span>
                    </div>
                    <div class="target-item">
                      <span class="target-label">Grasas</span>
                      <span class="target-value">{{ tracking.trackingGoal.targetFats }}g</span>
                    </div>
                  </div>

                  <div v-if="tracking.consumedMacros" class="progress-section">
                    <h4>Progreso Actual</h4>
                    <div class="progress-grid">
                      <div
                          v-for="type in ['calories', 'protein', 'carbs', 'fats']"
                          :key="type"
                          class="progress-item"
                      >
                        <div class="progress-header">
                          <span class="progress-label">{{
                              type === 'calories' ? 'Calorías' :
                                  type === 'protein' ? 'Proteínas' :
                                      type === 'carbs' ? 'Carbohidratos' : 'Grasas'
                            }}</span>
                          <span class="progress-text">
                            {{ tracking.consumedMacros[type] || 0 }} /
                            {{ tracking.trackingGoal[`target${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0 }}
                          </span>
                        </div>
                        <div class="progress-bar">
                          <div
                              class="progress-fill"
                              :style="{ width: getProgress(type) + '%' }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </pv-card>
          </div>

          <div v-if="tracking.id" class="meals-section">
            <pv-card>
              <template #header>
                <div class="meals-header">
                  <h3>Entradas del Plan de Comida</h3>
                  <pv-button
                      label="Agregar Entrada"
                      icon="pi pi-plus"
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

.card-header {
  padding: 1rem;
  background: linear-gradient(135deg, #63B663 0%, #63B663 100%);
  color: white;
  border-radius: 6px 6px 0 0;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
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
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
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
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.goal-header h3 {
  margin: 0;
  color: #495057;
}

.goal-content {
  padding: 1.5rem;
}

.goal-description {
  margin: 0 0 1.5rem 0;
  color: #6c757d;
  font-style: italic;
}

.targets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.target-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.target-label {
  display: block;
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.target-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #495057;
}

.progress-section h4 {
  margin: 0 0 1rem 0;
  color: #495057;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.progress-item {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-weight: 500;
  color: #495057;
}

.progress-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.meals-section {
  margin-top: 1rem;
}

.meals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.meals-header h3 {
  margin: 0;
  color: #495057;
}

.meals-table {
  margin-top: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
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

  .goal-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .meals-header {
    flex-direction: column;
    gap: 1rem;
  }

  .targets-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .progress-grid {
    grid-template-columns: 1fr;
  }
}
</style>