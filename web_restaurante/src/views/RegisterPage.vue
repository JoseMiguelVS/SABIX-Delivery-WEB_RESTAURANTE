<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2 class="login-title">Registrar</h2>
        <p class="login-subtitle">Crea tu cuenta</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Nombre Completo -->
        <div class="form-group">
          <label class="form-label required">Nombre Completo</label>
          <input v-model="registerForm.full_name" type="text" required class="form-control"
            :class="{ error: touched.full_name && errors.full_name }" placeholder="Juan Pérez"
            @blur="validateField('full_name')" />
          <span v-if="touched.full_name && errors.full_name" class="field-error">
            {{ errors.full_name }}
          </span>
        </div>

        <!-- Nombre de Usuario -->
        <div class="form-group">
          <label class="form-label required">Nombre de Usuario</label>
          <div class="input-with-validation">
            <input v-model="registerForm.username" type="text" required class="form-control" :class="{
              error: (touched.username && errors.username) ||
                (usernameAvailable === false),
              success: usernameAvailable === true
            }" placeholder="usuario123" @blur="validateField('username')" />
            <div v-if="checkingUsername" class="validation-spinner">
              <svg class="spinner-small" viewBox="0 0 24 24">
                <circle class="spinner-track" cx="12" cy="12" r="10" />
                <path class="spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <span v-if="usernameAvailable === true" class="validation-success">
              ✓ Disponible
            </span>
            <span v-else-if="usernameAvailable === false" class="validation-error">
              ✗ No disponible
            </span>
          </div>
          <span v-if="touched.username && errors.username" class="field-error">
            {{ errors.username }}
          </span>
        </div>

        <!-- Correo Electrónico -->
        <div class="form-group">
          <label class="form-label required">Correo Electrónico</label>
          <div class="input-with-validation">
            <input v-model="registerForm.email" type="email" required class="form-control" :class="{
              error: (touched.email && errors.email) ||
                (emailAvailable === false),
              success: emailAvailable === true
            }" placeholder="tu@email.com" @blur="validateField('email')" />
            <div v-if="checkingEmail" class="validation-spinner">
              <svg class="spinner-small" viewBox="0 0 24 24">
                <circle class="spinner-track" cx="12" cy="12" r="10" />
                <path class="spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <span v-if="emailAvailable === true" class="validation-success">
              ✓ Disponible
            </span>
            <span v-else-if="emailAvailable === false" class="validation-error">
              ✗ Ya registrado
            </span>
          </div>
          <span v-if="touched.email && errors.email" class="field-error">
            {{ errors.email }}
          </span>
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input v-model="registerForm.phone" type="tel" class="form-control"
            :class="{ error: touched.phone && errors.phone }" placeholder="+56 9 1234 5678"
            @blur="validateField('phone')" />
          <span v-if="touched.phone && errors.phone" class="field-error">
            {{ errors.phone }}
          </span>
        </div>

        <!-- Dirección -->
        <div class="form-group">
          <label class="form-label">Dirección</label>
          <input v-model="registerForm.address" type="text" class="form-control"
            :class="{ error: touched.address && errors.address }" placeholder="Calle Principal #123"
            @blur="validateField('address')" />
          <span v-if="touched.address && errors.address" class="field-error">
            {{ errors.address }}
          </span>
        </div>

        <!-- Cuenta Bancaria -->
        <div class="form-group">
          <label class="form-label">Cuenta Bancaria</label>
          <input v-model="registerForm.bank_account" type="text" class="form-control"
            :class="{ error: touched.bank_account && errors.bank_account }" placeholder="1234567890"
            @blur="validateField('bank_account')" />
          <span v-if="touched.bank_account && errors.bank_account" class="field-error">
            {{ errors.bank_account }}
          </span>
        </div>

        <!-- Horario de Atención -->
        <div class="form-group">
          <label class="form-label">Horario de Atención</label>
          <input v-model="registerForm.schedule" type="text" class="form-control"
            :class="{ error: touched.schedule && errors.schedule }" placeholder="Lun-Vie 9:00-18:00"
            @blur="validateField('schedule')" />
          <span v-if="touched.schedule && errors.schedule" class="field-error">
            {{ errors.schedule }}
          </span>
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label class="form-label required">Contraseña</label>
          <div class="password-wrapper">
            <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" required
              class="form-control password-input" :class="{ error: touched.password && errors.password }"
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
          <div class="password-hint">Mínimo 6 caracteres</div>
          <span v-if="touched.password && errors.password" class="field-error">
            {{ errors.password }}
          </span>
        </div>

        <!-- Confirmar Contraseña (password2) -->
        <div class="form-group">
          <label class="form-label required">Confirmar Contraseña</label>
          <div class="password-wrapper">
            <input v-model="registerForm.confirm_password" :type="showPassword ? 'text' : 'password'" required
              class="form-control password-input"
              :class="{ error: touched.confirm_password && errors.confirm_password }" placeholder="••••••••"
              @blur="validateField('confirm_password')" />
          </div>
          <span v-if="touched.confirm_password && errors.confirm_password" class="field-error">
            {{ errors.confirm_password }}
          </span>
        </div>

        <!-- Mensajes -->
        <div v-if="error" class="error-message">
          <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          {{ error }}
        </div>
        <div v-if="success" class="success-message">
          <svg class="success-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          {{ success }}
        </div>

        <!-- Botón Registro -->
        <button type="submit" :disabled="isLoading || usernameAvailable === false || emailAvailable === false"
          class="btn btn-primary btn-block btn-lg">
          <span v-if="isLoading" class="btn-loading">
            <span class="btn-spinner">
              <svg viewBox="0 0 24 24">
                <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="spinner-path" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
            Registrando...
          </span>
          <span v-else>Registrarse</span>
        </button>

        <!-- Login Link -->
        <div class="login-link">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="link-primary">Inicia sesión</router-link>
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
  name: 'RegisterPage'
});

const {
  registerForm,
  isLoading,
  error,
  success,
  showPassword,
  checkingUsername,
  checkingEmail,
  usernameAvailable,
  emailAvailable,
  handleRegister,
} = useAuth();

const touched = ref({});
const errors = ref({});

const validateField = (field) => {
  touched.value[field] = true;
  const result = validateFieldValidator(field, registerForm[field], registerForm);
  if (!result.isValid) {
    errors.value[field] = result.message;
  } else {
    delete errors.value[field];
  }
};

const handleSubmit = async () => {
  // Marcar todos como tocados
  Object.keys(registerForm).forEach(key => {
    touched.value[key] = true;
    validateField(key);
  });

  // Si hay errores, no enviar
  if (Object.keys(errors.value).length > 0) {
    return;
  }

  // Verificar username y email disponibles
  if (usernameAvailable.value === false) {
    error.value = 'El nombre de usuario no está disponible';
    return;
  }
  if (emailAvailable.value === false) {
    error.value = 'El correo electrónico ya está registrado';
    return;
  }

  if (registerForm.password !== registerForm.confirm_password) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  await handleRegister();
};
</script>
