<script setup lang="ts">
import { computed, ref } from "vue";
import { moods } from "../content/kinnor";

const selectedMood = ref("slow");

const selected = computed(() => {
    return moods.find((mood) => mood.id === selectedMood.value) ?? moods[0];
});
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
}

@media (max-width: 560px) {
    .mood-header h2 {
        font-size: 25vw;
    }
}
</style>
