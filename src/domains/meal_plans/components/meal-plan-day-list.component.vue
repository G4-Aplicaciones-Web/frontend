<template>
  <div class="meals-list-container">
    <div class="list-header">
      <i class="pi pi-list"></i>
      <h3>{{ $t('meal_plan_day.title') }}</h3>
      <span class="meal-count">{{ meals.length }} {{ meals.length === 1 ? $t('meal_plan_day.list.meals_count') : $t('meal_plan_day.list.meals_count_plural') }}</span>
    </div>
    
    <div v-if="meals.length" class="meals-grid">
      <div 
        v-for="meal in meals" 
        :key="meal.id" 
        class="meal-card"
      >
        <div class="meal-header">
          <div class="meal-type">
            <i :class="getMealIcon(meal.meal_plan_type_id)"></i>
            <span>{{ getMealType(meal.meal_plan_type_id) }}</span>
          </div>
          <div class="day-badge">
            {{ $t('meal_plan_day.list.day') }} {{ meal.day_number }}
          </div>
        </div>
        
        <div class="meal-content">
          <div class="recipe-info">
            <i class="pi pi-book"></i>
            <span>{{ $t('meal_plan_day.list.recipe') }}{{ meal.recipe_id }}</span>
          </div>
        </div>
        
        <div class="meal-actions">
          <pv-button
            icon="pi pi-pencil"
            severity="info"
            outlined
            size="small"
            @click="$emit('edit', meal)"
            :v-tooltip="$t('meal_plan_day.list.edit_tooltip')"
          />
          <pv-button
            icon="pi pi-trash"
            severity="danger"
            outlined
            size="small"
            @click="$emit('remove', meal.id)"
            :v-tooltip="$t('meal_plan_day.list.delete_tooltip')"
          />
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <i class="pi pi-inbox empty-icon"></i>
      <h4>{{ $t('meal_plan_day.list.empty_title') }}</h4>
      <p>{{ $t('meal_plan_day.list.empty_message') }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ meals: Array });

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const getMealType = (id) => {
  const types = {
    1: t('meal_plan_day.form.breakfast').replace('🌅 ', ''),
    2: t('meal_plan_day.form.lunch').replace('🌞 ', ''),
    3: t('meal_plan_day.form.dinner').replace('🌙 ', '')
  };
  return types[id] || 'Unknown';
};

const getMealIcon = (id) => {
  const icons = {
    1: 'pi pi-sun',
    2: 'pi pi-circle-fill',
    3: 'pi pi-moon'
  };
  return icons[id] || 'pi pi-circle';
};
</script>

<style scoped>
.meals-list-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-header i {
  font-size: 1.2rem;
}

.list-header h3 {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
  flex: 1;
}

.meal-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.meals-grid {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.meal-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s ease;
}

.meal-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.meal-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
}

.meal-type i {
  color: #6366f1;
  font-size: 1rem;
}

.day-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.meal-content {
  margin-bottom: 16px;
}

.recipe-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.9rem;
}

.recipe-info i {
  color: #9ca3af;
}

.meal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  color: #374151;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .meals-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .list-header {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .meal-count {
    order: 3;
    flex-basis: 100%;
    text-align: center;
    margin-top: 8px;
  }
  
  .meal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .day-badge {
    align-self: flex-end;
  }
}
</style>