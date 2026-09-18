<script setup lang="ts">
import { businessHours } from "../content/kinnor";
</script>

<template>
    <section id="visit" class="visit-section">
        <div class="visit-sun" aria-hidden="true">
            <span>COME SAY HI ✦ COME SAY HI ✦</span>
        </div>

        <div class="visit-title" data-reveal>
            <span>GOOD THINGS</span>
            <h2>HAPPEN<br /><em>OFFLINE.</em></h2>
        </div>

        <div class="visit-grid">
            <a
                href="https://www.google.com/maps/search/?api=1&query=540+S+Castell+Ave+New+Braunfels+TX+78130"
                class="address-card"
                target="_blank"
                rel="noreferrer"
            >
                <span>FIND THE BLUE DOOR</span>
                <strong>540 S CASTELL AVE<br />NEW BRAUNFELS, TX<br />78130</strong>
                <i>OPEN MAPS ↗</i>
            </a>

            <div class="hours-card" data-reveal>
                <div class="hours-card__head">
                    <span>HOURS / WEEKLY</span>
                    <b>CST</b>
                </div>
                <div
                    v-for="day in businessHours"
                    :key="day[0]"
                    class="hours-row"
                    :class="{ closed: day[1] === 'CLOSED' }"
                >
                    <span>{{ day[0] }}</span>
                    <i></i>
                    <strong>{{ day[1] }}</strong>

                </div>
            </div>
        </div>
    </section>

</template>

<style scoped>
.visit-section {
    position: relative;
    overflow: hidden;
    padding: 10rem 4vw 8rem;
    color: var(--cream);
    background: var(--orange);
}

.visit-sun {
    position: absolute;
    right: -4vw;
    top: 5rem;
    width: 290px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    color: var(--ink);
    border: 2px solid var(--ink);
    border-radius: 50%;
    background: var(--lime);
    box-shadow: 10px 10px 0 var(--ink);
    transform: rotate(8deg);
}

.visit-sun span {
    max-width: 11rem;
    font-family: "Syne", sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    line-height: .95;
    text-align: center;
}

.visit-title > span {
    display: inline-block;
    margin-bottom: 1rem;
    padding: .4rem .7rem;
    color: var(--ink);
    background: var(--pink);
    transform: rotate(-2deg);
}

.visit-title h2 {
    margin: 0;
    font-family: "Bebas Neue", Impact, sans-serif;
    font-size: clamp(6rem, 13vw, 13rem);
    font-weight: 400;
    line-height: .8;
    letter-spacing: -.025em;
}

.visit-title em {
    color: var(--lime);
    font-family: "Fraunces", serif;
    font-size: .72em;
    font-weight: 300;
}

.visit-grid {
    display: grid;
    grid-template-columns: .8fr 1.2fr;
    align-items: stretch;
    gap: 1.5rem;
    margin-top: 5rem;
}

.address-card {
    min-height: 480px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.6rem;
    color: var(--ink) !important;
    background: var(--pink);
    box-shadow: 10px 10px 0 var(--ink);
    text-decoration: none;
    transform: rotate(-1.2deg);
    transition: transform .3s, background .3s;
}

.address-card:hover {
    background: var(--lime);
    transform: rotate(1deg) translateY(-8px);
}

.address-card > span,
.address-card i {
    font-size: .65rem;
    font-style: normal;
    letter-spacing: .08em;
}

.address-card strong {
    font-family: "Syne", sans-serif;
    font-size: clamp(2.2rem, 4vw, 4.6rem);
    font-weight: 800;
    line-height: .9;
}

.address-card,
.hours-card {
    border: 2px solid var(--cream);
}

.hours-card {
    padding: 1.6rem;
    background: var(--blue-dark);
}

.hours-card__head {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2.4rem;
    font-size: .65rem;
}

.hours-row {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 1.06rem 0;
    border-top: 1px solid rgba(244, 240, 232, .45);
    font-size: clamp(.72rem, 1.2vw, 1rem);
}

.hours-row i {
    height: 1px;
    background-image: linear-gradient(to right, var(--cream) 50%, transparent 50%);
    background-size: 8px 1px;
    opacity: .6;
}

.hours-row.closed strong {
    color: var(--pink);
}


@media (max-width: 900px) {
    .visit-section {
        padding: 7rem 1.25rem;
    }

    .visit-sun {
        top: 3rem;
        width: 170px;
        opacity: .75;
    }

    .visit-grid {
        grid-template-columns: 1fr;
    }

    .address-card {
        min-height: 370px;
    }
}

@media (max-width: 560px) {
    .visit-sun {
        right: -5rem;
    }

    .visit-title h2 {
        font-size: 24vw;
    }

    .address-card strong {
        font-size: 2.15rem;
    }

    .hours-card {
        padding: 1.1rem;
    }

    .hours-row {
        gap: .6rem;
    }
}

</style>
