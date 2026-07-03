<template>
    <div class="register-container">
        <div class="register-card">
            <div class="register-header">
                <h2 class="register-title">Crear Cuenta</h2>
                <p class="register-subtitle">Regístrate para comenzar</p>
            </div>

            <form @submit.prevent="handleSubmit" class="register-form">
                <div class="form-group">
                    <label class="form-label">Nombre Completo</label>
                    <input v-model="registerForm.name" type="text" required class="form-control"
                        :class="{ error: touched.name && errors.name }" placeholder="Tu nombre"
                        @blur="validateField('name')" />
                    <span v-if="touched.name && errors.name" class="field-error">
                        {{ errors.name }}
                    </span>
                </div>

                <div class="form-group">
                    <label class="form-label">Correo Electrónico</label>
                    <input v-model="registerForm.email" type="email" required class="form-control"
                        :class="{ error: touched.email && errors.email }" placeholder="tu@email.com"
                        @blur="validateField('email')" />
                    <span v-if="touched.email && errors.email" class="field-error">
                        {{ errors.email }}
                    </span>
                </div>

                <div class="form-group">
                    <label class="form-label">Contraseña</label>
                    <input v-model="registerForm.password" type="password" required class="form-control"
                        :class="{ error: touched.password && errors.password }" placeholder="••••••••"
                        @blur="validateField('password')" />
                    <span v-if="touched.password && errors.password" class="field-error">
                        {{ errors.password }}
                    </span>
                </div>

                <div class="form-group">
                    <label class="form-label">Confirmar Contraseña</label>
                    <input v-model="registerForm.confirmPassword" type="password" required class="form-control"
                        :class="{ error: touched.confirmPassword && errors.confirmPassword }" placeholder="••••••••"
                        @blur="validateField('confirmPassword')" />
                    <span v-if="touched.confirmPassword && errors.confirmPassword" class="field-error">
                        {{ errors.confirmPassword }}
                    </span>
                </div>

                <!-- Mensajes -->
                <div v-if="error" class="error-message">{{ error }}</div>
                <div v-if="success" class="success-message">{{ success }}</div>

                <button type="submit" :disabled="isSubmitting" class="btn btn-primary btn-block btn-lg">
                    <span v-if="isSubmitting" class="btn-loading">
                        <span class="btn-spinner">
                            <svg viewBox="0 0 24 24">
                                <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="spinner-path" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </span>
                        Registrando...
                    </span>
                    <span v-else>Registrarse</span>
                </button>

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
    isLoading: isSubmitting,
    error,
    success,
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

    await handleRegister();
};
</script>