<script setup lang="ts">
import { ref, onMounted } from "vue";
import IntroLoader from "./components/IntroLoader.vue";

const root = ref<HTMLElement | null>(null);

const showIntro = ref(true);

let gsapContext: { revert: () => void } | undefined;

onMounted(async () => {
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
    });
});
</script>

<template>
    <div
        ref="root"
        class="kinnor-shell relative min-h-screen overflow-x-clip"
    >
        <IntroLoader />

    </div>
</template>
