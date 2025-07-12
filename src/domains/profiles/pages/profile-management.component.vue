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

      <div class="col-12 md:col-4">
        <profile-form
            :profile="profile"
            :objectives="objectives"
            :activity-levels="activityLevels"
            @saved="refreshProfile"/>
      </div>

      <div class="col-12 md:col-4">
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

const loadData = async () => {
  try {
    profile.value = await profileService.getByUserId(userId);
  } catch {
    profile.value = {}; // No hay perfil creado aún
  }

  objectives.value = await objectiveService.getAll();
  activityLevels.value = await activityLevelService.getAll();
};

const refreshProfile = async () => {
  profile.value = await profileService.getByUserId(userId);
};

onMounted(loadData);
</script>

<style scoped>
.profile-management {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
