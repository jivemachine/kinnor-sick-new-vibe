<script setup lang="ts">
withDefaults(defineProps<{
    message: string;
    tone?: "lime" | "pink";
    reverse?: boolean;
}>(), {
    tone: "lime",
    reverse: false,
});
</script>

<template>
    <div
        class="ticker"
        :class="[`ticker--${tone}`, { 'ticker--reverse': reverse }]"
        aria-hidden="true"
    >
        <div class="ticker__track">
            <span v-for="copy in 8" :key="copy">{{ message }}</span>
        </div>
    </div>
</template>

<style scoped>
.ticker {
    position: relative;
    z-index: 5;
    overflow: hidden;
    padding: .74rem 0;
    color: var(--ink);
    border-block: var(--line);
    background: var(--lime);
    transform: rotate(-1.3deg) scale(1.03);
}

.ticker--pink {
    background: var(--pink);
    transform: rotate(1.1deg) scale(1.03);
}

.ticker__track {
    display: flex;
    width: max-content;
    animation: ticker 35s linear infinite;
}

.ticker--reverse .ticker__track {
    animation-direction: reverse;
    animation-duration: 42s;
}

.ticker__track span {
    font-family: "Syne", sans-serif;
    font-size: clamp(1rem, 1.8vw, 1.6rem);
    font-weight: 800;
    white-space: nowrap;
}

@keyframes ticker {
    to {
        transform: translateX(-50%);
    }
}
</style>

