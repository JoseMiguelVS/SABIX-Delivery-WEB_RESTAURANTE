import { AUTH_MESSAGES } from '@/constants/authMessages'

// Validaciones básicas
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPassword = (password) => {
  return password && password.length >= 6
}

const isValidName = (name) => {
  return name && name.trim().length >= 3 && name.trim().length <= 50
}

const isValidUsername = (username) => {
  return username && username.trim().length >= 3 && username.trim().length <= 30
}

const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return phone && phoneRegex.test(phone)
}

const isValidAddress = (address) => {
  return address && address.trim().length >= 5 && address.trim().length <= 200
}

const isValidBankAccount = (account) => {
  // Validación básica - al menos 8 dígitos
  const accountRegex = /^[0-9]{8,20}$/
  return account && accountRegex.test(account.replace(/\s/g, ''))
}

const isValidSchedule = (schedule) => {
  return schedule && schedule.trim().length >= 5
}

// Validar registro completo
export const validateRegister = (form) => {
  // Nombre completo
  if (!form.full_name || !form.full_name.trim()) {
    return { isValid: false, field: 'full_name', message: AUTH_MESSAGES.NAME_REQUIRED }
  }
  if (!isValidName(form.full_name)) {
    return { isValid: false, field: 'full_name', message: AUTH_MESSAGES.NAME_LENGTH }
  }

  // Username
  if (!form.username || !form.username.trim()) {
    return { isValid: false, field: 'username', message: AUTH_MESSAGES.USERNAME_REQUIRED }
  }
  if (!isValidUsername(form.username)) {
    return { isValid: false, field: 'username', message: AUTH_MESSAGES.USERNAME_LENGTH }
  }

  // Email
  if (!form.email || !form.email.trim()) {
    return { isValid: false, field: 'email', message: AUTH_MESSAGES.EMAIL_REQUIRED }
  }
  if (!isValidEmail(form.email)) {
    return { isValid: false, field: 'email', message: AUTH_MESSAGES.EMAIL_INVALID }
  }

  // Teléfono (opcional pero si se envía debe ser válido)
  if (form.phone && !isValidPhone(form.phone)) {
    return { isValid: false, field: 'phone', message: AUTH_MESSAGES.PHONE_INVALID }
  }

  // Dirección (opcional pero si se envía debe ser válida)
  if (form.address && !isValidAddress(form.address)) {
    return { isValid: false, field: 'address', message: AUTH_MESSAGES.ADDRESS_LENGTH }
  }

  // Cuenta bancaria (opcional)
  if (form.bank_account && !isValidBankAccount(form.bank_account)) {
    return { isValid: false, field: 'bank_account', message: AUTH_MESSAGES.BANK_ACCOUNT_INVALID }
  }

  // Horario (opcional)
  if (form.schedule && !isValidSchedule(form.schedule)) {
    return { isValid: false, field: 'schedule', message: AUTH_MESSAGES.SCHEDULE_INVALID }
  }

  // Contraseña
  if (!form.password) {
    return { isValid: false, field: 'password', message: AUTH_MESSAGES.PASSWORD_REQUIRED }
  }
  if (!isValidPassword(form.password)) {
    return { isValid: false, field: 'password', message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH }
  }

  //Confirmar contraseña
  if (!form.confirm_password) {
    return {
      isValid: false,
      field: 'confirm_password',
      message: AUTH_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    }
  }
  if (form.password !== form.confirm_password) {
    return { isValid: false, field: 'confirm_password', message: AUTH_MESSAGES.PASSWORDS_MISMATCH }
  }

  return { isValid: true }
}

// Validar campo específico
export const validateField = (field, value, form = {}) => {
  switch (field) {
    case 'full_name':
      if (!value || !value.trim()) {
        return { isValid: false, message: AUTH_MESSAGES.NAME_REQUIRED }
      }
      if (!isValidName(value)) {
        return { isValid: false, message: AUTH_MESSAGES.NAME_LENGTH }
      }
      break

    case 'username':
      if (!value || !value.trim()) {
        return { isValid: false, message: AUTH_MESSAGES.USERNAME_REQUIRED }
      }
      if (value.trim().length < 3) {
        return { isValid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
      }
      if (!isValidUsername(value)) {
        return { isValid: false, message: AUTH_MESSAGES.USERNAME_LENGTH }
      }
      break

    case 'email':
      if (!value || !value.trim()) {
        return { isValid: false, message: AUTH_MESSAGES.EMAIL_REQUIRED }
      }
      if (!isValidEmail(value)) {
        return { isValid: false, message: AUTH_MESSAGES.EMAIL_INVALID }
      }
      break

    case 'phone':
      if (value && !isValidPhone(value)) {
        return { isValid: false, message: AUTH_MESSAGES.PHONE_INVALID }
      }
      break

    case 'address':
      if (value && !isValidAddress(value)) {
        return { isValid: false, message: AUTH_MESSAGES.ADDRESS_LENGTH }
      }
      break

    case 'bank_account':
      if (value && !isValidBankAccount(value)) {
        return { isValid: false, message: AUTH_MESSAGES.BANK_ACCOUNT_INVALID }
      }
      break

    case 'schedule':
      if (value && !isValidSchedule(value)) {
        return { isValid: false, message: AUTH_MESSAGES.SCHEDULE_INVALID }
      }
      break

    case 'password':
      if (!value) {
        return { isValid: false, message: AUTH_MESSAGES.PASSWORD_REQUIRED }
      }
      if (!isValidPassword(value)) {
        return { isValid: false, message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH }
      }
      break

    case 'password2':
      if (!value) {
        return { isValid: false, message: AUTH_MESSAGES.PASSWORD_REQUIRED }
      }
      if (!isValidPassword(value)) {
        return { isValid: false, message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH }
      }
      break

    case 'confirm_password':
      if (!value) {
        return { isValid: false, message: AUTH_MESSAGES.CONFIRM_PASSWORD_REQUIRED }
      }
      if (value !== form.password) {
        return { isValid: false, message: AUTH_MESSAGES.PASSWORDS_MISMATCH }
      }
      break

    default:
      return { isValid: true }
  }

  return { isValid: true }
}

// Validar login
export const validateLogin = (form) => {
  //Validar username
  if (!form.username || !form.username.trim()) {
    return { isValid: false, message: 'El nombre de usuario es obligatorio' };
  }
  if (form.username.trim().length < 3) {
    return { isValid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }
  //Validar password
  if (!form.password) {
    return { isValid: false, message: AUTH_MESSAGES.PASSWORD_REQUIRED }
  }
  if (!isValidPassword(form.password)) {
    return { isValid: false, message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH }
  }
  //Validar password2 (confirmación)
  if (!form.password2) {
    return { isValid: false, message: 'Por favor, confirma tu contraseña' };
  }
  if (form.password !== form.password2) {
    return { isValid: false, message: 'Las contraseñas no coinciden' };
  }
  return { isValid: true }
}

// Validar coincidencia de contraseñas
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: AUTH_MESSAGES.CONFIRM_PASSWORD_REQUIRED }
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: AUTH_MESSAGES.PASSWORDS_MISMATCH }
  }
  return { isValid: true }
}

// Validar verificación de username/email
export const validateUsername = (username) => {
  if (!username || !username.trim()) {
    return { isValid: false, message: AUTH_MESSAGES.USERNAME_REQUIRED }
  }
  if (!isValidUsername(username)) {
    return { isValid: false, message: AUTH_MESSAGES.USERNAME_LENGTH }
  }
  return { isValid: true }
}
