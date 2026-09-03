<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import IntroLoader from "./components/IntroLoader.vue";
import SiteNavigation from "./components/SiteNavigation.vue";
import HeroSection from "./components/HeroSection.vue";

const root = ref<HTMLElement | null>(null);

const isNavigationOpen = ref(false);
const showIntro = ref(true);
const clock = ref("");

let clockTimer: ReturnType<typeof setInterval> | undefined;
let gsapContext: { revert: () => void } | undefined;
// const cleanupFunctions: Array<() => void> = [];

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

    gsap.from(".hero-letter", {
        yPercent: 130,
        rotate: () => gsap.utils.random(-14, 14),
        duration: 1.2,
        stagger: 0.055,
        ease: "expo.out",
        delay: 0.7,
    });

    gsap.from(".hero__eyebrow", {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 1,
    });

    const heroSticker = root.value?.querySelector<HTMLElement>("[data-hero-sticker]");

    if (heroSticker) {
        const stickerPeel = heroSticker.querySelector<HTMLElement>(".hero__script-peel");
        const stickerImpact = heroSticker.querySelector<HTMLElement>(".hero__script-impact");
        const startXPercent = Number(heroSticker.dataset.startXPercent);
        const startYPercent = Number(heroSticker.dataset.startYPercent);
        const startRotation = Number(heroSticker.dataset.startRotation);
        const restingRotation = Number(heroSticker.dataset.restingRotation);
        const rotationX = Number(heroSticker.dataset.rotationX);
        const rotationY = Number(heroSticker.dataset.rotationY);
        const transformOrigin = heroSticker.dataset.transformOrigin ?? "50% 50%";

        gsap.set(heroSticker, {
            autoAlpha: 0,
            xPercent: startXPercent,
            yPercent: startYPercent,
            rotation: startRotation,
            rotationX,
            rotationY,
            scale: 1.28,
            transformOrigin,
            transformPerspective: 900,
        });

        const stickerTimeline = gsap.timeline({
            delay: 1.75,
        });

        stickerTimeline
            .to(heroSticker, {
                autoAlpha: 1,
                duration: 0.01,
            })
            .to(heroSticker, {
                xPercent: 0,
                yPercent: 0,
                rotation: restingRotation,
                rotationX: 0,
                rotationY: 0,
                scale: 1.08,
                duration: 0.58,
                ease: "power4.in",
            })
            .to(heroSticker, {
                scaleX: 1.09,
                scaleY: 0.88,
                duration: 0.09,
                ease: "power2.out",
            })
            .to(heroSticker, {
                scaleX: 0.98,
                scaleY: 1.03,
                duration: 0.16,
                ease: "power2.out",
            })
            .to(heroSticker, {
                scaleX: 1,
                scaleY: 1,
                duration: 0.58,
                ease: "elastic.out(1, 0.38)",
            });

        if (stickerPeel) {
            stickerTimeline
                .fromTo(
                    stickerPeel,
                    {
                        autoAlpha: 0,
                        scale: 0.1,
                        rotation: -18,
                        rotationX: 72,
                    },
                    {
                        autoAlpha: 1,
                        scale: 1,
                        rotation: 8,
                        rotationX: 28,
                        duration: 0.24,
                        ease: "power2.out",
                    },
                    0.25,
                )
                .to(
                    stickerPeel,
                    {
                        autoAlpha: 0,
                        scale: 0,
                        rotation: 0,
                        rotationX: 0,
                        duration: 0.26,
                        ease: "power3.in",
                    },
                    0.54,
                );
            }

        if (stickerImpact) {
            stickerTimeline.fromTo(
                stickerImpact,
                {
                    autoAlpha: 0.8,
                    scale: 0.72,
                },
                {
                    autoAlpha: 0,
                    scale: 1.45,
                    duration: 0.4,
                    ease: "power2.out",
                },
                0.59,
            );
        }
    }

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

        <main>
            <HeroSection />
        </main>

    </div>
</template>
