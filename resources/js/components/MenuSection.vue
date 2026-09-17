<script lang="ts">
</script>

<template>
    <section id="menu" class="menu-section">
        <div class="menu-orbit" aria-hidden="true">MENU MENU MENU MENU MENU MENU</div>
        <div class="menu-orbit-lol" aria-hidden="true">MENU MENU MENU MENU MENU MENU</div>

    </section>

</template>

<style scoped>
.menu-section {
    position: relative;
    overflow: hidden;
    padding: 9rem 4vw;
    background: var(--cream);
}

.menu-orbit {
    position: absolute;
    right: 0rem;
    top: 2rem;
    width: 230px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    color: var(--orange);
    border: 2px dashed var(--ink);
    border-radius: 50%;
    font-family: "Syne", sans-serif;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: .1em;
    text-align: center;
    animation: spin 12s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 900px) {
    .menu-section {
        padding: 7rem 1.25rem;
    }

    .menu-orbit {
        opacity: .25;
    }
}
</style>
