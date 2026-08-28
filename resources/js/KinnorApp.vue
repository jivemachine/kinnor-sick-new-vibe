<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import IntroLoader from "./components/IntroLoader.vue";
import SiteNavigation from "./components/SiteNavigation.vue";

const root = ref<HTMLElement | null>(null);

const isNavigationOpen = ref(false);
const showIntro = ref(true);
const clock = ref("");

let clockTimer: ReturnType<typeof setInterval> | undefined;
let gsapContext: { revert: () => void } | undefined;
const cleanupFunctions: Array<() => void> = [];

function updateClock() {
    clock.value = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(new Date());
}

function scrollToSection(sectionId: string) {
    isNavigationOpen.value = false;
    document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

function toggleNavigation() {
    isNavigationOpen.value = !isNavigationOpen.value;
}

onMounted(async () => {
    updateClock();
    clockTimer = setInterval(updateClock, 1000);
    if (!root.value) {
        return;
    }

    const [{ gsap }] = await Promise.all([
        import("gsap"),
    ]);

    gsapContext = gsap.context(() => {
        const loader = gsap.timeline({
            defaults: { ease: "expo.out" },
        });

        loader
        .fromTo(
            ".loader__slice",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, stagger: 0.07 },
        )
        .fromTo(
            ".loader__logo",
            { rotate: -8, scale: 0.72 },
            { rotate: 0, scale: 1, duration: 0.8 },
            "<0.1",
        )
        .to(".intro-loader", {
            yPercent: -105,
            duration: 1.1,
            ease: "expo.inOut",
            delay: 0.25,
            onComplete: () => {
                showIntro.value = false;
            },
        });
    }, root.value);
});

onBeforeUnmount(() => {
    if (clockTimer) {
    clearInterval(clockTimer);
  }
})
</script>

<template>
    <div
        ref="root"
        class="kinnor-shell relative min-h-screen overflow-x-clip"
    >
        <IntroLoader />

        <SiteNavigation
            :clock="clock"
            :is-open="isNavigationOpen"
            @navigate="scrollToSection"
            @toggle="toggleNavigation"
        />

    </div>
</template>
