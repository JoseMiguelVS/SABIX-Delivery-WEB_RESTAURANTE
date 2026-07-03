import { ref, reactive, watch } from 'vue'

/**
 * Composable para manejar formularios genéricos
 */
export function useForm(initialData = {}, validators = {}) {
  // Estado del formulario
  const form = reactive({ ...initialData })
  const errors = ref({})
  const isSubmitting = ref(false)
  const isValid = ref(false)

  // Estado de campos tocados
  const touched = ref({})

  /**
   * Validar un campo específico
   */
  const validateField = (field) => {
    if (validators[field]) {
      const result = validators[field](form[field], form)
      if (!result.isValid) {
        errors.value[field] = result.message
        return false
      } else {
        delete errors.value[field]
        return true
      }
    }
    return true
  }

  /**
   * Validar todo el formulario
   */
  const validateForm = () => {
    let isValidForm = true
    const fields = Object.keys(validators)

    fields.forEach((field) => {
      const result = validators[field](form[field], form)
      if (!result.isValid) {
        errors.value[field] = result.message
        isValidForm = false
      } else {
        delete errors.value[field]
      }
    })

    isValid.value = isValidForm
    return isValidForm
  }

  /**
   * Marcar todos los campos como tocados
   */
  const markAllTouched = () => {
    Object.keys(form).forEach((key) => {
      touched.value[key] = true
    })
  }

  /**
   * Resetear el formulario
   */
  const resetForm = (newData = null) => {
    if (newData) {
      Object.assign(form, newData)
    } else {
      Object.assign(form, initialData)
    }
    errors.value = {}
    touched.value = {}
    isValid.value = false
  }

  /**
   * Manejar cambio de campo
   */
  const handleFieldChange = (field) => {
    touched.value[field] = true
    validateField(field)
    validateForm()
  }

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (submitCallback) => {
    markAllTouched()
    const isValidForm = validateForm()

    if (!isValidForm) {
      return { success: false, errors: errors.value }
    }

    isSubmitting.value = true

    try {
      const result = await submitCallback(form)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isSubmitting.value = false
    }
  }

  // Watch para validación en tiempo real
  watch(
    form,
    () => {
      validateForm()
    },
    { deep: true },
  )

  return {
    form,
    errors,
    isValid,
    isSubmitting,
    touched,
    validateField,
    validateForm,
    resetForm,
    handleFieldChange,
    handleSubmit,
    markAllTouched,
  }
}
