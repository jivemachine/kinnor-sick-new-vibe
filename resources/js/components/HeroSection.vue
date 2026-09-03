<script setup lang="ts">
type StickerPeelCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type StickerOrientation = {
    id: string;
    startXPercent: number,
    startYPercent: number,
    startRotation: number,
    restingRotation: number,
    rotationX: number,
    rotationY: number,
    transformOrigin: string,
    peelCorner: StickerPeelCorner;
};

const stickerOrientations: StickerOrientation[] = [
    {
        id: "upper-left",
        startXPercent: -145,
        startYPercent: -190,
        startRotation: -34,
        restingRotation: -8,
        rotationX: 62,
        rotationY: -26,
        transformOrigin: "0% 100%",
        peelCorner: "top-left",
    },
    {
      id: "upper-right",
      startXPercent: 130,
      startYPercent: -190,
      startRotation: 28,
      restingRotation: -3,
      rotationX: 58,
      rotationY: 30,
      transformOrigin: "100% 100%",
      peelCorner: "top-right",
    },
    {
      id: "lower-left",
      startXPercent: -150,
      startYPercent: 175,
      startRotation: -28,
      restingRotation: 4,
      rotationX: -56,
      rotationY: -22,
      transformOrigin: "0% 0%",
      peelCorner: "bottom-left",
    },
    {
      id: "lower-right",
      startXPercent: 145,
      startYPercent: 165,
      startRotation: 34,
      restingRotation: -10,
      rotationX: -52,
      rotationY: 28,
      transformOrigin: "100% 0%",
      peelCorner: "bottom-right",
    },
    {
      id: "straight-down",
      startXPercent: 10,
      startYPercent: -220,
      startRotation: 13,
      restingRotation: 1,
      rotationX: 68,
      rotationY: 5,
      transformOrigin: "50% 100%",
      peelCorner: "top-right",
    },
];

type StickerPosition = {
    id: string;
    leftPercent: number;
    topPercent: number;
};

const stickerPositions: StickerPosition[] = [
    { id: "lower-center", leftPercent: 30, topPercent: 89 },
    { id: "lower-left", leftPercent: 1, topPercent: 89 },
    { id: "middle-right", leftPercent: 41, topPercent: 45 },
    { id: "middle-left", leftPercent: 25, topPercent: 45 },
    { id: "upper-left", leftPercent: 16, topPercent: 28 },
];

function selectStickerOrientation(): StickerOrientation {
    const selectedIndex = Math.floor(Math.random() * stickerOrientations.length);

    return stickerOrientations[selectedIndex] ?? stickerOrientations[0];
}

function selectStickerPosition(): StickerPosition {
    const selectedIndex = Math.floor(Math.random() * stickerPositions.length);

    return stickerPositions[selectedIndex] ?? stickerPositions[0];
}

const stickerOrientation = selectStickerOrientation();
const stickerPosition = selectStickerPosition();

const emit = defineEmits<{
    navigate: [sectionId: string];
}>();
</script>

<template>
    <section id="top" class="hero">
        <div class="hero__spotlight" aria-hidden="true"></div>
        <div class="hero__noise"></div>
        <p class="hero__eyebrow">540 S CASTELL AVE - NEW BRAUNFELS, TEXAS</p>

        <div class="hero__title-wrap" aria-label="Kinnor">
            <h1 class="hero__title" aria-hidden="true">
                <span v-for="letter in 'KINNOR'.split('')" :key="letter" class="hero-letter">{{ letter }}</span>
            </h1>
            <!-- <span class="hero__script">COFFEE</span> -->
            <span
                class="hero__script"
                :class="`hero__script--peel-${stickerOrientation.peelCorner}`"
                :style="{
                    '--sticker-left': `${stickerPosition.leftPercent}%`,
                    '--sticker-top': `${stickerPosition.topPercent}%`,
                    '--sticker-resting-rotation': `${stickerOrientation.restingRotation}deg`,
                }"
                :data-sticker-orientation="stickerOrientation.id"
                :data-sticker-position="stickerPosition.id"
                :data-start-x-percent="stickerOrientation.startXPercent"
                :data-start-y-percent="stickerOrientation.startYPercent"
                :data-start-rotation="stickerOrientation.startRotation"
                :data-resting-rotation="stickerOrientation.restingRotation"
                :data-rotation-x="stickerOrientation.rotationX"
                :data-rotation-y="stickerOrientation.rotationY"
                :data-transform-origin="stickerOrientation.transformOrigin"
                data-hero-sticker
            >
                <span class="hero__script-copy">COFFEE</span>
                <span class="hero__script-peel" aria-hidden="true" />
                <span class="hero__script-impact" aria-hidden="true" />
            </span>
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
    margin: 0 0 0 .8rem;
    font-size: clamp(.58rem, .8vw, .74rem);
    letter-spacing: .16em;
}

.hero__title-wrap {
    position: relative;
}

.hero__title {
    display: flex;
    margin: 0;
    color: var(--cream);
    font-family: "Bebas Neue", Impact, sans-serif;
    font-size: clamp(9rem, 24.3vw, 25rem);
    font-weight: 400;
    line-height: 0.8;
    letter-spacing: -.01em;
    white-space: nowrap;
}

.hero-letter {
    display: inline-block;
}

