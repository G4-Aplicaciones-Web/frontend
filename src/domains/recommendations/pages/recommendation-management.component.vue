<script>
/**
 * Import the Recommendation entity model
 */
import {Recommendation} from "../model/recommendation.entity.js";

/**
 * Import the RecommendationService for API operations
 */
import {RecommendationService} from "../services/recommendation.service.js";

/**
 * Import the DataManager component
 */
import DataManager from "@/shared/components/data-manager.component.vue";

/**
 * Import the RecommendationItemCreateAndEditDialog component
 */
import RecommendationItemCreateAndEditDialog from "../components/recommendation-item-create-and-edit.component.vue";
import {Column as PvColumn} from "primevue";

/**
 * @component
 * @description Page component for managing nutritional recommendations
 */
export default {
  name: "recommendation-management",
  components: {PvColumn, RecommendationItemCreateAndEditDialog, DataManager},

  data() {
    return {
      title: {singular: "Recommendation", plural: "Recommendations"},
      recommendations: [],
      recommendation: new Recommendation({}),
      selectedRecommendations: [],
      recommendationService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    findIndexById(id) {
      return this.recommendations.findIndex(recommendation => recommendation.id === id);
    },

    onNewItem() {
      this.recommendation = new Recommendation({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onEditItem(item) {
      this.recommendation = new Recommendation({...item});
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    onDeleteItem(item) {
      this.recommendation = {...item};
      this.deleteRecommendation();
    },

    onDeleteSelectedItems(selectedItems) {
      this.selectedRecommendations = selectedItems;
      this.deleteSelectedRecommendations();
    },

    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    onSaveRequested(item) {
      this.submitted = true;
      if (item.reason.trim()) {
        this.recommendation = {...item};
        if (this.recommendation.id) {
          this.updateRecommendation();
        } else {
          this.createRecommendation();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },

    createRecommendation() {
      console.log('Creando recomendación:', this.recommendation);
      this.recommendationService.create(this.recommendation)
          .then(data => {
            let recommendation = new Recommendation(data);
            this.recommendations.push(recommendation);
            this.notifySuccessfulAction("Recommendation Created");
          })
          .catch(error => console.error('Error al crear:', error));
    },

    updateRecommendation() {
      console.log('Actualizando recomendación:', this.recommendation);
      this.recommendationService.update(this.recommendation.id, this.recommendation)
          .then(data => {
            let index = this.findIndexById(this.recommendation.id);
            this.recommendations[index] = new Recommendation(data);
            this.notifySuccessfulAction("Recommendation Updated");
          })
          .catch(error => console.error('Error al actualizar:', error));
    },

    deleteRecommendation() {
      this.recommendationService.delete(this.recommendation.id)
          .then(() => {
            let index = this.findIndexById(this.recommendation.id);
            this.recommendations.splice(index, 1);
            this.notifySuccessfulAction("Recommendation Deleted");
          })
          .catch(error => console.error('Error al eliminar:', error));
    },

    deleteSelectedRecommendations() {
      this.selectedRecommendations.forEach((recommendation) => {
        this.recommendationService.delete(recommendation.id)
            .then(() => {
              this.recommendations = this.recommendations.filter((t) => t.id !== recommendation.id);
            })
            .catch(error => console.error('Error al eliminar seleccionados:', error));
      });
      this.notifySuccessfulAction("Recommendations Deleted");
    }
  },

  created() {
    this.recommendationService = new RecommendationService();
    this.recommendationService.getAll()
        .then(data => {
          console.log('Datos recibidos:', data);
          this.recommendations = Array.isArray(data) ?
              data.map(recommendation => new Recommendation(recommendation)) : [];
        })
        .catch(error => console.error('Error al cargar recomendaciones:', error));
  }
}
</script>

<template>
  <div class="w-full">
    <data-manager :title="title"
                  :items="recommendations"
                  @new-item-requested="onNewItem"
                  @edit-item-requested="onEditItem($event)"
                  @delete-item-requested="onDeleteItem($event)"
                  @delete-selected-items-requested="onDeleteSelectedItems($event)">
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="ID" style="min-width: 8rem"/>
        <pv-column field="reason" header="Reason" style="min-width: 20rem"/>
        <pv-column field="time_of_day" header="Time of Day" style="min-width: 12rem"/>
        <pv-column field="notes" header="Notes" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="score" header="Score" style="min-width: 8rem"/>
        <pv-column field="status" header="Status" style="min-width: 10rem"/>
      </template>
    </data-manager>
    <recommendation-item-create-and-edit-dialog
        :edit="isEdit"
        :item="recommendation"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"/>
  </div>
</template>

<style scoped>
</style>