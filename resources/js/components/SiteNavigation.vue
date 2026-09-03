<script setup lang="ts">
defineProps<{
    clock: string;
    isOpen: boolean;
}>();

const emit = defineEmits<{
    navigate: [sectionId: string];
    toggle: [];
}>();
</script>

<template>
    <header class="site-nav" :class="{ 'site-nav--open': isOpen }">
        <button class="brand-button" aria-label="Back to top" @click="emit('navigate', 'top')">
            <img :src="'/kinnor-logo.avif'" alt="Kinnor Coffee" />
        </button>

        <div class="nav-clock" aria-label="Current time in New Braunfels">
            <span class="status-dot" />
            NB, TX
            <strong>{{ clock }}</strong>
        </div>

        <nav class="nav-links" aria-label="Primary navigation">
            <!-- <button @click="emit('navigate', 'story')">Story</button> -->
            <!-- <button @click="emit('navigate', 'menu')">Menu-ish</button> -->
            <!-- <button @click="emit('navigate', 'visit')">Visit</button> -->
            <button>Menu-ish</button>
            <button>Visit</button>
        </nav>

        <button
            class="nav-toggle"
            :aria-expanded="isOpen"
            aria-label="Toggle navigation"
            @click="emit('toggle')"
        >
            <span>{{ isOpen ? "CLOSE" : "MENU" }}</span>
            <i />
        </button>
    </header>
</template>

<style scoped>
.site-nav {
    position: fixed;
    z-index: 100;
    inset: 0 0 auto;
    height: 78px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 1.5rem;
    color: var(--cream);
    border-bottom: 1px solid rgba(244, 240, 232, 0.38);
    background: rgba(31, 52, 66, 0.82);
    backdrop-filter: blur(14px);
}

.brand-button,
.nav-toggle,
.nav-links button {
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;
}

.brand-button {
    justify-self: start;
}

.brand-button img {
    width: 98px;
    display: block;
}

.nav-clock {
    display: flex;
    align-items: center;
    gap: 0.42rem;
    font-size: 0.64rem;
    letter-spacing: 0.08em;
}

.nav-clock strong {
    font-weight: 500;
    font-variant-numeric: tabular-nums;
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--lime);
    box-shadow: 0 0 0 4px rgba(240, 255, 84, .15);
    animation: pulse 1.7s ease-in-out infinite;
}

.nav-links {
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 1.4rem;
}

.nav-links button {
    position: relative;
    color: var(--cream);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.nav-links button::after {
    content: "";
    position: absolute;
    left: 0;
    right: 100%;
    bottom: -6px;
    height: 2px;
    background: var(--lime);
    transition: right .3s ease;
}

.nav-links button:hover::after {
    right: 0;
}

.nav-toggle {
    display: none;
}

@keyframes pulse {
    50% {
        opacity: .35;
        transform: scale(.7);
    }
}

@media (max-width: 900px) {
    .site-nav {
        grid-template-columns: 1fr auto;
        height: 68px;
    }

    .nav-clock {
        display: none;
    }

    .nav-links {
        position: absolute;
        inset: 68px 0 auto;
        display: none;
        padding: 2rem 1.5rem;
        border-bottom: 2px solid var(--ink);
        background: var(--lime);
    }

    .site-nav--open .nav-links {
        display: grid;
        gap: 1.4rem;
    }

    .nav-links button {
        color: var(--ink);
        font-family: "Bebas Neue", sans-serif;
        font-size: 2.8rem;
        text-align: left;
    }

    .nav-toggle {
        display: flex;
        align-items: center;
        gap: .65rem;
        color: var(--cream);
    }

    .nav-toggle span {
        font-size: .68rem;
    }

    .nav-toggle i {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--orange);
    }
}
</style>
