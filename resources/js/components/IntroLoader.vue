<template>
    <div class="intro-loader">
        <div class="loader__slice loader__slice--cream" />
        <div class="loader__slice loader__slice--robin-egg" />
        <div class="loader__slice loader__slice--tulle-soft-mint" />
        <div class="loader__placement loader__placement--top" aria-hidden="true">
            <span class="loader__logo loader__logo--wordmark" />
        </div>
        <div class="loader__placement loader__placement--center" aria-hidden="true">
            <span class="loader__logo loader__logo--house" />
        </div>
        <p>CRAFT / COFFEE / COMMUNITY</p>
    </div>
</template>


<style scoped>
.intro-loader {
    position: fixed;
    inset: 0;
    z-index: 9990;
    display: grid;
    place-items: center;
    overflow: hidden;
    color: var(--ink);
    background: var(--cream);
}

.intro-loader p {
    position: absolute;
    bottom: 2.2rem;
    z-index: 3;
    margin: 0;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
}

.loader__placement {
    position: absolute;
    z-index: 3;
    display: grid;
    place-items: center;
    pointer-events: none;
}

.loader__placement--top {
    inset: 0 0 auto;
    height: 25%;
}

.loader__placement--center {
    inset: 0;
}

.loader__logo {
    display: block;
    background: var(--ink);
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    mask-size: contain;
}

.loader__logo--wordmark {
    width: min(15rem, 54vw, 37vh);
    aspect-ratio: 212 / 116;
    -webkit-mask-image: url('/kinnor-logo.avif');
    mask-image: url('/kinnor-logo.avif');
}

.loader__logo--house {
    width: min(96vw, 46rem, 78vh);
    aspect-ratio: 6607 / 8091;
    -webkit-mask-image: url('/kinnor-house.png');
    mask-image: url('/kinnor-house.png');
}

.loader__slice {
    position: absolute;
    inset: 0;
    transform-origin: left;
}

.loader__slice--lime {
    background: var(--lime);
}

.loader__slice--pink {
    inset: 25% 0 0;
    background: var(--pink);
}

.loader__slice--orange {
    inset: 60% 0 0;
    background: var(--orange);
}

.loader__slice--cream {
    background: var(--cream);
}

.loader__slice--robin-egg {
    inset: 25% 0 0;
    background: var(--robin-egg);
}

.loader__slice--tulle-soft-mint {
    inset: 60% 0 0;
    background: var(--tulle-soft-mint);
}
</style>
