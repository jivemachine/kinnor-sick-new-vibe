<script setup lang="ts">
import { nextTick, ref, onMounted, onBeforeUnmount } from "vue";
import IntroLoader from "./components/IntroLoader.vue";
import SiteNavigation from "./components/SiteNavigation.vue";
import HeroSection from "./components/HeroSection.vue";
import AppEffects from "./components/AppEffects.vue";
import SiteFooter from "./components/SiteFooter.vue";
import MenuSection from "./components/MenuSection.vue";
import VisitUs from "./components/VisitUs.vue";
import MotionTicker from "./components/MotionTicker.vue";
import StorySection from "./components/StorySection.vue";
import MoodSection from "./components/MoodSection.vue";
import type { ClickBurst } from "./types/kinnor";

const root = ref<HTMLElement | null>(null);

const isNavigationOpen = ref(false);
const showIntro = ref(true);
const clock = ref("");
const bursts = ref<ClickBurst[]>([]);
const scrollProgress = ref(0);

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

function updateScrollProgress() {
    const availableScroll = document.documentElement.scrollHeight - window.innerHeight;

    scrollProgress.value = availableScroll > 0
        ? Math.min(window.scrollY / availableScroll, 1)
        : 0;
}

function toggleNavigation() {
    isNavigationOpen.value = !isNavigationOpen.value;
}

function makeBurst(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest("a, button")) {
        return;
    }

    const burstId = Date.now() + Math.random();
    const glyphs = ["✦", "●", "✳", "◆"];

    bursts.value.push({
        id: burstId,
        x: event.clientX,
        y: event.clientY,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
    });

    window.setTimeout(() => {
        bursts.value = bursts.value.filter((burst) => burst.id !== burstId);
    }, 850);
}

