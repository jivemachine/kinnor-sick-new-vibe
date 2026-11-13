<template>
    <div class="intro-loader">
        <div class="loader__slice loader__slice--cream" />
        <div class="loader__slice loader__slice--robin-egg" />
        <div class="loader__slice loader__slice--tulle-soft-mint" />
        <img class="loader__logo" :src="'/kinnor-logo.avif'" alt="" />
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
    color: var(--cream);
    background: var(--blue-dark);
}

.intro-loader p {
    position: absolute;
    bottom: 2.2rem;
    z-index: 3;
    margin: 0;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
}

.loader__logo {
    position: relative;
    z-index: 3;
    width: clamp(9rem, 18vw, 16rem);
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
