<template>
    <div class="p-6 max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <button @click="goBack"
                class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clip-rule="evenodd" />
                </svg>
                Volver
            </button>
            <div class="flex gap-2">
                <button @click="goToEdit"
                    class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg class="w-4 h-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                </button>
                <button @click="confirmDelete"
                    class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    <svg class="w-4 h-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                    Eliminar
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin">
            </div>
            <p class="mt-3 text-sm text-gray-500">Cargando usuario...</p>
        </div>

        <!-- Detalle -->
        <div v-else-if="user">
            <!-- Perfil -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div class="flex items-center gap-6">
                    <div class="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-semibold"
                        :style="{ background: getAvatarColor(user.name) }">
                        {{ getInitials(user.name) }}
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
                        <p class="text-sm text-gray-500">{{ user.email }}</p>
                        <div class="flex gap-2 mt-2">
                            <span class="px-2 py-1 text-xs rounded-full" :class="{
                                'bg-primary-100 text-primary-900': user.role === 'admin',
                                'bg-blue-100 text-blue-800': user.role === 'user',
                                'bg-yellow-100 text-yellow-800': user.role === 'editor'
                            }">
                                {{ getRoleLabel(user.role) }}
                            </span>
                            <span class="px-2 py-1 text-xs rounded-full" :class="{
                                'bg-green-100 text-green-800': user.status === 'active',
                                'bg-red-100 text-red-800': user.status === 'inactive'
                            }">
                                {{ getStatusLabel(user.status) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detalles -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-sm font-semibold text-gray-900 mb-4">Información Personal</h3>
                    <div class="space-y-3">
                        <div>
                            <span class="text-xs text-gray-500">Nombre completo</span>
                            <p class="text-sm text-gray-900">{{ user.name }}</p>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500">Correo electrónico</span>
                            <p class="text-sm text-gray-900">{{ user.email }}</p>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500">Teléfono</span>
                            <p class="text-sm text-gray-900">{{ user.phone || 'No especificado' }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-sm font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
                    <div class="space-y-3">
                        <div>
                            <span class="text-xs text-gray-500">Rol</span>
                            <p class="text-sm text-gray-900">{{ getRoleLabel(user.role) }}</p>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500">Estado</span>
                            <p class="text-sm">
                                <span class="px-2 py-1 text-xs rounded-full" :class="{
                                    'bg-green-100 text-green-800': user.status === 'active',
                                    'bg-red-100 text-red-800': user.status === 'inactive'
                                }">
                                    {{ getStatusLabel(user.status) }}
                                </span>
                            </p>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500">Fecha de registro</span>
                            <p class="text-sm text-gray-900">{{ formatDateFull(user.createdAt) }}</p>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500">Último acceso</span>
                            <p class="text-sm text-gray-900">{{ formatDateFull(user.lastLogin) || 'Nunca' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="bg-white rounded-xl max-w-md w-full mx-4 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirmar Eliminación</h3>
                <p class="text-sm text-gray-600">
                    ¿Estás seguro de que deseas eliminar al usuario <strong>{{ user?.name }}</strong>?
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
import { useUserDetail } from '../composables/useUserDetail';
import { getInitials, getAvatarColor, getRoleLabel, getStatusLabel, formatDateFull } from '../utils/userUtils';

defineOptions({ name: 'UserDetail' });

const {
    user,
    isLoading,
    isDeleting,
    showDeleteModal,
    goBack,
    goToEdit,
    confirmDelete,
    deleteUser
} = useUserDetail();
</script>