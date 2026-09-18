<script setup lang="ts">

const emit = defineEmits<{
    navigate: [sectionId: string];
}>();

const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="site-footer">
        <div class="footer-top">
            <img :src="'/kinnor-logo.avif'" alt="Kinnor Coffee" />
            <p>COFFEE / COCKTAILS / COMMUNITY<br />NEW BRAUNFELS, TEXAS</p>
            <button @click="emit('navigate', 'top')">BACK TO THE TOP ↑</button>
        </div>

        <div class="footer-word" aria-hidden="true">KINNOR</div>

        <div class="footer-bottom">
            <span>SMALL SHOP. BIG FEELING.</span>
            <span>COZY. COFFEE. COMFORTABLE. KINNOR.</span>
            <span>© {{ currentYear }} KINNOR COFFEE</span>
        </div>
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

.footer-top {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 2rem;
}

.footer-top img {
    width: 120px;
}

.footer-top p {
    margin: 0;
    font-size: .62rem;
    line-height: 1.6;
    text-align: center;
    letter-spacing: .08em;
}

.footer-top button {
    justify-self: end;
    padding: .8rem 1rem;
    color: var(--cream) !important;
    border: 1px solid var(--cream);
    background: transparent;
    font-size: .61rem;
    cursor: pointer;
    transition: color .2s, background .2s;
}

.footer-top button:hover {
    color: var(--ink) !important;
    background: var(--lime);
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    padding-top: 1.2rem;
    border-top: 1px solid rgba(244, 240, 232, .4);
    font-size: .56rem;
    letter-spacing: .08em;
}

@media (max-width: 900px) {
    .footer-top {
        grid-template-columns: 1fr auto;
    }

    .footer-top p {
        display: none;
    }
}

@media (max-width: 560px) {
    .footer-word {
        font-size: 29vw;
    }

    .footer-bottom {
        gap: 1rem;
    }

    .footer-bottom span:first-child {
        display: none;
    }
}

</style>