onMounted(async () => {
    updateClock();
    clockTimer = setInterval(updateClock, 1000);

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    cleanupFunctions.push(() => {
        window.removeEventListener("scroll", updateScrollProgress);
    });

    await nextTick();

    if (!root.value) {
        return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
        showIntro.value = false;
        return;
    }

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
    ]);

    gsap.registerPlugin(ScrollTrigger);

    const cursor = root.value.querySelector<HTMLElement>(".cursor-orb");
    const moveCursorX = cursor
        ? gsap.quickTo(cursor, "x", { duration: 0.42, ease: "power3" })
        : undefined;
    const moveCursorY = cursor
        ? gsap.quickTo(cursor, "y", { duration: 0.42, ease: "power3" })
        : undefined;

    const updatePointerEffects = (event: MouseEvent) => {
        moveCursorX?.(event.clientX);
        moveCursorY?.(event.clientY);

        root.value?.style.setProperty(
            "--pointer-x",
            `${(event.clientX / window.innerWidth) * 100}%`,
        );
        root.value?.style.setProperty(
            "--pointer-y",
            `${(event.clientY / window.innerHeight) * 100}%`,
        );
    }

    window.addEventListener("pointermove", updatePointerEffects, { passive: true });

    cleanupFunctions.push(() => {
        window.removeEventListener("pointermove", updatePointerEffects);
    });

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

        gsap.from(".hero__eyebrow, .hero__subcopy, .hero__actions", {
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

        const getLayoutPosition = (element: HTMLElement) => {
            let left = 0;
            let top = 0;

            for (let current: HTMLElement | null = element; current; current = current.offsetParent as HTMLElement | null) {
                left += current.offsetLeft;
                top += current.offsetTop;
            }

            return { left, top };
        };

        gsap.to(".orbit-copy", {
            rotate: 360,
            duration: 22,
            repeat: -1,
            ease: "none",
        });

        gsap.utils.toArray<HTMLElement>(".mood-card").forEach((card, cardIndex) => {
            const letters = gsap.utils.toArray<HTMLElement>(card.querySelectorAll("[data-fall-letter]"));
            const letterFall = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 12%",
                    end: "bottom top",
                    scrub: 0.45,
                    invalidateOnRefresh: true,
                    toggleClass: { targets: card, className: "mood-card--shedding" },
                },
            });

            letters.forEach((letter, index) => {
            // Repeatable variations keep the bounce stable when reversing or resizing.
            const seed = (index * 7 + cardIndex * 11) % 17;
            const direction = seed % 2 ? -1 : 1;
            const delay = (seed % 9) * 0.012;
            const spread = direction * (18 + seed * 4);
            const impactDistance = () => getLayoutPosition(card).top + card.offsetHeight * 0.48
                + window.innerHeight * 0.78 - getLayoutPosition(letter).top - letter.offsetHeight;
            const bounceHeight = () => window.innerHeight * (0.16 + (seed % 5) * 0.025);

            letterFall
                .fromTo(letter, {
                    x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, autoAlpha: 1,
                }, {
                    x: spread,
                    y: impactDistance,
                    rotation: direction * (18 + seed * 3),
                    duration: 0.42,
                    ease: "power2.in",
                }, delay)
                .to(letter, {
                    scaleX: 1.18,
                    scaleY: 0.62,
                    duration: 0.035,
                    ease: "power1.out",
                }, delay + 0.42)
                .to(letter, {
                    x: spread * 1.65,
                    y: () => impactDistance() - bounceHeight(),
                    rotation: direction * (65 + seed * 4),
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.14,
                    ease: "power2.out",
                }, delay + 0.455)
                .to(letter, {
                    x: spread * 2.1,
                    y: () => impactDistance() + window.innerHeight * 0.08,
                    rotation: direction * (95 + seed * 5),
                    duration: 0.11,
                    ease: "power2.in",
                }, delay + 0.595)
                .to(letter, {
                    y: () => impactDistance() - bounceHeight() * 0.12,
                    duration: 0.115 - delay,
                    ease: "power1.out",
                }, delay + 0.705)
                .to(letter, {
                    x: () => spread * 2.5 + direction * window.innerWidth * 0.16,
                    y: () => impactDistance() + window.innerHeight * 0.85,
                    rotation: direction * (160 + seed * 5),
                    autoAlpha: 0,
                    duration: 0.18,
                    ease: "power2.in",
                }, 0.82);
            });
        });

        gsap.to(".hero__plane", {
            yPercent: 26,
            rotate: 4,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
            gsap.from(element, {
                y: 72,
                opacity: 0,
                rotate: element.dataset.reveal === "tilt" ? -3 : 0,
                duration: 1.05,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true,
                },
            });
        });

        gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((element, index) => {
            gsap.fromTo
            (
                element,
                { xPercent: index % 2 ? 18 : -18 },
                {
                    xPercent: index % 2 ? -10 : 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: element,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.2,
                    },
                },
            );
        });
    }, root.value);

    document.fonts.ready.then(() => {
        if (root.value) {
            ScrollTrigger.refresh();
        }
    });
});

onBeforeUnmount(() => {
    if (clockTimer) {
        clearInterval(clockTimer);
    }

    cleanupFunctions.forEach((cleanup) => {
        cleanup();
    });

    gsapContext?.revert();
})
</script>

<template>
    <div
        ref="root"
        class="kinnor-shell relative min-h-screen overflow-x-clip"
        @click="makeBurst"
    >
        <AppEffects :bursts="bursts" :scroll-progress="scrollProgress" />

        <IntroLoader v-if="showIntro" />

        <SiteNavigation
            :clock="clock"
            :is-open="isNavigationOpen"
            @navigate="scrollToSection"
            @toggle="toggleNavigation"
        />

        <main>
            <HeroSection @navigate="scrollToSection" />

            <StorySection @navigate="scrollToSection" />

            <MotionTicker
                message="&nbsp;✦ LOREM ✦ FUCKiN ✦ IPSUM"
            />

            <MoodSection />

            <MotionTicker
                message="&nbsp;I haven't decided if I think this is cool or not...  ✺ "
                tone="pink"
            />

            <MenuSection />

            <MotionTicker
                message="&nbsp;TWO SPINNY THINGS, ONE PAGE✦ ✦ ✦"
            />

            <MotionTicker
                message="&nbsp;DON'T TALK TO ME ✦ ✦ ✦"
                tone="pink"
                reverse
            />

            <VisitUs />
        </main>

        <SiteFooter @navigate="scrollToSection" />
    </div>
</template>
