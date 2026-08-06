<template>
  <div class="delivery-person-card" :class="{ 'delivery-person-card-selected': selected }"
    @click="$emit('select', deliveryPerson)">
    <div class="delivery-person-info">
      <div class="delivery-person-avatar">
        {{ deliveryPerson.full_name?.charAt(0) || 'D' }}
      </div>
      <div class="delivery-person-details">
        <div class="delivery-person-name">
          {{ deliveryPerson.full_name || deliveryPerson.username }}
          <span class="delivery-person-rating">⭐ {{ deliveryPerson.rating || 'N/A' }}</span>
        </div>
        <div class="delivery-person-meta">
          <span class="delivery-person-distance">📏 {{ deliveryPerson.distance_km }} km</span>
          <span class="delivery-person-time">⏱️ {{ deliveryPerson.estimated_time }} min</span>
          <span class="delivery-person-deliveries">📦 {{ deliveryPerson.completed_deliveries || 0 }} entregas</span>
        </div>
        <div class="delivery-person-phone">📱 {{ deliveryPerson.phone || 'Sin teléfono' }}</div>
      </div>
    </div>
    <div class="delivery-person-status">
      <span v-if="deliveryPerson.is_available" class="status-available">✅ Disponible</span>
      <span v-else class="status-unavailable">❌ No disponible</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  deliveryPerson: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>

<style scoped>
.delivery-person-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  margin-bottom: 8px;
}

.delivery-person-card:hover {
  border-color: #bc4ab9;
  box-shadow: 0 2px 8px rgba(126, 9, 126, 0.1);
}

.delivery-person-card-selected {
  border-color: #7e097e;
  background: #fa8bf5;
  box-shadow: 0 2px 8px rgba(126, 9, 126, 0.2);
}

.delivery-person-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.delivery-person-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #7e097e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
}

.delivery-person-details {
  flex: 1;
}

.delivery-person-name {
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.delivery-person-rating {
  font-size: 12px;
  color: #f59e0b;
  font-weight: 500;
}

.delivery-person-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  flex-wrap: wrap;
}

.delivery-person-phone {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.delivery-person-status {
  flex-shrink: 0;
  margin-left: 12px;
}

.status-available {
  padding: 4px 12px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.status-unavailable {
  padding: 4px 12px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 640px) {
  .delivery-person-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .delivery-person-status {
    margin-left: 0;
    width: 100%;
  }

  .delivery-person-status span {
    display: block;
    text-align: center;
  }
}
</style>
