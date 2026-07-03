import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import userService from '../services/userService'

export function useUserDetail() {
  const route = useRoute()
  const router = useRouter()
  const userId = route.params.id

  const user = ref(null)
  const isLoading = ref(false)
  const isDeleting = ref(false)
  const showDeleteModal = ref(false)

  const loadUser = async () => {
    isLoading.value = true
    try {
      const response = await userService.getUserById(userId)
      user.value = response.data
    } catch (error) {
      console.error('Error al cargar usuario:', error)
    } finally {
      isLoading.value = false
    }
  }

  const goBack = () => router.push('/usuarios')
  const goToEdit = () => router.push(`/usuarios/${userId}/editar`)

  const confirmDelete = () => {
    showDeleteModal.value = true
  }

  const deleteUser = async () => {
    isDeleting.value = true
    try {
      await userService.deleteUser(userId)
      router.push('/usuarios')
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    } finally {
      isDeleting.value = false
      showDeleteModal.value = false
    }
  }

  onMounted(loadUser)

  return {
    user,
    isLoading,
    isDeleting,
    showDeleteModal,
    goBack,
    goToEdit,
    confirmDelete,
    deleteUser,
  }
}
