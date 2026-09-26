<script setup lang="ts">
const emit = defineEmits<{
    navigate: [sectionId: string];
}>();
</script>

<template>
    <section id="story" class="story-section">
        <div class="story-kicker" data-reveal>THE WHY BEHIND THE POUR / 01</div>

        <div class="story-grid">
            <div class="story-heading" data-reveal="tilt">
                <span>WE ARE</span>
                <h2>CREATED<br /><em>TO CREATE.</em></h2>
            </div>

            <div class="story-copy" data-reveal>
                <p class="lead">Community is not a feature. It is the whole point.</p>
                <p>
                    Kinnor is a small family-owned specialty coffee shop and craft cocktail lounge in the heart
                    of New Braunfels. The work matters, but sharing it matters more.
                </p>
                <p>
                    This is a space for shared experiences, old friends, new ideas, birthdays, burdens, big news, slow mornings, and
                    all of the life that comes when you're part of a community.
                </p>
                <button class="text-link" @click="emit('navigate', 'moods')">
                    FIND YOUR TIME AT KINNOR
                    <span>→</span>
                </button>
            </div>

            <div class="story-note" data-reveal>
                <span>PLEASE NOTE</span>
                <strong>REAL LIFE<br />IS HAPPENING<br />IN HERE.</strong>
                <i>✳</i>
            </div>
        </div>

        <div class="together-type" data-scrub aria-hidden="true">
            TOGETHER / TOGETHER / TOGETHER
        </div>
    </section>
</template>

<style scoped>
.story-section {
    position: relative;
    overflow: hidden;
    padding: 10rem 4vw 7rem;
    background: var(--cream);
}

.story-kicker {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 4.5rem;
    font-size: .68rem;
    letter-spacing: .16em;
}

.story-grid {
    display: grid;
    grid-template-columns: 1.15fr .78fr .48fr;
    align-items: start;
    gap: clamp(2rem, 5vw, 7rem);
}

.story-heading > span {
    display: inline-block;
    margin-bottom: 1rem;
    padding: .4rem .7rem;
    color: var(--cream);
    background: var(--ink);
    font-size: .65rem;
    transform: rotate(-2deg);
}

.story-heading h2 {
    margin: 0;
    font-family: "Bebas Neue", Impact, sans-serif;
    font-size: clamp(4.7rem, 9.4vw, 10.5rem);
    font-weight: 400;
    line-height: .8;
    letter-spacing: -.025em;
}

.story-heading em {
    color: var(--orange);
    font-family: "Fraunces", serif;
    font-size: .72em;
    font-weight: 300;
}

.story-copy {
    padding-top: 1rem;
    font-size: .86rem;
    line-height: 1.75;
}

.story-copy .lead {
    margin-top: 0;
    font-family: "Fraunces", serif;
    font-size: clamp(1.55rem, 2.5vw, 2.35rem);
    font-weight: 700;
    line-height: 1.1;
}

.text-link {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 2.4rem;
    padding: 1rem 0;
    border: 0;
    border-block: 2px solid var(--ink);
    background: none;
    font-size: .68rem !important;
    font-weight: 500 !important;
    letter-spacing: .06em;
    cursor: pointer;
}

.text-link span {
    font-size: 1.1rem;
    transition: transform .25s;
}

.text-link:hover span {
    transform: translateX(8px);
}

.story-note {
    position: relative;
    padding: 1.2rem;
    border: var(--line);
    background: var(--electric);
    box-shadow: 9px 9px 0 var(--ink);
    transform: rotate(3deg);
}

.story-note span {
    display: block;
    margin-bottom: 3rem;
    font-size: .6rem;
}

.story-note strong {
    font-family: "Syne", sans-serif;
    font-size: clamp(1.2rem, 2vw, 2rem);
    line-height: .95;
}

.story-note i {
    position: absolute;
    right: .8rem;
    top: .45rem;
    color: var(--lime);
    font-size: 2rem;
    font-style: normal;
    animation: spin 7s linear infinite;
}

.together-type {
    margin: 9rem -10vw -3rem;
    color: transparent;
    -webkit-text-stroke: 2px var(--ink);
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(7rem, 16vw, 16rem);
    line-height: .65;
    white-space: nowrap;
    opacity: .18;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 900px) {
    .story-section {
        padding: 7rem 1.25rem;
    }

    .story-kicker {
        margin-bottom: 3rem;
    }

    .story-grid {
        grid-template-columns: 1fr;
    }

    .story-note {
        max-width: 280px;
        margin-left: auto;
    }

    .together-type {
        margin-top: 6rem;
    }
}

@media (max-width: 560px) {
    .story-heading h2 {
        font-size: 22vw;
    }
}
</style>
