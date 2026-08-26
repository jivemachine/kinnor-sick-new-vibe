<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

type Mood = {
  id: string;
  time: string;
  title: string;
  note: string;
  color: string;
  frequency: string;
};

const root = ref<HTMLElement | null>(null);
const navOpen = ref(false);
const showIntro = ref(true);
const scrollProgress = ref(0);
const selectedMood = ref("slow");
const clock = ref("");
const bursts = ref<Array<{ id: number; x: number; y: number; glyph: string }>>([]);

const moods: Mood[] = [
  {
    id: "slow",
    time: "07:03",
    title: "Slow / Bright",
    note: "First light, soft voices, something carefully dialed in.",
    color: "#f0ff54",
    frequency: "easy morning",
  },
  {
    id: "spark",
    time: "14:17",
    title: "Make / Meet",
    note: "A table, a friend, a half-finished idea worth staying for.",
    color: "#ff82a9",
    frequency: "creative static",
  },
  {
    id: "night",
    time: "21:42",
    title: "Low / Glowing",
    note: "Coffee gives way to cocktails. The room keeps humming.",
    color: "#ff5b3d",
    frequency: "after-dark glow",
  },
];

const selected = computed(() => moods.find((mood) => mood.id === selectedMood.value) ?? moods[0]);

const hours = [
  ["MON", "7AM — 7PM"],
  ["TUE", "CLOSED"],
  ["WED", "7AM — 7PM"],
  ["THU", "7AM — 7PM"],
  ["FRI", "7AM — 10PM"],
  ["SAT", "7AM — 10PM"],
  ["SUN", "7AM — 7PM"],
];

const menuFrames = [
  { number: "01", label: "COFFEE", note: "Espresso, filter, and the good weird stuff." },
  { number: "02", label: "NOT COFFEE", note: "Tea, sparkle, zero-proof, and everything adjacent." },
  { number: "03", label: "COCKTAILS", note: "The room changes after dark. So does the menu." },
];

let clockTimer: ReturnType<typeof setInterval> | undefined;
let gsapContext: { revert: () => void } | undefined;
const cleanupFns: Array<() => void> = [];

function updateClock() {
  clock.value = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function scrollToSection(id: string) {
  navOpen.value = false;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateScroll() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = available > 0 ? Math.min(window.scrollY / available, 1) : 0;
}

function makeBurst(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.closest("a, button")) return;
  const id = Date.now() + Math.random();
  const glyphs = ["✦", "●", "✳", "◆"];
  bursts.value.push({
    id,
    x: event.clientX,
    y: event.clientY,
    glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
  });
  window.setTimeout(() => {
    bursts.value = bursts.value.filter((burst) => burst.id !== id);
  }, 850);
}

function tiltCard(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  card.style.setProperty("--tilt-x", `${y * -8}deg`);
  card.style.setProperty("--tilt-y", `${x * 10}deg`);
}

function resetTilt(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement;
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
}

onMounted(async () => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
  cleanupFns.push(() => window.removeEventListener("scroll", updateScroll));

  await nextTick();
  if (!root.value) return;

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
  const xTo = cursor ? gsap.quickTo(cursor, "x", { duration: 0.42, ease: "power3" }) : undefined;
  const yTo = cursor ? gsap.quickTo(cursor, "y", { duration: 0.42, ease: "power3" }) : undefined;

  const pointerMove = (event: PointerEvent) => {
    xTo?.(event.clientX);
    yTo?.(event.clientY);
    root.value?.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
    root.value?.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
  };
  window.addEventListener("pointermove", pointerMove, { passive: true });
  cleanupFns.push(() => window.removeEventListener("pointermove", pointerMove));

  gsapContext = gsap.context(() => {
    const loader = gsap.timeline({ defaults: { ease: "expo.out" } });
    loader
      .fromTo(".loader__slice", { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.07 })
      .fromTo(".loader__logo", { rotate: -8, scale: 0.72 }, { rotate: 0, scale: 1, duration: 0.8 }, "<0.1")
      .to(".intro-loader", {
        yPercent: -105,
        duration: 1.1,
        ease: "expo.inOut",
        delay: 0.25,
        onComplete: () => (showIntro.value = false),
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

    gsap.to(".hero__plane", {
      yPercent: 26,
      rotate: 4,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
    });
    gsap.to(".orbit-copy", { rotate: 360, duration: 22, repeat: -1, ease: "none" });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
      gsap.from(element, {
        y: 72,
        opacity: 0,
        rotate: element.dataset.reveal === "tilt" ? -3 : 0,
        duration: 1.05,
        ease: "expo.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((element, index) => {
      gsap.fromTo(
        element,
        { xPercent: index % 2 ? 18 : -18 },
        {
          xPercent: index % 2 ? -10 : 10,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 1.2 },
        },
      );
    });
  }, root.value);
});

onBeforeUnmount(() => {
  if (clockTimer) clearInterval(clockTimer);
  cleanupFns.forEach((cleanup) => cleanup());
  gsapContext?.revert();
});
</script>

<template>
    <div ref="root" class="kinnor-shell min-h-screen relative overflow-x-clip" @click="makeBurst">
        <div v-if="showIntro" class="intro-loader" aria-hidden="true">
            <div class="loader__slice loader__slice--lime" />
            <div class="loader__slice loader__slice--pink" />
            <div class="loader__slice loader__slice--orange" />
            <img class="loader__logo" :src="'/kinnor-logo.avif'" alt="" />
            <p>COFFEE / COCKTAILS / COMMUNITY</p>
        </div>

        <p class="text-center mt-90">hi</p>
    </div>


</template>

<style>

@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=Syne:wght@500;700;800&display=swap");

:root {
    --ink: #13232e;
    --blue: #2e4759;
    --blue-dark: #1f3442;
    --cream: #f4f0e8;

    --lime: #f0ff54;
    --pink: #ff82a9;
    --orange: #ff5b3d;
    --electric: #4774ff;

    --line: 2px solid var(--ink);
}

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

.loader__logo { position: relative; z-index: 3; width: clamp(9rem, 18vw, 16rem); }
.loader__slice { position: absolute; inset: 0; transform-origin: left; }
.loader__slice--lime { background: var(--lime); }
.loader__slice--pink { inset: 25% 0 0; background: var(--pink); }
.loader__slice--orange { inset: 60% 0 0; background: var(--orange); }


</style>
