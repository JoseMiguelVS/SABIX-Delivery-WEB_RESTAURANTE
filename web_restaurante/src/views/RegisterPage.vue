<template>
  <div class="register-container">
    <main class="register-main">
      <!-- Left Panel -->
      <div class="register-panel">
        <div class="shape-1"></div>
        <div class="shape-2"></div>
        <div class="shape-3"></div>
        <div class="panel-content">
          <div class="tab-login" @click="$router.push('/login')">LOGIN</div>
          <div class="tab-register">REGISTER</div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="form-panel">
        <div class="form-wrapper">
          <!-- Avatar -->
          <div class="avatar">
            <i class="fa-regular fa-user">
              <img src="@/assets/icons/logo-letras.jpeg" alt="Logo" class="logo-image" />
            </i>
          </div>
          <h1 class="form-title">REGISTRO</h1>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="register-form">
            <!-- Full Name -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.full_name" type="text" placeholder="Nombre Completo" required
                class="form-input" :class="{ error: touched.full_name && errors.full_name }"
                @blur="validateField('full_name')" />
            </div>
            <span v-if="touched.full_name && errors.full_name" class="field-error">
              {{ errors.full_name }}
            </span>

            <!-- Username -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.username" type="text" placeholder="Usuario" required class="form-input"
                :class="{
                  error: (touched.username && errors.username) || usernameAvailable === false,
                  success: usernameAvailable === true
                }" @blur="validateField('username')" @input="checkUsername" />
              <div v-if="checkingUsername" class="validation-spinner">
                <i class="fa-solid fa-spinner fa-spin"></i>
              </div>
              <span v-if="usernameAvailable === true" class="validation-success">
                <i class="fa-solid fa-check"></i> Disponible
              </span>
              <span v-else-if="usernameAvailable === false" class="validation-error">
                <i class="fa-solid fa-xmark"></i> No disponible
              </span>
            </div>
            <span v-if="touched.username && errors.username" class="field-error">
              {{ errors.username }}
            </span>

            <!-- Email -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.email" type="email" placeholder="Correo Electrónico" required
                class="form-input" :class="{
                  error: (touched.email && errors.email) || emailAvailable === false,
                  success: emailAvailable === true
                }" @blur="validateField('email')" @input="checkEmail" />
              <div v-if="checkingEmail" class="validation-spinner">
                <i class="fa-solid fa-spinner fa-spin"></i>
              </div>
              <span v-if="emailAvailable === true" class="validation-success">
                <i class="fa-solid fa-check"></i> Disponible
              </span>
              <span v-else-if="emailAvailable === false" class="validation-error">
                <i class="fa-solid fa-xmark"></i> Ya registrado
              </span>
            </div>
            <span v-if="touched.email && errors.email" class="field-error">
              {{ errors.email }}
            </span>

            <!-- Phone -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.phone" type="tel" placeholder="Teléfono" class="form-input"
                :class="{ error: touched.phone && errors.phone }" @blur="validateField('phone')" />
            </div>
            <span v-if="touched.phone && errors.phone" class="field-error">
              {{ errors.phone }}
            </span>

            <!-- Address -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.address" type="text" placeholder="Dirección" class="form-input"
                :class="{ error: touched.address && errors.address }" @blur="validateField('address')" />
            </div>
            <span v-if="touched.address && errors.address" class="field-error">
              {{ errors.address }}
            </span>

            <!-- Bank Account -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.bank_account" type="text" placeholder="Cuenta Bancaria" class="form-input"
                :class="{ error: touched.bank_account && errors.bank_account }" @blur="validateField('bank_account')" />
            </div>
            <span v-if="touched.bank_account && errors.bank_account" class="field-error">
              {{ errors.bank_account }}
            </span>

            <!-- Restaurant Name -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.restaurant_name" type="text" placeholder="Nombre del Restaurante"
                class="form-input" :class="{ error: touched.restaurant_name && errors.restaurant_name }"
                @blur="validateField('restaurant_name')" />
            </div>
            <span v-if="touched.restaurant_name && errors.restaurant_name" class="field-error">
              {{ errors.restaurant_name }}
            </span>

            <!-- Schedule -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.schedule" type="text" placeholder="Horario" class="form-input"
                :class="{ error: touched.schedule && errors.schedule }" @blur="validateField('schedule')" />
            </div>
            <span v-if="touched.schedule && errors.schedule" class="field-error">
              {{ errors.schedule }}
            </span>

            <!-- Password -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
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
            <div class="password-hint">Mínimo 6 caracteres</div>
            <span v-if="touched.password && errors.password" class="field-error">
              {{ errors.password }}
            </span>

            <!-- Confirm Password -->
            <div class="input-group">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </svg>
              <input v-model="registerForm.confirm_password" :type="showPassword ? 'text' : 'password'"
                placeholder="Confirmar Contraseña" required class="form-input"
                :class="{ error: touched.confirm_password && errors.confirm_password }"
                @blur="validateField('confirm_password')" />
            </div>
            <span v-if="touched.confirm_password && errors.confirm_password" class="field-error">
              {{ errors.confirm_password }}
            </span>

            <!-- Actions -->
            <div class="form-actions">
              <router-link to="/login" class="register-link">
                ¿Ya tienes cuenta?
              </router-link>
              <button type="submit" :disabled="isLoading || usernameAvailable === false || emailAvailable === false"
                class="btn-register">
                <span v-if="isLoading" class="spinner-wrapper">
                  <i class="fa-solid fa-spinner fa-spin"></i>
                </span>
                <span v-else>REGISTRARSE</span>
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

const checkUsername = () => { };
const checkEmail = () => { };

const handleSubmit = async () => {
  Object.keys(registerForm).forEach(key => {
    touched.value[key] = true;
    validateField(key);
  });

  if (Object.keys(errors.value).length > 0) {
    return;
  }

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
