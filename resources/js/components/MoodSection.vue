<script setup lang="ts">
import { computed, ref } from "vue";
import { moods } from "../content/kinnor";
import type { Mood } from "../types/kinnor";
import MoodPlayer from "./MoodPlayer.vue";

const selectedMood = ref("slow");
const player = ref<InstanceType<typeof MoodPlayer> | null>(null);
let lastMoodButton: HTMLButtonElement | null = null;

function selectMood(mood: Mood, event: MouseEvent) {
    selectedMood.value = mood.id;
    lastMoodButton = event.currentTarget as HTMLButtonElement;
    player.value?.tuneIn(mood);
}

function restoreMoodFocus() {
    lastMoodButton?.focus({ preventScroll: true });
}

const selected = computed(() => {
    return moods.find((mood) => mood.id === selectedMood.value) ?? moods[0];
});

function tiltCard(event: PointerEvent) {
    const card = event.currentTarget as HTMLElement;
    const bounds = card.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.setProperty("--tilt-x", `${verticalPosition * -8}deg`);
    card.style.setProperty("--tilt-y", `${horizontalPosition * 10}deg`);
}

function resetTilt(event: PointerEvent) {
    const card = event.currentTarget as HTMLElement;

    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
}
</script>

<template>
    <section id="moods" class="mood-section">
        <div class="section-label" data-reveal><span>02</span> PICK YOUR FREQUENCY</div>

        <div class="mood-header">
            <h2 data-reveal>WHAT KIND<br />OF <em>DAY</em><br />IS IT?</h2>
            <div class="frequency-card" :style="{ backgroundColor: selected.color }" data-reveal>
                <small>CURRENTLY TUNED TO</small>
                <strong>{{ selected.frequency }}</strong>
                <span>↗ CLICK A CARD TO RETUNE</span>
            </div>
        </div>

        <div class="mood-grid">
            <button
                v-for="(mood, index) in moods"
                :key="mood.id"
                class="mood-card"
                type="button"
                :aria-pressed="selectedMood === mood.id"
                :class="{ 'mood-card--active': selectedMood === mood.id }"
                :style="{ '--mood': mood.color }"
                @click.stop="selectMood(mood, $event)"
                @pointermove="tiltCard"
                @pointerleave="resetTilt"
            >
                <span class="mood-card__index">0{{ index + 1 }}</span>
                <time>{{ mood.time }}</time>
                <div>
                    <h3>{{ mood.title }}</h3>
                    <p>{{ mood.note }}</p>
                </div>
                <span class="mood-card__select">
                    {{ selectedMood === mood.id ? "TUNED ✓" : "TUNE IN ↗" }}
                </span>
            </button>
        </div>
        <MoodPlayer ref="player" @close="restoreMoodFocus" />
    </section>
</template>

<style scoped>
.mood-section {
    padding: 8rem 4vw 10rem;
    color: var(--cream);
    background: var(--blue-dark);
}

.section-label {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 4.5rem;
    font-size: .68rem;
    letter-spacing: .16em;
}

.section-label span {
    width: 34px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    color: var(--ink);
    border-radius: 50%;
    background: var(--lime);
}

.mood-header {
    display: grid;
    grid-template-columns: 1fr 320px;
    align-items: end;
    gap: 4rem;
    margin-bottom: 5rem;
}

.mood-header h2 {
    margin: 0;
    color: var(--cream);
    font-family: "Bebas Neue", Impact, sans-serif;
    font-size: clamp(5.5rem, 11vw, 11rem);
    font-weight: 400;
    line-height: .8;
    letter-spacing: -.025em;
}

.mood-header em {
    color: var(--orange);
    font-family: "Fraunces", serif;
    font-size: .72em;
    font-weight: 300;
}

.frequency-card {
    min-height: 225px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.4rem;
    color: var(--ink);
    border: 2px solid var(--cream);
    box-shadow: 9px 9px 0 var(--orange);
    transform: rotate(2deg);
    transition: background .45s, transform .3s;
}

.frequency-card:hover {
    transform: rotate(-1deg) translateY(-6px);
}

.frequency-card small,
.frequency-card span {
    font-size: .6rem;
    letter-spacing: .08em;
}

.frequency-card strong {
    font-family: "Fraunces", serif;
    font-size: 2.6rem;
    line-height: .95;
}

.mood-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.3rem;
    perspective: 1200px;
}

.mood-card {
    --tilt-x: 0deg;
    --tilt-y: 0deg;
    position: relative;
    min-height: 440px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.2rem;
    color: var(--cream) !important;
    border: 2px solid var(--cream);
    background: transparent;
    text-align: left;
    cursor: pointer;
    transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateY(0);
    transform-style: preserve-3d;
    transition: transform .16s ease, color .35s, background .35s, box-shadow .35s;
}

.mood-card:nth-child(2) {
    margin-top: 3rem;
}

.mood-card:nth-child(3) {
    margin-top: 6rem;
}

.mood-card:hover,
.mood-card--active {
    color: var(--ink) !important;
    background: var(--mood);
    box-shadow: 10px 10px 0 var(--orange);
}

.mood-card:focus-visible {
    outline: 3px solid var(--cream);
    outline-offset: 6px;
}

.mood-card__index {
    font-size: .62rem;
}

.mood-card time {
    align-self: flex-end;
    font-family: "Bebas Neue", sans-serif;
    font-size: 5rem;
    line-height: 1;
}

.mood-card h3 {
    margin: 0 0 .7rem;
    font-family: "Syne", sans-serif;
    font-size: clamp(1.55rem, 3vw, 3rem);
    font-weight: 800;
    line-height: .9;
}

.mood-card p {
    max-width: 26rem;
    margin: 0;
    font-size: .72rem;
    line-height: 1.5;
}

.mood-card__select {
    padding-top: 1rem;
    border-top: 1px solid currentColor;
    font-size: .62rem;
}

@media (max-width: 900px) {
    .mood-section {
        padding: 7rem 1.25rem;
    }

    .section-label {
        margin-bottom: 3rem;
    }

    .mood-header {
        grid-template-columns: 1fr;
    }

    .frequency-card {
        max-width: 330px;
        margin-left: auto;
    }

    .mood-grid {
        grid-template-columns: 1fr;
    }

    .mood-card {
        min-height: 340px;
    }

    .mood-card:nth-child(2),
    .mood-card:nth-child(3) {
        margin-top: 0;
    }
}

@media (max-width: 560px) {
    .mood-header h2 {
        font-size: 25vw;
    }
}
</style>
