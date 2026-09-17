<script lang="ts">
</script>

<template>
    <section id="visit" class="visit-section">
        <div class="visit-sun" aria-hidden="true">
            <span>COME SAY HI ✦ COME SAY HI ✦</span>
        </div>

        <div class="visit-title">
            <span>GOOD THINGS</span>
            <!-- <h2>HAPPEN<br /><em>OFFLINE.</em></h2> -->
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

@media (max-width: 900px) {
    .visit-section {
        padding: 7rem 1.25rem;
    }

    .visit-sun {
        top: 3rem;
        width: 170px;
        opacity: .75;
    }
}

@media (max-width: 560px) {
    .visit-sun {
        right: -5rem;
    }

    .visit-title h2 {
        font-size: 24vw;
    }
}

</style>
