<template>
  <div class="login-container">
    <main class="login-main">
      <!-- Left Panel -->
      <div class="login-panel">
        <div class="shape-1"></div>
        <div class="shape-2"></div>
        <div class="shape-3"></div>
        <div class="panel-content">
          <div class="tab-login">LOGIN</div>
          <div class="tab-register" @click="$router.push('/register')">REGISTER</div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="form-panel">
        <div class="form-wrapper">
          <!-- Avatar -->
          <div class="avatar">
            <i class="fa-regular fa-user">
              <img v-if="!isCollapsed" src="@/assets/icons/logo-letras.jpeg" alt="Logo" class="logo-image" />
            </i>
          </div>
          <h1 class="form-title">LOGIN</h1>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="login-form">
            <!-- Username -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="loginForm.username" type="text" placeholder="Usuario" required class="form-input"
                :class="{ error: touched.username && errors.username }" @blur="validateField('username')" />
            </div>
            <span v-if="touched.username && errors.username" class="field-error">
              {{ errors.username }}
            </span>

            <!-- Password -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                required class="form-input" :class="{ error: touched.password && errors.password }"
                @blur="validateField('password')" />

              <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                <svg v-if="!showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="1.5" />
                  <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3l18 18" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                  <path d="M6.7 6.7C3.8 8.7 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="1.5" />
                  <path d="M17.3 17.3C20.2 15.3 22 12 22 12s-3.5-7-10-7c-1.7 0-3.2.4-4.5 1" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="1.5" />
                </svg>
              </button>
            </div>
            <span v-if="touched.password && errors.password" class="field-error"> {{ errors.password }}

            </span> <!-- Confirm Password -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="loginForm.password2" :type="showPassword ? 'text' : 'password'"
                placeholder="Confirmar contraseña" required class="form-input"
                :class="{ error: touched.password2 && errors.password2 }" @blur="validateField('password2')" />
            </div>
            <span v-if="touched.password2 && errors.password2" class="field-error"> {{ errors.password2 }} </span>

            <!-- Actions -->
            <div class="form-actions">
              <router-link to="/register" class="register-link">
                ¿No tienes cuenta?
              </router-link>
              <button type="submit" :disabled="isLoading" class="btn-login">
                <span v-if="isLoading" class="spinner-wrapper">
                  <i class="fa-solid fa-spinner fa-spin"></i>
                </span>
                <span v-else>INICIAR SESIÓN</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <!-- Messages -->
    <div v-if="error" class="message error">
      <i class="fa-solid fa-circle-exclamation"></i>
      {{ error }}
    </div>
    <div v-if="success" class="message success">
      <i class="fa-solid fa-circle-check"></i>
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { validateField as validateFieldValidator } from '@/validators/authValidators';

defineOptions({
  name: 'LoginPage'
});

// const router = useRouter();
const {
  loginForm,
  showPassword,
  isLoading,
  error,
  success,
  handleLogin,
} = useAuth();

const touched = ref({});
const errors = ref({});

const validateField = (field) => {
  touched.value[field] = true;
  const result = validateFieldValidator(field, loginForm[field], loginForm);
  if (!result.isValid) {
    errors.value[field] = result.message;
  } else {
    delete errors.value[field];
  }
};

const handleSubmit = async () => {
  errors.value = {};

  Object.keys(loginForm).forEach(key => {
    touched.value[key] = true;
    validateField(key);
  });

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  if (loginForm.password !== loginForm.password2) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }


  await handleLogin();
};
</script>
