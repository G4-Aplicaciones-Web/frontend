<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignUpRequest} from "../model/sign-up.request.js";

export default {
  name: "sign-up",
  data() {
    return {
      authenticationStore: useAuthenticationStore(),
      username: "",
      password: "",
    };
  },
  methods: {
    onSignUp() {
      let signUpRequest = new SignUpRequest(this.username, this.password);
      this.authenticationStore.signUp(signUpRequest, this.$router);
    }
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <i class="pi pi-user-plus"></i>
        <h2>{{ $t('auth.sign_up.title') }}</h2>
        <p>{{ $t('auth.sign_up.subtitle') }}</p>
      </div>
      
      <form @submit.prevent="onSignUp" class="auth-form">
        <div class="form-field">
          <label for="username" class="field-label">
            <i class="pi pi-user"></i> {{ $t('auth.sign_up.username') }}
          </label>
          <pv-input-text 
            id="username" 
            v-model="username" 
            :class="{'p-invalid': !username}"
            class="styled-input"
            :placeholder="$t('auth.sign_up.username_placeholder')"
          />
          <small v-if="!username" class="p-error">
            {{ $t('auth.sign_up.username_required') }}
          </small>
        </div>
        
        <div class="form-field">
          <label for="password" class="field-label">
            <i class="pi pi-lock"></i> {{ $t('auth.sign_up.password') }}
          </label>
          <pv-input-text 
            id="password" 
            v-model="password" 
            :class="{'p-invalid': !password}" 
            type="password"
            class="styled-input"
            :placeholder="$t('auth.sign_up.password_placeholder')"
          />
          <small v-if="!password" class="p-error">
            {{ $t('auth.sign_up.password_required') }}
          </small>
        </div>
        
        <pv-button 
          type="submit" 
          class="auth-button"
          icon="pi pi-user-plus"
        >
          {{ $t('auth.sign_up.button') }}
        </pv-button>
      </form>
      
      <div class="auth-footer">
        <p>{{ $t('auth.sign_up.have_account') }} <router-link to="/sign-in" class="auth-link">{{ $t('auth.sign_up.sign_in_link') }}</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color) 20%, var(--primary-color-hover) 80%);
  padding: 20px;
}

.auth-card {
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  min-width: 400px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.auth-header h2 {
  color: var(--text-color);
}

.auth-header p {
  color: var(--text-color-light);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.field-label i {
  color: var(--primary-color);
}

.styled-input {
  border-radius: 8px !important;
  border: 2px solid var(--border-color) !important;
  padding: 1rem 1.25rem !important;
  font-family: 'Poppins', sans-serif !important;
  font-size: 1rem !important;
  transition: all 0.2s ease !important;
}

.styled-input:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 3px rgba(99, 182, 99, 0.1) !important;
}

.styled-input.p-invalid {
  border-color: #e53e3e !important;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
}

.p-error {
  color: #e53e3e;
  font-size: 0.8rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.p-error::before {
  content: '⚠';
}

.auth-button {
  background: var(--primary-color) !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 1rem 2rem !important;
  font-family: 'Poppins', sans-serif !important;
  font-weight: 500 !important;
  font-size: 1rem !important;
  margin-top: 1rem;
  color: white !important;
  width: 100% !important;
  transition: all 0.2s ease !important;
}

.auth-button:hover {
  background: var(--primary-color-hover) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 182, 99, 0.3) !important;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-color);
}

.auth-footer p {
  color: var(--text-color-light);
}

.auth-link {
  color: var(--primary-color);
  font-weight: 500;
}

.auth-link:hover {
  color: var(--primary-color-hover);
}

@media (max-width: 768px) {
  .auth-card {
    padding: 2rem 1.5rem;
    margin: 0.5rem;
  }
}
</style>