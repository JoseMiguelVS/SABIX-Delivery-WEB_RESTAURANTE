<template>
    <button :class="[
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-loading': loading }
    ]" :disabled="loading || disabled" @click="$emit('click')">
        <span v-if="loading" class="btn-spinner">
            <svg viewBox="0 0 24 24">
                <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="spinner-path" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        </span>
        <slot v-else />
    </button>
</template>

<script setup>
defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value),
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
    loading: Boolean,
    disabled: Boolean,
});

defineEmits(['click']);
</script>

<style scoped>
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Variantes */
.btn-primary {
    background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(126, 9, 126, 0.4);
    transform: translateY(-2px);
}

.btn-secondary {
    background: var(--primary-500);
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background: var(--primary-700);
    box-shadow: 0 4px 12px rgba(188, 74, 185, 0.3);
    transform: translateY(-2px);
}

.btn-outline {
    background: transparent;
    color: var(--primary-500);
    border: 2px solid var(--primary-500);
}

.btn-outline:hover:not(:disabled) {
    background: var(--primary-100);
    border-color: var(--primary-700);
    color: var(--primary-700);
}

.btn-ghost {
    background: transparent;
    color: var(--primary-500);
}

.btn-ghost:hover:not(:disabled) {
    background: var(--primary-100);
    color: var(--primary-700);
}

.btn-danger {
    background: #dc2626;
    color: white;
}

.btn-danger:hover:not(:disabled) {
    background: #b91c1c;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    transform: translateY(-2px);
}

/* Tamaños */
.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
}

.btn-md {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.btn-lg {
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
}

/* Loading state */
.btn-loading {
    position: relative;
}

.btn-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-spinner svg {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
}

.spinner-track {
    opacity: 0.25;
}

.spinner-path {
    opacity: 0.75;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Efecto ripple */
.btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn:active:not(:disabled)::after {
    width: 300px;
    height: 300px;
}
</style>