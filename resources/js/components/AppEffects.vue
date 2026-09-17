<script setup lang="ts">
</script>

<template>
    <div class="cursor-orb" aria-hidden="true"></div>
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
}

@media (max-width: 900px) {
    .cursor-orb {
        display: none;
    }
}

</style>
