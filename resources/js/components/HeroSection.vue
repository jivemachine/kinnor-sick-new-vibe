<script setup lang="ts">
const emit = defineEmits<{
    navigate: [sectionId: string];
}>();
</script>

<template>
    <section id="top" class="hero">
        <div class="hero__spotlight" aria-hidden="true"></div>
        <div class="hero__noise"></div>
        <p class="hero__eyebrow">540 S CASTEL AVE - NEW BRAUNFELS, TEXAS</p>

        <div class="hero__title-wrap" aria-label="Kinnor">
            <h1 class="hero__title" aria-hidden="true">
                <span v-for="letter in 'KINNOR'.split('')" :key="letter" class="hero-letter">{{ letter }}</span>
            </h1>
        </div>

    </section>
</template>

<style scoped>
.hero {
    position: relative;
    min-height: 100svh;
    overflow: hidden;
    padding: 9.5rem 3vw 3rem;
    color: var(--cream);
    background: var(--blue);
    isolation: isolate;
}

.hero__spotlight {
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
        radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(71, 116, 255, .52), transparent 28%),
        radial-gradient(circle at 17% 27%, rgba(255, 130, 169, .23), transparent 18%),
        var(--blue);
}

.hero__noise {
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0.24;
    background-image:
        radial-gradient(circle at 30% 40%, rgba(255, 255, 255, .45) 0 1px, transparent 1.5px),
        radial-gradient(circle at 60% 70%, rgba(0, 0, 0, .35) 0 1px, transparent 1.5px);
    background-size: 9px 11px, 13px 15px;
    mix-blend-mode: soft-light;
}

.hero__eyebrow {
    margin: 0 1 1.2rem;
    font-size: clamp(.58rem, .8vw, .74rem);
    letter-spacing: .16em;
}

.hero__title-wrap {
    position: relative;
}

.hero__title {
    display: flex;
    margin: 0;
    overflow: hidden;
    color: var(--cream);
    font-family: "Bebas Neue", Impact, sans-serif;
    font-size: clamp(9rem, 24.3vw, 25rem);
    font-weight: 400;
    line-height: .68;
    letter-spacing: -0.3em;
    white-space: nowrap;
}

.hero-letter {
    display: inline-block;
}
</style>
