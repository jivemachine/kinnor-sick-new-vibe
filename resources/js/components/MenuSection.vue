<script setup lang="ts">
import { menuFrames } from "../content/kinnor";
</script>

<template>
    <section id="menu" class="menu-section">
        <div class="menu-orbit" aria-hidden="true">MENU MENU MENU MENU MENU MENU</div>

        <div class="menu-intro">
            <div class="section-label" data-reveal><span>03</span> THE NEXT POUR</div>
            <h2 data-reveal><p>SOMETIMES</p>THINGS <em>CHANGE.</em></h2>
            <p data-reveal>
                Put those TPS reports in the shredder, take a break from the office,
                and come sit down for awhile.
            </p>
        </div>

        <!-- <div class="menu-orbit-lol" aria-hidden="true">MENU MENU MENU MENU MENU MENU</div> -->

        <div class="menu-frames">
            <article
                class="menu-frame"
                v-for="frame in menuFrames"
                :key="frame.number"
                data-reveal
            >
                <div class="menu-frame__top">
                    <span>{{ frame.number }}</span>
                    <i>{{ frame.availability }}</i>
                </div>
                <h3>{{ frame.label }}</h3>
                <p>{{ frame.note }}</p>
                <div class="menu-frame__placeholder">
                    <span v-for="line in 3" :key="line">ITEM NAME <i>··········</i> $—</span>
                </div>
                <button disabled>FULL MENU / SOON</button>
            </article>
        </div>

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

.menu-frames {
    padding-top: 8rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
}

.menu-frame {
    position: relative;
    min-height: 510px;
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    border: var(--line);
    box-shadow: 8px 8px 0 var(--ink);
    transition: transform .3s, background .3s;
}

.menu-frame:nth-child(1) {
    background: var(--lime);
    transform: rotate(-1.5deg);
}

.menu-frame:nth-child(2) {
    background: var(--pink);
    transform: rotate(1.2deg) translateY(2rem);
}

.menu-frame:nth-child(3) {
    color: var(--cream);
    background: var(--blue);
    transform: rotate(-.7deg);
}

.menu-frame:hover {
    transform: rotate(0) translateY(-10px);
}

.menu-frame h3 {
    margin: auto 0 1rem;
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(4rem, 7vw, 7rem);
    font-weight: 400;
    line-height: .75;
}

.menu-frame > p {
    min-height: 3.8rem;
    font-size: .68rem;
    line-height: 1.5;
}

.menu-frame button {
    margin-top: 1.3rem;
    padding: .9rem;
    color: inherit;
    border: 1px solid currentColor;
    background: transparent;
    font-size: .62rem;
    opacity: .55;
}

.menu-frame__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .62rem;
}

.menu-frame__top i {
    font-style: normal;
}

.menu-frame__placeholder {
    display: grid;
    gap: .75rem;
    padding: 1rem 0;
    border-block: 1px solid currentColor;
    opacity: .65;
}

.menu-frame__placeholder span {
    display: flex;
    justify-content: space-between;
    gap: .5rem;
    font-size: .57rem;
}

.menu-frame__placeholder i {
    flex: 1;
    overflow: hidden;
    font-style: normal;
    letter-spacing: .1em;
}

.menu-intro {
    display: grid;
    grid-template-columns: 1fr 2.1fr .7fr;
    align-items: end;
    gap: 2rem;
    margin-bottom: 5rem;
}

.menu-intro h2 {
    margin: 0;
    font-family: "Bebas Neue", Impact, sans-serif;
    font-size: clamp(5rem, 10vw, 10rem);
    font-weight: 400;
    line-height: .8;
    letter-spacing: -.025em;
}

.menu-intro h2 em {
    color: var(--orange);
    font-family: "Fraunces", serif;
    font-size: .72em;
    font-weight: 300;
}

.menu-intro h2 p {
    text-align: center;
}

.menu-intro > p {
    max-width: 27rem;
    margin: 0;
    padding-top: 1rem;
    font-size: .76rem;
    line-height: 1.65;
}

.section-label {
    display: flex;
    align-items: center;
    align-self: start;
    gap: 1rem;
    margin: 0;
    font-size: .68rem;
    letter-spacing: .16em;
}

.section-label span {
    width: 34px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    color: var(--cream);
    border-radius: 50%;
    background: var(--ink);
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

    .menu-frames {
        grid-template-columns: 1fr;
    }

    .menu-frame {
        min-height: 430px;
    }

    .menu-frame:nth-child(2) {
        transform: rotate(1.2deg);
    }

    .menu-intro {
        grid-template-columns: 1fr;
    }

    .section-label {
        margin-bottom: 3rem;
    }

    .menu-intro h2 p {
        text-align: left;
    }
}

@media (max-width: 560px) {
    .menu-intro h2 {
        font-size: 22vw;
    }
}
</style>
