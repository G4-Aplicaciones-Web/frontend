<script>
import { useAuthenticationStore} from "@/domains/iam/services/authentication.store.js";

export default {
  name: 'recipe-form',
  props: {
    recipe: {
      type: Object,
      required: true
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        description: '',
        userId: 0, // Se llenará automáticamente
        recipeType: 0,
        urlInstructions: ''
      }
    };
  },
  mounted() {
    const authStore = useAuthenticationStore();
    this.formData.userId = authStore.currentUserId;
    this.syncFormData();
    console.log('Formulario montado con recipe:', this.recipe);
  },
  watch: {
    recipe: {
      handler(newRecipe) {
        const allowedFields = ['name', 'description', 'userId', 'recipeType', 'urlInstructions'];
        this.formData = allowedFields.reduce((acc, key) => {
          acc[key] = newRecipe[key] ?? '';
          return acc;
        }, {});
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    syncFormData() {
      if (this.recipe) {
        const allowedFields = ['name', 'description', 'userId', 'recipeType', 'urlInstructions'];
        this.formData = allowedFields.reduce((acc, key) => {
          acc[key] = this.recipe[key] ?? '';
          return acc;
        }, {});
      }
    },
    submitForm(event) {
      // Ensure we prevent default form submission
      console.log('submitForm fue llamado');
      console.log('formData justo antes de emitir:', this.formData);
      if (event) {
        event.preventDefault();
      }

      // Validate form data
      if (!this.formData.name || !this.formData.description) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
      }

      // Ensure all numeric fields are numbers and not strings
      const recipeData = {
        ...this.formData
      };

      console.log('formData justo antes de emitir:', this.formData);

      // Emit the event with the recipe data
      this.$emit('submit', recipeData);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<template>
  <div class="recipe-form">
    <!-- Eliminamos @submit.prevent y usamos @click en el botón de submit -->
    <form>
      <div class="form-group">
        <label for="name">{{ $t('recipeForm.title') }}</label>
        <input
            type="text"
            id="name"
            v-model="formData.name"
            class="form-control"
            required
            :disabled="disabled"
        />
      </div>

      <div class="form-group">
        <label for="description">{{ $t('recipeForm.description') }}</label>
        <textarea
            id="description"
            v-model="formData.description"
            class="form-control"
            rows="5"
            required
            :disabled="disabled"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="urlInstructions">{{ $t('recipeForm.urlInstructions') }}</label>
        <input
            type="text"
            id="urlInstructions"
            v-model="formData.urlInstructions"
            class="form-control"
            :disabled="disabled"
        />
      </div>

      <div class="form-group">
        <label for="recipeType">{{ $t('recipeForm.recipeType') }}</label>
        <input
            type="number"
            id="recipeType"
            v-model.number="formData.recipeType"
            class="form-control"
            min="0"
            :disabled="disabled"
        />
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="cancel" :disabled="disabled">
          {{ $t('common.cancel') }}
        </button>
        <button type="button" class="btn btn-primary" @click="() => { console.log('Click en botón'); submitForm(); }" :disabled="disabled">
          {{ isEditing ? $t('common.update') : $t('common.create') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.recipe-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.25);
}

input[type="number"] {
  text-align: right;
}

.nutrition-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2e7d32;
  font-size: 1.2rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #3e8e41;
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #333;
}

.btn-secondary:hover {
  background-color: #ddd;
}
</style>