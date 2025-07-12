<template>
  <div class="recommendations-page">
    <div v-if="loading || assigning" class="loading-section">
      <pv-progress-spinner />
      <p>{{ $t('recommendation.loading') }}</p>
    </div>
    <div v-else-if="recommendations.length === 0" class="empty-state">
      <h3>{{ $t('recommendation.empty') }}</h3>
      <pv-button
          :label="$t('recommendation.actions.load')"
          icon="pi pi-plus"
          @click="autoAssignRecommendations"
          class="load-btn"
      />
    </div>
    <div v-else>
      <div class="recommendations-grid">
        <pv-card
            v-for="recommendation in recommendations"
            :key="recommendation.id"
            class="recommendation-card"
        >
          <template #header>
            <h3>{{ recommendation.getTemplateTitleById(templates) }}</h3>
          </template>
          <template #content>
            <p>
              <strong>{{ $t('recommendation.columns.reason') }}:</strong>
              {{ recommendation.reason }}
            </p>
            <p>
              <strong>{{ $t('recommendation.columns.notes') }}:</strong>
              {{ recommendation.notes }}
            </p>
            <p>
              <strong>{{ $t('recommendation.columns.time_of_day') }}:</strong>
              {{ $t('recommendation.time_of_day.' + recommendation.mappedTimeOfDay) }}
            </p>
            <p>
              <strong>{{ $t('recommendation.columns.score') }}:</strong>
              {{ recommendation.score }}
            </p>
            <p>
              <strong>{{ $t('recommendation.columns.status') }}:</strong>
              {{ $t('recommendation.status.' + recommendation.mappedStatus) }}
            </p>
            <p>
              <strong>{{ $t('recommendation.columns.assigned') }}:</strong>
              {{ recommendation.getFormattedAssignedDate() }}
            </p>
          </template>
          <template #footer>
            <pv-button
                :label="$t('recommendation.actions.edit')"
                icon="pi pi-pencil"
                @click="editRecommendation(recommendation)"
            />
            <pv-button
                :label="$t('recommendation.actions.delete')"
                icon="pi pi-trash"
                severity="danger"
                @click="deleteRecommendation(recommendation.id)"
            />
          </template>
        </pv-card>
      </div>
      <div class="actions-row">
        <pv-button
            :label="$t('recommendation.actions.load_more')"
            icon="pi pi-plus"
            @click="autoAssignRecommendations"
            class="load-btn"
        />
      </div>
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
import {RecommendationTemplateService} from "@/domains/recommendations/services/recommendation-template.serivce.js";

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
      templates: [], // Debes cargar las plantillas de recomendaciones si es necesario
      loading: false,
      assigning: false,
      currentUserId: 1, // Debes obtenerlo del contexto real
      editingRecommendation: null,
      editDialogVisible: false,
      recommendationService: new RecommendationService(),
      firstLoad: true
    }
  },
  methods: {
    async loadTemplates() {
      // Aquí deberías cargar las plantillas de recomendaciones si es necesario
      // Por ahora, lo dejamos vacío
      const service = new RecommendationTemplateService();
      this.templates = await service.getAll();
    },
    async autoAssignRecommendations() {
      if (!this.firstLoad && this.recommendations.length > 0) {
        // Solo permitir si es por botón, no en el mounted
        this.assigning = true;
        try {
          const request = new AutoAssignRecommendationsRequest({
            userId: this.currentUserId,
            count: 3
          });
          await this.recommendationService.autoAssignRecommendations(request);
          await this.loadUserRecommendations();
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
      } else if (this.firstLoad && this.recommendations.length === 0) {
        // Primera vez, auto-assign
        this.assigning = true;
        try {
          const request = new AutoAssignRecommendationsRequest({
            userId: this.currentUserId,
            count: 3
          });
          await this.recommendationService.autoAssignRecommendations(request);
          await this.loadUserRecommendations();
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron asignar recomendaciones',
            life: 3000
          });
        } finally {
          this.assigning = false;
          this.firstLoad = false;
        }
      }
    },

    async loadUserRecommendations() {
      this.loading = true;
      try {
        const data = await this.recommendationService.getByUserId(this.currentUserId);
        this.recommendations = Array.isArray(data) ? data.map(rec => new Recommendation(rec)) : [];
      } catch (error) {
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
    await this.loadTemplates();
    await this.loadUserRecommendations();
    if (this.recommendations.length === 0) {
      await this.autoAssignRecommendations();
    }
    this.firstLoad = false;
  }
}
</script>

<style scoped>
.recommendations-page {
  padding: 2rem;
  background: #f7f8fa;
  min-height: 100vh;
}
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
.empty-state {
  text-align: center;
  margin-top: 3rem;
}
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}
.recommendation-card {
  border-radius: 2rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;
  border: none;
  padding: 1.5rem 1.2rem;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: fadeInCard 0.5s;
}
.recommendation-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 3px 12px rgba(0,0,0,0.08);
  transform: translateY(-4px) scale(1.02);
}
@keyframes fadeInCard {
  from { opacity: 0; transform: scale(0.98);}
  to { opacity: 1; transform: scale(1);}
}
.recommendation-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.recommendation-card p {
  font-size: 1rem;
  color: #444;
  margin: 0.3rem 0;
}
.actions-row {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
.load-btn {
  border-radius: 1.5rem;
  background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%);
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(33,147,176,0.12);
  transition: background 0.2s;
}
.load-btn:hover {
  background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
}

@media (max-width: 768px) {
  .recommendations-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>