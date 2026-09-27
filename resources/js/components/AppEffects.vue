<script setup lang="ts">
import type { ClickBurst } from "../types/kinnor";

defineProps<{
    bursts: ClickBurst[];
    scrollProgress: number;
}>();
</script>

<template>
    <TransitionGroup name="burst">
        <span
            v-for="burst in bursts"
            :key="burst.id"
            class="click-burst"
            :style="{ left: `${burst.x}px`, top: `${burst.y}px` }"
            aria-hidden="true"
        >{{ burst.glyph }}</span>
    </TransitionGroup>

    <div class="cursor-orb" aria-hidden="true"><span>POUR</span></div>

    <div
        class="page-progress"
        :style="{ transform: `scaleX(${scrollProgress})` }"
        aria-hidden="true"
    ></div>
</template>

<style scoped>

.cursor-orb {
    position: fixed;
    top: -30px;
    left: -30px;
    z-index: 9000;
    width: 60px;
    height: 60px;
    display: grid;
    pointer-events: none;
    border: 2px solid var(--cream);
    border-radius: 50%;
    color: var(--ink);
    background: var(--lime);
    mix-blend-mode: difference;
    place-items: center;
    font-size: 0.54rem;
    font-weight: 700;
    letter-spacing: 0.08em;
}

.click-burst {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
    color: var(--lime);
    font-size: 2rem;
    text-shadow: 2px 2px 0 var(--ink);
    transform: translate(-50%, -50%);
}

.burst-enter-active,
.burst-leave-active {
    transition: transform 0.8s cubic-bezier(.17, .84, .44, 1), opacity 0.8s;
}

.burst-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0) rotate(-60deg);
}

.burst-leave-to {
    opacity: 0;
    transform: translate(-50%, -140%) scale(1.8) rotate(70deg);
}

.page-progress {
    position: fixed;
    inset: 0 0 auto;
    z-index: 9998;
    height: 5px;
    background: var(--orange);
    transform-origin: left;
}

@media (max-width: 900px) {
    .cursor-orb {
        display: none;
    }
}

</style>
