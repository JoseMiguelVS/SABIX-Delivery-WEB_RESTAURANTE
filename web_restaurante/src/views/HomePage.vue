<template>
    <div class="home-container">
        <div class="welcome-card">
            <div class="welcome-content">
                <h1 class="welcome-title">
                    ¡Hola, <span class="user-name">{{ user?.name || 'Usuario' }}</span>!
                </h1>
                <p class="welcome-subtitle">Bienvenido a tu panel de administración</p>
            </div>
            <div class="welcome-actions">
                <button class="btn btn-primary" @click="handleLogout">
                    <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

defineOptions({
    name: 'HomePage'
});

const router = useRouter();
const authStore = useAuthStore();

// Usuario actual
const user = computed(() => authStore.user);

// Cerrar sesión
const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
};
</script>

<style scoped>
.home-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 64px);
    /* Resta la altura del navbar */
    padding: 2rem;
}

.welcome-card {
    max-width: 600px;
    width: 100%;
    padding: 3rem 2.5rem;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    text-align: center;
}

.welcome-content {
    margin-bottom: 2rem;
}

.welcome-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.user-name {
    color: var(--primary-500);
}

.welcome-subtitle {
    font-size: 1.125rem;
    color: var(--text-secondary);
}

.welcome-actions {
    display: flex;
    justify-content: center;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1.5rem;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary-900), var(--primary-700));
    color: white;
}

.btn-primary:hover {
    box-shadow: 0 4px 12px rgba(126, 9, 126, 0.3);
    transform: translateY(-2px);
}

.btn-icon {
    width: 18px;
    height: 18px;
}

/* Responsive */
@media (max-width: 640px) {
    .welcome-card {
        padding: 2rem 1.5rem;
    }

    .welcome-title {
        font-size: 1.75rem;
    }

    .welcome-subtitle {
        font-size: 1rem;
    }

    .btn {
        width: 100%;
    }
}
</style>