<template>
  <div class="recommendations-page">
    <div v-if="loading || assigning" class="loading-section">
      <pv-progress-spinner />
      <p>Cargando recomendaciones...</p>
    </div>
    <div v-else-if="recommendations.length === 0" class="empty-state">
      <h3>No tienes recomendaciones asignadas</h3>
    </div>
    <div v-else class="recommendations-grid">
      <pv-card v-for="recommendation in recommendations" :key="recommendation.id">
        <template #header>
          <h3>{{ recommendation.getTemplateTitle() }}</h3>
        </template>
        <template #content>
          <p><strong>Motivo:</strong> {{ recommendation.reason }}</p>
          <p><strong>Notas:</strong> {{ recommendation.notes }}</p>
          <p><strong>Horario:</strong> {{ recommendation.timeOfDayDisplay }}</p>
          <p><strong>Puntaje:</strong> {{ recommendation.score }}</p>
          <p><strong>Estado:</strong> {{ recommendation.statusDisplay }}</p>
          <p><strong>Asignado:</strong> {{ recommendation.getFormattedAssignedDate() }}</p>
        </template>
        <template #footer>
          <pv-button label="Editar" icon="pi pi-pencil" @click="editRecommendation(recommendation)" />
          <pv-button label="Borrar" icon="pi pi-trash" severity="danger" @click="deleteRecommendation(recommendation.id)" />
        </template>
      </pv-card>
    </div>
    <RecommendationItemCreateAndEdit
        v-if="editingRecommendation"
        :item="editingRecommendation"
        :visible="editDialogVisible"
        :edit="true"
        @cancel-requested="closeEditDialog"
        @save-requested="saveEditRecommendation"
    />
  </div>
</template>

<script>
import { Recommendation, AutoAssignRecommendationsRequest } from "../model/recommendation.entity.js";
import { RecommendationService } from "../services/recommendation.service.js";
import { Card as PvCard, Button as PvButton, ProgressSpinner as PvProgressSpinner } from "primevue";
import RecommendationItemCreateAndEdit from "../components/recommendation-item-create-and-edit.component.vue";

export default {
  name: "recommendation-management",
  components: {
    PvCard,
    PvButton,
    PvProgressSpinner,
    RecommendationItemCreateAndEdit
  },
  data() {
    return {
      recommendations: [],
      loading: false,
      assigning: false,
      currentUserId: 1, // Debes obtenerlo del contexto real
      editingRecommendation: null,
      editDialogVisible: false,
      recommendationService: new RecommendationService()
    }
  },
  methods: {
    async autoAssignRecommendations() {
      this.assigning = true;
      try {
        const request = new AutoAssignRecommendationsRequest({
          userId: this.currentUserId,
          count: 3
        });
        await this.recommendationService.autoAssignRecommendations(request);
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron asignar recomendaciones',
          life: 3000
        });
      } finally {
        this.assigning = false;
      }
    },

    async loadUserRecommendations() {
      console.log('Entrando a loadUserRecommendations');
      this.loading = true;
      try {
        const data = await this.recommendationService.getByUserId(this.currentUserId);
        console.log('Recomendaciones recibidas:', data);
        this.recommendations = Array.isArray(data) ? data.map(rec => new Recommendation(rec)) : [];
      } catch (error) {
        console.log('Error en loadUserRecommendations:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las recomendaciones',
          life: 3000
        });
      } finally {
        this.loading = false;
      }
    },


    editRecommendation(recommendation) {
      this.editingRecommendation = { ...recommendation };
      this.editDialogVisible = true;
    },
    closeEditDialog() {
      this.editDialogVisible = false;
      this.editingRecommendation = null;
    },
    async saveEditRecommendation(updatedItem) {
      try {
        await this.recommendationService.update(updatedItem.id, updatedItem);
        await this.loadUserRecommendations();
        this.closeEditDialog();
        this.$toast.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Recomendación actualizada',
          life: 3000
        });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar',
          life: 3000
        });
      }
    },
    async deleteRecommendation(id) {
      try {
        await this.recommendationService.delete(id);
        await this.loadUserRecommendations();
        this.$toast.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Recomendación eliminada',
          life: 3000
        });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar',
          life: 3000
        });
      }
    }
  },
  async mounted() {
    await this.autoAssignRecommendations();
    await this.loadUserRecommendations();
  },
  recommendationService: new RecommendationService()
}
</script>