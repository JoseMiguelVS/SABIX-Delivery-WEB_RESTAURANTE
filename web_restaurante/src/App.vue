<template>
  <div id="app">
    <Navbar v-if="authStore.isAuthenticated" />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Navbar from '@/components/layout/Navbar.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});
</script>