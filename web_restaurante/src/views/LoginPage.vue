<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-wrapper">
          <img src="@/assets/icons/logo.jpeg" alt="Logo" class="logo-image" />
          <h1 class="app-title"> Delivery</h1>
        </div>
        <h2 class="login-title">Iniciar Sesión</h2>
        <p class="login-subtitle">Accede a tu cuenta para continuar</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">

        <div class="form-group">
          <label for="username" class="form-label">
            <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            Nombre de Usuario
          </label>
          <input id="username" v-model="loginForm.username" type="text" required class="form-input"
            :class="{ error: touched.username && errors.username }" placeholder="usuario123"
            @blur="validateField('username')" />
          <span v-if="touched.username && errors.username" class="field-error">
            {{ errors.username }}
          </span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd" />
            </svg>
            Contraseña
          </label>
          <div class="password-wrapper">
            <input id="password" v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" required
              class="form-input password-input" :class="{ error: touched.password && errors.password }"
              placeholder="••••••••" @blur="validateField('password')" />
            <button type="button" @click="showPassword = !showPassword" class="password-toggle">
              <svg v-if="showPassword" class="eye-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd" />
              </svg>
              <svg v-else class="eye-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.78zm4.261 4.261l1.514 1.514a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <span v-if="touched.password && errors.password" class="field-error">
            {{ errors.password }}
          </span>
        </div>

        <div class="form-group">
          <label for="password2" class="form-label">
            <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd" />
            </svg>
            Confirmar Contraseña
          </label>
          <div class="password-wrapper">
            <input id="password2" v-model="loginForm.password2" :type="showPassword ? 'text' : 'password'" required
              class="form-input password-input" :class="{ error: touched.password2 && errors.password2 }"
              placeholder="••••••••" @blur="validateField('password2')" />
          </div>
          <span v-if="touched.password2 && errors.password2" class="field-error">
            {{ errors.password2 }}
          </span>
        </div>

        <div class="form-options">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="rememberMe" class="checkbox-input" />
            <span class="checkbox-label">Recordarme</span>
          </label>
          <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
        </div>

        <!-- Mensajes de error/éxito -->
        <div v-if="error" class="error-message">
          <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          {{ error }}
        </div>

        <button type="submit" :disabled="isSubmitting" class="btn btn-primary btn-block btn-lg">
          <span v-if="isSubmitting" class="btn-loading">
            <span class="btn-spinner">
              <svg viewBox="0 0 24 24">
                <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="spinner-path" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
            Iniciando sesión...
          </span>
          <span v-else>Iniciar Sesión</span>
        </button>

        <div class="register-link">
          ¿No tienes cuenta?
          <router-link to="/register" class="link-primary">Regístrate aquí</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { validateField as validateFieldValidator } from '@/validators/authValidators';

defineOptions({
  name: 'LoginPage'
});

// Usar el composable de autenticación
const {
  loginForm,
  showPassword,
  rememberMe,
  isLoading: isSubmitting,
  error,
  handleLogin,
} = useAuth();

// Estado de validación local
const touched = ref({});
const errors = ref({});

// Validar campo
const validateField = (field) => {
  touched.value[field] = true;
  const result = validateFieldValidator(field, loginForm[field]);
  if (!result.isValid) {
    errors.value[field] = result.message;
  } else {
    delete errors.value[field];
  }
};

// Manejar submit
const handleSubmit = async () => {
  // Marcar todos como tocados
  Object.keys(loginForm).forEach(key => {
    touched.value[key] = true;
    validateField(key);
  });

  // Verificar que las contraseñas coincidan ANTES de enviar
  if (loginForm.password !== loginForm.password2) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  // Si hay errores, no enviar
  if (Object.keys(errors.value).length > 0) {
    return;
  }

  await handleLogin();
};
</script>
