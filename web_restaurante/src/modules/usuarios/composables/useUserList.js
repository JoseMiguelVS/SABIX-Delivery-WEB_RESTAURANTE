import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import userService from '../services/userService'

export function useUserList() {
  const router = useRouter()

  const users = ref([])
  const isLoading = ref(false)
  const isDeleting = ref(false)
  const searchTerm = ref('')
  const filterRole = ref('')
  const filterStatus = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 10
  const showDeleteModal = ref(false)
  const userToDelete = ref(null)

  const filteredUsers = computed(() => {
    let result = users.value
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase()
      result = result.filter(
        (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
      )
    }
    if (filterRole.value) {
      result = result.filter((user) => user.role === filterRole.value)
    }
    if (filterStatus.value) {
      result = result.filter((user) => user.status === filterStatus.value)
    }
    return result
  })

  const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredUsers.value.slice(start, start + itemsPerPage)
  })

  const loadUsers = async () => {
    isLoading.value = true
    try {
      const response = await userService.getUsers()
      users.value = response.data
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      isLoading.value = false
    }
  }

  const handleSearch = () => {
    currentPage.value = 1
  }
  const handleFilter = () => {
    currentPage.value = 1
  }

  const goToCreate = () => router.push('/usuarios/nuevo')
  const goToDetail = (id) => router.push(`/usuarios/${id}`)
  const goToEdit = (id) => router.push(`/usuarios/${id}/editar`)

  const confirmDelete = (user) => {
    userToDelete.value = user
    showDeleteModal.value = true
  }

  const deleteUser = async () => {
    if (!userToDelete.value) return
    isDeleting.value = true
    try {
      await userService.deleteUser(userToDelete.value.id)
      await loadUsers()
      showDeleteModal.value = false
      userToDelete.value = null
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    } finally {
      isDeleting.value = false
    }
  }

  watch([filterRole, filterStatus], () => {
    currentPage.value = 1
  })
  onMounted(loadUsers)

  return {
    users,
    isLoading,
    isDeleting,
    searchTerm,
    filterRole,
    filterStatus,
    currentPage,
    itemsPerPage,
    showDeleteModal,
    userToDelete,
    filteredUsers,
    totalPages,
    paginatedUsers,
    handleSearch,
    handleFilter,
    goToCreate,
    goToDetail,
    goToEdit,
    confirmDelete,
    deleteUser,
  }
}
