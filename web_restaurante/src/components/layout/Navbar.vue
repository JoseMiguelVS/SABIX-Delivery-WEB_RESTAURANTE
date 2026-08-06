<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <button class="navbar-toggle" @click="$emit('toggle-sidebar')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 class="navbar-title">Sabix <span class="navbar-title-accent">Delivery</span></h1>
      </div>

      <div class="navbar-actions">
        <NotificationBell />
        <ThemeToggle />
        <div class="navbar-divider"></div>
        <div class="navbar-user">
          <div class="navbar-user-avatar-wrap">
            <div class="navbar-user-avatar">{{ userInitials }}</div>
            <span class="navbar-user-status" title="En línea"></span>
          </div>
          <span class="navbar-user-name">{{ userName }}</span>
        </div>
        <button class="navbar-logout" @click="handleLogout">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
          <span class="navbar-logout-text">Salir</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import NotificationBell from '@/components/notifications/NotificationBell.vue';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const userName = computed(() => {
  return user.value?.name || user.value?.full_name || user.value?.username || 'Usuario';
});

const userInitials = computed(() => {
  const name = userName.value;
  if (name === 'Usuario') return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

defineEmits(['toggle-sidebar']);
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-secondary);
  border-bottom: 1px solid color-mix(in srgb, var(--primary-900) 8%, transparent);
  box-shadow: var(--shadow-sm);
  height: 64px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 var(--spacing-6);
  height: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-shrink: 0;
}

.navbar-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.navbar-toggle:hover {
  background: var(--bg-primary);
  color: var(--primary-900);
}

.navbar-toggle svg {
  width: 24px;
  height: 24px;
}

.navbar-title {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
  white-space: nowrap;
  color: var(--text-primary);
}

.navbar-title-accent {
  font-weight: 500;
  color: var(--primary-700);
  font-size: 15px;
  letter-spacing: 0;
  margin-left: 2px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-shrink: 0;
}

.navbar-divider {
  width: 1px;
  height: 26px;
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--text-secondary) 25%, transparent), transparent);
  flex-shrink: 0;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-2) var(--spacing-1) var(--spacing-1);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
  cursor: default;
}

.navbar-user:hover {
  background: var(--bg-primary);
}

.navbar-user-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.navbar-user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-900));
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  user-select: none;
}

.navbar-user-status {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid var(--bg-secondary);
}

.navbar-user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-logout {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background: transparent;
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.navbar-logout svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.navbar-logout:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 var(--spacing-4);
  }

  .navbar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .navbar-title {
    font-size: 16px;
  }

  .navbar-title-accent {
    display: none;
  }

  .navbar-user-name {
    max-width: 80px;
  }

  .navbar-logout-text {
    display: none;
  }

  .navbar-logout {
    padding: var(--spacing-2) var(--spacing-2);
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 var(--spacing-3);
  }

  .navbar-actions {
    gap: var(--spacing-2);
  }

  .navbar-user-name {
    display: none;
  }

  .navbar-user {
    padding: var(--spacing-1);
  }

  .navbar-logout {
    padding: var(--spacing-2);
  }
}
</style>