.hero__script {
    --sticker-left: 39%;
    --sticker-top: 44%;
    --sticker-resting-rotation: -6deg;
    position: absolute;
    z-index: 4;
    left: var(--sticker-left);
    top: var(--sticker-top);
    display: inline-block;
    padding: .1em .28em .18em;
    color: var(--ink);
    background: var(--lime);
    border: 2px solid var(--ink);
    box-shadow: 7px 7px 0 var(--orange);
    font-family: "Fraunces", serif;
    font-size: clamp(2rem, 6vw, 6rem);
    font-style: italic;
    font-weight: 300;
    line-height: 1;
    isolation: isolate;
    transform: rotate(var(--sticker-resting-rotation));
    transform-style: preserve-3d;
    will-change: opacity, transform;
}

/* .hero__script { */
    /* --sticker-left: 39%;
    --sticker-top: 44%; */
    /* --sticker-resting-rotation: -6deg; */
    /* position: absolute;
    z-index: 4;
    left: var(--sticker-left);
    top: var(--sticker-top); */

    /* display: inline-block; */
    /* padding: .1em .28em .18em; */

    /* font-family: "Fraunces", serif;
    font-size: clamp(2rem, 6vw, 6rem);
    font-style: italic;
    color: var(--ink);
    background: var(--lime);
    padding: .1em .28em .18em;
    border: 2px solid var(--ink);
    box-shadow: 7px 7px 0 var(--orange);
    font-weight: 300;
    line-height: 1; */

    /* transform: rotate(var(--sticker-resting-rotation)); */
    /* transform-style: preserve-3d; */
    /* will-change: opacity, transform; */

    /* basic variation 1 right aligned */
    /* left: 30%; */
    /* top: 89%; */

    /* basic variation 2 left aligned */
    /* left: 1%; */
    /* top: 89%; */

    /* like someone just slapped a fuckin' sticker on that bitch */
    /* transform: rotate(-6deg); */
    /* left: 41%; */
    /* top: 45%; */

    /* Also, sort of interesting */
    /* transform: rotate(-6deg); */
    /* left: 25%; */
    /* top: 45%; */

    /* A bit different than the others... */
    /* transform: rotate(-6deg); */
    /* left: 16%; */
    /* top: 28%; */

/* } */

/* .hero__script {
    --sticker-resting-rotation: -6deg;
    position: absolute;
    z-index: 4;
    left: 39%;
    top: 44%;
    display: inline-block;
    padding: .1em .28em .18em;
    color: var(--ink);
    background: var(--lime);
    border: 2px solid var(--ink);
    box-shadow: 7px 7px 0 var(--orange);
    font-family: "Fraunces", serif;
    font-size: clamp(2rem, 6vw, 6rem);
    font-style: italic;
    font-weight: 300;
    line-height: 1;
    isolation: isolate;
    transform: rotate(var(--sticker-resting-rotation));
    transform-style: preserve-3d;
    will-change: opacity, transform;
} */

.hero__script::before {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    pointer-events: none;
    background:
        linear-gradient(115deg, rgba(255, 255, 255, .26), transparent 34%),
        repeating-linear-gradient(8deg, transparent 0 8px, rgba(19, 35, 46, .035) 8px 9px);
    mix-blend-mode: soft-light;
}

.hero__script-copy {
    position: relative;
    z-index: 2;
    display: block;
}

.hero__script-peel {
    position: absolute;
    z-index: 3;
    width: 27%;
    aspect-ratio: 1;
    pointer-events: none;
    opacity: 0;
    background: linear-gradient(135deg, var(--cream) 8%, #d9d0bf 58%, var(--ink) 61%);
    filter: drop-shadow(3px 4px 0 rgba(19, 35, 46, .28));
}

.hero__script--peel-top-left .hero__script-peel {
    top: -2px;
    left: -2px;
    clip-path: polygon(0 0, 100% 0, 0 100%);
    transform-origin: 0 0;
}

.hero__script--peel-top-right .hero__script-peel {
    top: -2px;
    right: -2px;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    transform-origin: 100% 0;
}

.hero__script--peel-bottom-left .hero__script-peel {
    bottom: -2px;
    left: -2px;
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    transform-origin: 0 100%;
}

.hero__script--peel-bottom-right .hero__script-peel {
    right: -2px;
    bottom: -2px;
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
    transform-origin: 100% 100%;
}

.hero__script-impact {
    position: absolute;
    z-index: -1;
    inset: -10px;
    pointer-events: none;
    border: 3px solid var(--orange);
    opacity: 0;
}

@media (max-width: 900px) {
    .hero {
        min-height: 880px;
        padding-top: 9rem;
    }

    .hero__eyebrow {
        margin: 0 0 0.4rem 0.4rem;
    }

    .hero__title {
        font-size: 26vw;
        line-height: .8;
    }

    .hero-sticker {
        right: 8vw;
        bottom: 4vh;
    }
}

@media (max-width: 560px) {
    .hero {
        min-height: 780px;
        padding-inline: 1rem;
    }

    .hero__eyebrow {
        max-width: 210px;
        line-height: 1.5;
        margin: 0 0 0.3rem 0.2rem;
    }

    .hero__title {
        font-size: 25.6vw;
    }

    .hero__script {
        font-size: 2.35rem;
    }

    .hero-sticker {
        bottom: 13vh;
        width: 92px;
        font-size: .82rem;
    }
}
</style>
