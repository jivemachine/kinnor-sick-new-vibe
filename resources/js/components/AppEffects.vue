<script setup lang="ts">
</script>

<template>
    <div class="cursor-orb" aria-hidden="true"><span>POUR</span></div>
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

@media (max-width: 900px) {
    .cursor-orb {
        display: none;
    }
}

</style>
