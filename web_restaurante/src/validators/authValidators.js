import { AUTH_MESSAGES } from '@/constants/authMessages'

/**
 * Validar email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar contraseña (mínimo 6 caracteres)
 */
const isValidPassword = (password) => {
  return password && password.length >= 6
}

/**
 * Validar nombre (mínimo 2 caracteres)
 */
const isValidName = (name) => {
  return name && name.trim().length >= 2
}

/**
 * Validar formulario de login
 */
export const validateLogin = (form) => {
  if (!form.email || !form.email.trim()) {
    return { isValid: false, message: AUTH_MESSAGES.EMAIL_REQUIRED }
  }

  if (!isValidEmail(form.email)) {
    return { isValid: false, message: AUTH_MESSAGES.EMAIL_INVALID }
  }

  if (!form.password) {
    return { isValid: false, message: AUTH_MESSAGES.PASSWORD_REQUIRED }
  }

  if (!isValidPassword(form.password)) {
    return { isValid: false, message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH }
  }

  return { isValid: true }
}

/**
 * Validar formulario de registro
 */
export const validateRegister = (form) => {
  if (!form.name || !form.name.trim()) {
    return { isValid: false, message: AUTH_MESSAGES.NAME_REQUIRED }
  }

  if (!isValidName(form.name)) {
    return { isValid: false, message: AUTH_MESSAGES.NAME_MIN_LENGTH }
  }

  if (!form.email || !form.email.trim()) {
    return { isValid: false, message: AUTH_MESSAGES.EMAIL_REQUIRED }
  }

  if (!isValidEmail(form.email)) {
    return { isValid: false, message: AUTH_MESSAGES.EMAIL_INVALID }
  }

  if (!form.password) {
    return { isValid: false, message: AUTH_MESSAGES.PASSWORD_REQUIRED }
  }

  if (!isValidPassword(form.password)) {
    return { isValid: false, message: AUTH_MESSAGES.PASSWORD_MIN_LENGTH }
  }

  return { isValid: true }
}

/**
 * Validar coincidencia de contraseñas
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: AUTH_MESSAGES.CONFIRM_PASSWORD_REQUIRED }
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: AUTH_MESSAGES.PASSWORDS_MISMATCH }
  }

  return { isValid: true }
}

/**
 * Validar campo específico
 */
export const validateField = (field, value, form = {}) => {
  switch (field) {
    case 'email':
      if (!value || !value.trim()) {
        return { isValid: false, message: AUTH_MESSAGES.EMAIL_REQUIRED }
      }
      if (!isValidEmail(value)) {
        return { isValid: false, message: AUTH_MESSAGES.EMAIL_INVALID }
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

    case 'name':
      if (!value || !value.trim()) {
        return { isValid: false, message: AUTH_MESSAGES.NAME_REQUIRED }
      }
      if (!isValidName(value)) {
        return { isValid: false, message: AUTH_MESSAGES.NAME_MIN_LENGTH }
      }
      break

    case 'confirmPassword':
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
