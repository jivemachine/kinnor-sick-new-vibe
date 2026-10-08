<script setup lang="ts">
import { ref } from "vue";
import { menuFrames } from "../content/kinnor";

const activeFrame = ref<string | null>(null);
</script>

<template>
    <section id="menu" class="menu-section">
        <div class="menu-orbit" aria-hidden="true">MENU MENU MENU MENU MENU MENU</div>

        <div class="menu-intro">
            <div class="section-label" data-reveal><span>03</span> THE NEXT POUR</div>
            <!-- <h2 data-reveal><p>SOMETIMES</p>THINGS <em>CHANGE.</em></h2> -->
            <h2 data-reveal>
                <span class="menu-heading-line">FIND YOUR</span>
                <span class="menu-heading-line">NEXT <em>FAVORITE.</em></span>
            </h2>
            <p data-reveal>
                Put those TPS reports in the shredder, take a break from the office,
                and come sit down for awhile.
            </p>
        </div>

        <!-- <div class="menu-orbit-lol" aria-hidden="true">MENU MENU MENU MENU MENU MENU</div> -->

        <div class="menu-frames">
            <div
                v-for="frame in menuFrames"
                :key="frame.number"
                class="menu-frame-reveal"
                :class="{ 'menu-frame-reveal--active': activeFrame === frame.number }"
                data-reveal
                @pointerenter="activeFrame = frame.number"
            >
                <article class="menu-frame" :class="{ 'menu-frame--active': activeFrame === frame.number }">
                    <button
                        type="button"
                        class="menu-frame__select"
                        :aria-label="`Tilt ${frame.label.toLowerCase()} menu frame`"
                        :aria-pressed="activeFrame === frame.number"
                        @click="activeFrame = frame.number"
                        @focus="activeFrame = frame.number"
                    ></button>
                    <div class="menu-frame__top">
                        <span>{{ frame.number }}</span>
                        <i>{{ frame.availability }}</i>
                    </div>
                    <h3>{{ frame.label }}</h3>
                    <p>{{ frame.note }}</p>
                    <div v-if="frame.groups.length" class="menu-frame__groups">
                        <div v-for="(group, groupIndex) in frame.groups" :key="groupIndex" class="menu-group">
                            <h4 v-if="group.label">{{ group.label }}</h4>
                            <ul class="menu-items">
                                <li v-for="item in group.items" :key="item.name" class="menu-item">
                                    <div class="menu-item__heading">
                                        <span class="menu-item__name">{{ item.name }}</span>
                                        <span v-if="item.price" class="menu-item__price">{{ item.price }}</span>
                                    </div>
                                    <p v-if="item.description" class="menu-item__description">{{ item.description }}</p>
                                    <p v-if="item.detail" class="menu-item__detail">{{ item.detail }}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <span v-if="frame.footer" class="menu-frame__soon">{{ frame.footer }}</span>
                </article>
            </div>
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
    right: -4rem;
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

