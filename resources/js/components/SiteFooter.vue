<script setup lang="ts">

const emit = defineEmits<{
    navigate: [sectionId: string];
}>();

</script>

<template>
    <footer class="site-footer">
        <div class="footer-word" aria-hidden="true">KINNOR</div>
    </footer>
</template>

<style scoped>

.site-footer {
    overflow: hidden;
    padding: 3rem 3vw 1.5rem;
    color: var(--cream);
    background: var(--ink);
}

.footer-word {
    margin: 3rem -1vw 0;
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(10rem, 27vw, 28rem);
    line-height: .67;
    letter-spacing: -.03em;
    text-align: center;
    white-space: nowrap;
}

@media (max-width: 560px) {
    .footer-word {
        font-size: 29vw;
    }
}

</style>
