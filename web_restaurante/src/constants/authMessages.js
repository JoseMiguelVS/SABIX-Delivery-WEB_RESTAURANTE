export const AUTH_MESSAGES = {
  // Login
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGIN_ERROR: 'Credenciales incorrectas. Por favor, intenta nuevamente.',
  
  // Register
  REGISTER_SUCCESS: '¡Registro exitoso! Redirigiendo al login...',
  REGISTER_ERROR: 'Error al registrar usuario. Por favor, intenta nuevamente.',
  
  // Validación - Nombre
  NAME_REQUIRED: 'El nombre completo es obligatorio',
  NAME_LENGTH: 'El nombre debe tener entre 3 y 50 caracteres',
  
  // Validación - Username
  USERNAME_REQUIRED: 'El nombre de usuario es obligatorio',
  USERNAME_LENGTH: 'El nombre de usuario debe tener entre 3 y 30 caracteres',
  USERNAME_TAKEN: 'Este nombre de usuario ya está en uso',
  
  // Validación - Email
  EMAIL_REQUIRED: 'El correo electrónico es obligatorio',
  EMAIL_INVALID: 'Por favor, ingresa un correo electrónico válido',
  EMAIL_TAKEN: 'Este correo electrónico ya está registrado',
  
  // Validación - Contraseña
  PASSWORD_REQUIRED: 'La contraseña es obligatoria',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 6 caracteres',
  CONFIRM_PASSWORD_REQUIRED: 'Por favor, confirma tu contraseña',
  PASSWORDS_MISMATCH: 'Las contraseñas no coinciden',
  
  // Validación - Teléfono
  PHONE_INVALID: 'Por favor, ingresa un número de teléfono válido',
  
  // Validación - Dirección
  ADDRESS_LENGTH: 'La dirección debe tener al menos 5 caracteres',
  
  // Validación - Cuenta bancaria
  BANK_ACCOUNT_INVALID: 'Por favor, ingresa un número de cuenta bancaria válido (mínimo 8 dígitos)',
  
  // Validación - Horario
  SCHEDULE_INVALID: 'Por favor, ingresa un horario de atención válido',
  
  // General
  CONNECTION_ERROR: 'Error de conexión. Por favor, verifica tu internet e intenta nuevamente.',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
};