.menu-intro {
    display: grid;
    grid-template-columns: minmax(0, .7fr) minmax(0, 1.8fr) minmax(0, .7fr);
    align-items: end;
    gap: 2rem;
    margin-bottom: 5rem;
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

.menu-intro h2 {
    margin: 0;
    font-family: "Bebas Neue", Impact, sans-serif;
    font-size: clamp(3rem, 9vw, 10rem);
    font-weight: 400;
    line-height: .8;
    letter-spacing: -.025em;
}

.menu-heading-line {
    display: block;
    white-space: nowrap;
}

.menu-intro h2 em {
    color: var(--orange);
    font-family: "Fraunces", serif;
    font-size: .72em;
    font-weight: 300;
}

.menu-intro > p {
    max-width: 27rem;
    margin: 0;
    font-size: .76rem;
    line-height: 1.65;
}

.menu-frames {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: start;
    gap: 4.5rem 1.75rem;
}

.menu-frame-reveal {
    grid-column: span 2;
    position: relative;
    min-width: 0;
}

/* OLD WHEN THE COCKTAIL MENU WAS STILL HERE */
/* .menu-frame-reveal:nth-child(n + 4) {
    grid-column: span 3;
} */

.menu-frame-reveal:nth-child(2) {
    grid-column: span 3;
}

.menu-frame-reveal:nth-child(n + 4) {
    grid-column: span 3;
}

.menu-frame-reveal--active {
    z-index: 1;
}

.menu-frame {
    --frame-rotation: -1.5deg;
    --frame-offset: 0rem;
    --frame-active-rotation: -2.5deg;
    position: relative;
    min-height: 510px;
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    border: var(--line);
    box-shadow: 8px 8px 0 var(--ink);
    height: 100%;
    background: var(--lime);
    transform: translateY(var(--frame-offset)) rotate(var(--frame-rotation));
    transform-origin: 50% 12%;
    transition: transform .55s cubic-bezier(.22, 1.4, .36, 1), box-shadow .55s;
}

.menu-frame-reveal:nth-child(2) .menu-frame {
    --frame-rotation: 1.2deg;
    --frame-offset: 2rem;
    --frame-active-rotation: 2.5deg;
    background: var(--pink);
}

/* TO REMOVE THE COCKTAIL MENU STYLING */
/* .menu-frame-reveal:nth-child(3) .menu-frame {
    --frame-rotation: -.7deg;
    --frame-active-rotation: -2deg;
    color: var(--cream);
    background: var(--blue);
} */

.menu-frame-reveal:nth-child(3) .menu-frame {
    --frame-rotation: .8deg;
    --frame-active-rotation: 2deg;
    background: var(--orange);
}

.menu-frame-reveal:nth-child(4) .menu-frame {
    --frame-rotation: -1deg;
    --frame-active-rotation: -2deg;
    background: var(--pink);
}

.menu-frame.menu-frame--active {
    transform: translateY(calc(var(--frame-offset) - 12px)) rotate(var(--frame-active-rotation));
    box-shadow: 12px 16px 0 var(--ink);
}

.menu-frame__select {
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.menu-frame__select:focus-visible {
    outline: 3px dashed currentColor;
    outline-offset: -10px;
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

.menu-frame h3 {
    margin: 3rem 0 1rem;
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(3rem, 5.8vw, 6rem);
    font-weight: 400;
    line-height: .75;
}

.menu-frame > p {
    margin: 0 0 1.6rem;
    font-size: .75rem;
    line-height: 1.5;
}

.menu-frame__groups {
    display: grid;
    gap: 1.75rem;
}

.menu-group h4 {
    margin: 0 0 .75rem;
    font-family: "Syne", sans-serif;
    font-size: .85rem;
    font-weight: 800;
}

.menu-items {
    margin: 0;
    padding: 0;
    border-top: 1px solid currentColor;
    list-style: none;
}

.menu-item {
    padding: .85rem 0;
    border-bottom: 1px solid color-mix(in srgb, currentColor 25%, transparent);
}

.menu-item__heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: .5rem 1rem;
    font-size: .8rem;
    line-height: 1.4;
}

.menu-item__name {
    min-width: 0;
    font-weight: 500;
}

.menu-item__price {
    flex-shrink: 0;
    font-size: .75rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.menu-item__description,
.menu-item__detail {
    margin: .35rem 0 0;
    font-size: .7rem;
    line-height: 1.6;
}

.menu-item__detail {
    font-weight: 500;
}

.menu-frame__soon {
    margin-top: auto;
    padding: .9rem;
    color: inherit;
    border: 1px solid currentColor;
    background: transparent;
    font-size: .62rem;
    text-align: center;
    opacity: .55;
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
        gap: 2.5rem;
    }

    .menu-frame {
        min-height: 430px;
        --frame-active-rotation: -1.5deg;
        transform-origin: 50% 50%;
    }

    .menu-intro {
        grid-template-columns: minmax(0, 1fr);
    }

    .menu-intro h2 {
        font-size: clamp(2.5rem, 16vw, 8rem);
    }

    .section-label {
        margin-bottom: 3rem;
    }

    /* OLD WHEN THE COCKTAIL MENU WAS STILL HERE */
    /* .menu-frame-reveal,
    .menu-frame-reveal:nth-child(n + 4) {
        grid-column: auto;
    } */

    .menu-frame-reveal,
    .menu-frame-reveal:nth-child(n + 3) {
        grid-column: auto;
    }

    .menu-frame-reveal:nth-child(2) .menu-frame {
        --frame-offset: 0rem;
        --frame-active-rotation: 1.5deg;
    }

    /* OLD FROM WHEN COCKTAIL MENU WAS STILL HERE */
    /* .menu-frame-reveal:nth-child(3) .menu-frame {
        --frame-active-rotation: -1.5deg;
    } */

    .menu-frame-reveal:nth-child(n + 4) .menu-frame {
        --frame-active-rotation: 1.5deg;
    }

    .menu-frame.menu-frame--active {
        box-shadow: 8px 12px 0 var(--ink);
    }
}

@media (prefers-reduced-motion: reduce) {
    .menu-frame.menu-frame--active {
        transform: translateY(var(--frame-offset)) rotate(var(--frame-rotation));
    }
}

@media (max-width: 560px) {
    .menu-intro h2 {
        font-size: 22vw;
    }

    .menu-frame h3 {
        font-size: clamp(3rem, 15vw, 5rem);
    }

    .menu-item__heading {
        flex-wrap: wrap;
    }
}
</style>
