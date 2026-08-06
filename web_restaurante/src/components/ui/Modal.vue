<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title">{{ title }}</h3>
                <button @click="closeModal" class="modal-close">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <slot />
            </div>
            <div v-if="$slots.footer" class="modal-footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    title: String,
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
}

.modal-container {
    background: white;
    border-radius: var(--radius-lg);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
    animation: scaleIn 0.3s ease-out;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 2px solid var(--primary-100);
}

.modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--primary-900);
}

.modal-close {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    transition: all var(--transition-fast);
}

.modal-close:hover {
    color: var(--primary-500);
    transform: rotate(90deg);
}

.modal-close svg {
    width: 24px;
    height: 24px;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>