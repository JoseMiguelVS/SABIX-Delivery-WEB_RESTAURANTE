<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
                <p class="text-sm text-gray-500">Gestiona los usuarios del sistema</p>
            </div>
            <button @click="goToCreate"
                class="inline-flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-900 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg">
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clip-rule="evenodd" />
                </svg>
                Nuevo Usuario
            </button>
        </div>

        <!-- Filtros -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1 relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd" />
                </svg>
                <input v-model="searchTerm" type="text"
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Buscar usuarios..." @input="handleSearch" />
            </div>
            <div class="flex gap-2">
                <select v-model="filterRole"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @change="handleFilter">
                    <option value="">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                    <option value="editor">Editor</option>
                </select>
                <select v-model="filterStatus"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @change="handleFilter">
                    <option value="">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                </select>
            </div>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Loading -->
            <div v-if="isLoading" class="text-center py-12">
                <div
                    class="inline-block w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin">
                </div>
                <p class="mt-3 text-sm text-gray-500">Cargando usuarios...</p>
            </div>

            <!-- Empty -->
            <div v-else-if="users.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 mx-auto text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
                <p class="text-sm text-gray-500">Comienza creando tu primer usuario</p>
                <button @click="goToCreate"
                    class="mt-4 px-4 py-2 bg-primary-700 text-white text-sm rounded-lg hover:bg-primary-900">
                    Crear Usuario
                </button>
            </div>

            <!-- Tabla -->
            <table v-else class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Usuario</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registro</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                    :style="{ background: getAvatarColor(user.name) }">
                                    {{ getInitials(user.name) }}
                                </div>
                                <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 text-xs rounded-full" :class="{
                                'bg-primary-100 text-primary-900': user.role === 'admin',
                                'bg-blue-100 text-blue-800': user.role === 'user',
                                'bg-yellow-100 text-yellow-800': user.role === 'editor'
                            }">
                                {{ getRoleLabel(user.role) }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 text-xs rounded-full" :class="{
                                'bg-green-100 text-green-800': user.status === 'active',
                                'bg-red-100 text-red-800': user.status === 'inactive'
                            }">
                                {{ getStatusLabel(user.status) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <button @click="goToDetail(user.id)"
                                    class="p-1 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded transition-colors"
                                    title="Ver">
                                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <button @click="goToEdit(user.id)"
                                    class="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                    title="Editar">
                                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button @click="confirmDelete(user)"
                                    class="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    title="Eliminar">
                                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Paginación -->
            <div v-if="users.length > 0"
                class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span class="text-sm text-gray-500">
                    Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} -
                    {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}
                    de {{ filteredUsers.length }} usuarios
                </span>
                <div class="flex items-center gap-2">
                    <button :disabled="currentPage === 1" @click="currentPage--"
                        class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Anterior
                    </button>
                    <span class="px-3 py-1 text-sm font-medium text-primary-700">{{ currentPage }}</span>
                    <button :disabled="currentPage === totalPages" @click="currentPage++"
                        class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Siguiente
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="bg-white rounded-xl max-w-md w-full mx-4 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirmar Eliminación</h3>
                <p class="text-sm text-gray-600">
                    ¿Estás seguro de que deseas eliminar al usuario <strong>{{ userToDelete?.name }}</strong>?
                </p>
                <p class="text-sm text-red-600 mt-1">Esta acción no se puede deshacer.</p>

                <div class="flex justify-end gap-3 mt-6">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button @click="deleteUser" :disabled="isDeleting"
                        class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
                        {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserList } from '../composables/useUserList';
import { getInitials, getAvatarColor, getRoleLabel, getStatusLabel, formatDate } from '../utils/userUtils';

defineOptions({ name: 'UserList' });

const {
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
    deleteUser
} = useUserList();
</script>