<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import type { Mood } from "../types/kinnor";

type PlaybackState = "stopped" | "loading" | "playing" | "paused" | "ended" | "blocked" | "error" | "empty";
const MAX_PLAYLIST_TRACKS = 10;

const emit = defineEmits<{ close: [] }>();
const audio = ref<HTMLAudioElement | null>(null);
const activeMood = ref<Mood | null>(null);
const isVisible = ref(false);
const isMinimized = ref(false);
const isPlaylistVisible = ref(false);
const trackIndex = ref(0);
const isMuted = ref(false);
const volume = ref(25);
const currentTime = ref(0);
const duration = ref(0);
const playbackState = ref<PlaybackState>("stopped");
let playRequest = 0;

const playlist = computed(() => activeMood.value?.playlist.slice(0, MAX_PLAYLIST_TRACKS) ?? []);
const activeTrack = computed(() => playlist.value[trackIndex.value]);
const hasPrevious = computed(() => trackIndex.value > 0);
const hasNext = computed(() => trackIndex.value < playlist.value.length - 1);
const trackPosition = computed(() => playlist.value.length ? `${trackIndex.value + 1} / ${playlist.value.length}` : "0 / 0");
const isPlaying = computed(() => playbackState.value === "playing");
const canPause = computed(() => isPlaying.value || playbackState.value === "loading");
const isSilent = computed(() => isMuted.value || volume.value === 0);
const statusLabel = computed(() => ({
    stopped: "Stopped",
    loading: "Tuning in…",
    playing: isSilent.value ? "Playing · muted" : "Playing",
    paused: "Paused",
    ended: "Playlist finished · play again",
    blocked: "Press play to tune in",
    error: "Track unavailable · try play again",
    empty: "No songs in this mood yet",
})[playbackState.value]);

function formatTime(seconds: number) {
    const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

function updateTime() {
    if (!audio.value) return;
    currentTime.value = audio.value.currentTime;
    duration.value = Number.isFinite(audio.value.duration) ? audio.value.duration : 0;
}

function seek(event: Event) {
    if (!audio.value || !duration.value) return;
    audio.value.currentTime = Math.min(duration.value, Number((event.target as HTMLInputElement).value));
    updateTime();
}

function updateVolume() {
    if (!audio.value) return;
    isMuted.value = audio.value.muted;
    volume.value = Math.round(audio.value.volume * 100);
}

async function play() {
    const element = audio.value;
    if (!element || !activeTrack.value) return;

    if (playbackState.value === "ended") {
        selectTrack(0);
        return;
    }

    const request = ++playRequest;
    if (element.error) element.load();
    playbackState.value = "loading";

    try {
        await element.play();
        if (request === playRequest && !element.paused) playbackState.value = "playing";
    } catch (error) {
        if (request !== playRequest) return;
        playbackState.value = error instanceof DOMException && error.name === "NotAllowedError"
            ? "blocked"
            : "error";
    }
}

function pause() {
    ++playRequest;
    audio.value?.pause();
    playbackState.value = "paused";
}

function stop() {
    ++playRequest;
    const element = audio.value;
    if (element) {
        element.pause();
        element.currentTime = 0;
    }
    currentTime.value = 0;
    playbackState.value = activeTrack.value ? "stopped" : "empty";
}

function toggleMute() {
    const element = audio.value;
    if (!element) return;
    if (isSilent.value) {
        element.muted = false;
        if (element.volume === 0) element.volume = .25;
    } else {
        element.muted = true;
    }
    updateVolume();
}

function setVolume(event: Event) {
    const element = audio.value;
    if (!element) return;
    element.volume = Number((event.target as HTMLInputElement).value) / 100;
    element.muted = element.volume === 0;
    updateVolume();
}

function close() {
    stop();
    isVisible.value = false;
    emit("close");
}

function tuneIn(mood: Mood) {
    const element = audio.value;
    if (!element) return;
    isVisible.value = true;

    if (activeMood.value?.id !== mood.id) {
        stop();
        activeMood.value = mood;
        trackIndex.value = 0;
        duration.value = 0;
        if (!activeTrack.value) {
            element.removeAttribute("src");
            element.load();
            playbackState.value = "empty";
            return;
        }
        selectTrack(0);
        return;
    }

    if (element.paused) void play();
}

function selectTrack(index: number) {
    const element = audio.value;
    const track = playlist.value[index];
    if (!element || !track) return;

    stop();
    trackIndex.value = index;
    duration.value = 0;
    element.src = track.src;
    element.volume = volume.value / 100;
    element.load();
    void play();
}

function previousTrack() {
    if (hasPrevious.value) selectTrack(trackIndex.value - 1);
}

function nextTrack() {
    if (hasNext.value) selectTrack(trackIndex.value + 1);
}

function onEnded() {
    if (!audio.value?.ended || !isVisible.value || !canPause.value) return;
    if (hasNext.value) {
        nextTrack();
    } else {
        ++playRequest;
        playbackState.value = "ended";
    }
}

function onPlaying() {
    if (audio.value && !audio.value.paused) playbackState.value = "playing";
}

function onPause() {
    if (audio.value?.paused && !audio.value.ended && canPause.value) playbackState.value = "paused";
}

function onWaiting() {
    if (audio.value && !audio.value.paused) playbackState.value = "loading";
}

function onError() {
    if (audio.value?.error) {
        ++playRequest;
        playbackState.value = "error";
    }
}

onBeforeUnmount(() => {
    ++playRequest;
    if (!audio.value) return;
    audio.value.pause();
    audio.value.removeAttribute("src");
    audio.value.load();
});

defineExpose({ tuneIn });
</script>

<template>
    <audio
        ref="audio"
        preload="none"
        @timeupdate="updateTime"
        @loadedmetadata="updateTime"
        @durationchange="updateTime"
        @volumechange="updateVolume"
        @playing="onPlaying"
        @pause="onPause"
        @waiting="onWaiting"
        @ended="onEnded"
        @error="onError"
    ></audio>

    <Teleport to="body">
        <Transition name="radio">
            <aside
                v-if="isVisible && activeMood"
                class="mood-player"
                :class="{ 'mood-player--mini': isMinimized }"
                :style="{ '--station-color': activeMood.color }"
                aria-label="Kinnor mood music player"
                @click.stop
                @keydown.esc.stop="close"
            >
                <header class="player-titlebar">
                    <span class="player-brand">KINNOR RADIO</span>
                    <span v-if="isMinimized" class="player-mini-track">{{ activeTrack?.title ?? 'No songs yet' }}</span>
                    <span v-else class="player-version">A LITTLE BACKGROUND COMPANY</span>
                    <button
                        v-if="isMinimized"
                        class="player-window-button"
                        type="button"
                        :aria-label="canPause ? 'Pause' : 'Play'"
                        :title="canPause ? 'Pause' : 'Play'"
                        :disabled="!activeTrack"
                        @click="canPause ? pause() : play()"
                    >{{ canPause ? 'Ⅱ' : '▶' }}</button>
                    <button>{{ isMinimized ? '▣' : '−' }}</button>
                    <button class="player-window-button" type="button" aria-label="Close player and stop music" title="Close and stop" @click="close">×</button>
                </header>
                <div v-show="!isMinimized" class="player-body">
                    <div class="player-display">
                        <div class="player-track">
                            <span class="player-station">{{ activeMood.frequency }}</span>
                            <strong :title="activeTrack?.title">{{ activeTrack?.title ?? 'No songs yet' }}</strong>
                            <span class="player-artist">{{ activeTrack?.artist ?? activeMood.title }}</span>
                        </div>
                        <div class="player-equalizer" :class="{ 'player-equalizer--active': isPlaying && !isSilent }" aria-hidden="true">
                            <i v-for="(height, index) in [35, 60, 45, 80, 100, 75, 90, 55, 40, 65]" :key="index" :style="{ '--bar-height': `${height}%`, '--bar-delay': `${index * -.13}s` }" />
                        </div>
                    </div>
                    <div class="player-timeline">
                        <span>{{ formatTime(currentTime) }}</span>
                        <input
                            class="player-seek"
                            type="range"
                            min="0"
                            :max="duration || 1"
                            step="any"
                            :value="currentTime"
                            :disabled="!duration"
                            :style="{ '--progress': `${duration ? currentTime / duration * 100 : 0}%` }"
                            :aria-valuetext="`${formatTime(currentTime)} of ${formatTime(duration)}`"
                            aria-label="Song position"
                            @input="seek"
                        />
                        <span>{{ formatTime(duration) }}</span>
                    </div>
                    <div class="player-controls">
                        <div class="player-transport" role="group" aria-label="Playback controls">
                            <button class="player-control" type="button" aria-label="Previous track" title="Previous track" :disabled="!hasPrevious" @click="previousTrack">
                                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3h3v14H3zm14 0L7 10l10 7z" /></svg>
                                <span>PREV</span>
                            </button>
                            <button class="player-control" type="button" aria-label="Stop" title="Stop and rewind" :disabled="!activeTrack" @click="stop">
                                <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="4" width="12" height="12" rx="1" /></svg>
                                <span>STOP</span>
                            </button>
                            <button class="player-control" type="button" aria-label="Pause" title="Pause" :disabled="!canPause" @click="pause">
                                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3h4v14H4zM12 3h4v14h-4z" /></svg>
                                <span>PAUSE</span>
                            </button>
                            <button class="player-control player-control--play" type="button" aria-label="Play" title="Play" :disabled="canPause || !activeTrack" @click="play">
                                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 2 13 8-13 8z" /></svg>
                                <span>PLAY</span>
                            </button>
                            <button class="player-control" type="button" aria-label="Next track" title="Next track" :disabled="!hasNext" @click="nextTrack">
                                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M14 3h3v14h-3zM3 3l10 7-10 7z" /></svg>
                                <span>NEXT</span>
                            </button>
                            <button class="player-control" type="button" :aria-label="isSilent ? 'Unmute' : 'Mute'" :title="isSilent ? 'Unmute' : 'Mute'" :aria-pressed="isSilent" @click="toggleMute">
                                <svg viewBox="0 0 20 20" aria-hidden="true">
                                    <path d="M2 7h4l5-4v14l-5-4H2z" />
                                    <path v-if="isSilent" d="m14 7 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="1.8" />
                                    <path v-else d="M14 6q5 4 0 8m2-11q8 7 0 14" fill="none" stroke="currentColor" stroke-width="1.5" />
                                </svg>
                                <span>{{ isSilent ? 'UNMUTE' : 'MUTE' }}</span>
                            </button>
                        </div>
                    </div>
                    <div class="player-queue-bar">
                        <button class="player-playlist-toggle" type="button" :aria-expanded="isPlaylistVisible" aria-controls="mood-player-playlist" @click="isPlaylistVisible = !isPlaylistVisible">
                            {{ isPlaylistVisible ? 'HIDE PLAYLIST' : 'SHOW PLAYLIST' }}
                            <span>{{ trackPosition }}</span>
                            <span aria-hidden="true">{{ isPlaylistVisible ? '▴' : '▾' }}</span>
                        </button>
                        <label class="player-volume">
                            <span>VOLUME</span>
                            <input type="range" min="0" max="100" step="1" :value="volume" :aria-valuetext="`${volume}%${isMuted ? ', muted' : ''}`" aria-label="Volume" @input="setVolume" />
                        </label>
                    </div>
                    <ol v-show="isPlaylistVisible" id="mood-player-playlist" class="player-playlist" :aria-label="`${activeMood.title} playlist`">
                        <li v-for="(track, index) in playlist" :key="`${index}-${track.src}`">
                            <button type="button" :aria-current="index === trackIndex ? 'true' : undefined" :aria-label="`Play track ${index + 1}: ${track.title} by ${track.artist}`" @click="selectTrack(index)">
                                <span class="player-playlist-number">{{ String(index + 1).padStart(2, '0') }}</span>
                                <span class="player-playlist-track"><strong>{{ track.title }}</strong><span>{{ track.artist }}</span></span>
                                <span v-if="index === trackIndex" class="player-playlist-current" aria-hidden="true">{{ isPlaying ? '▶' : '•' }}</span>
                            </button>
                        </li>
                        <li v-if="!playlist.length" class="player-playlist-empty">This mood is waiting for its first song.</li>
                    </ol>
                    <footer class="player-footer">
                        <span class="player-status" role="status">{{ statusLabel }}</span>
                        <a v-if="activeTrack?.demo" href="https://www.soundhelix.com/audio-examples" target="_blank" rel="noopener noreferrer">DEMO TRACK ↗</a>
                        <span v-else>YOUR DAY, YOUR FREQUENCY</span>
                    </footer>
                </div>
            </aside>
        </Transition>
    </Teleport>

</template>

<style scoped>
.mood-player {
    position: fixed;
    z-index: 120;
    right: max(1.25rem, env(safe-area-inset-right));
    bottom: max(1.25rem, env(safe-area-inset-bottom));
    width: min(360px, calc(100vw - 2rem));
    overflow: hidden;
    color: #242b2d;
    border: 1px solid #606466;
    border-radius: 5px;
    background: linear-gradient(110deg, #f0f0ed, #c8ccca 48%, #e7e9e6);
    box-shadow: inset 0 0 0 1px #fff, 0 8px 28px #0003, 0 2px 4px #0002;
    font: 11px/1.25 Arial, Helvetica, sans-serif;
    color-scheme: light;
}

.mood-player button,
.mood-player input,
.mood-player a { cursor: pointer; }

.mood-player button { font: inherit; }

.mood-player button:focus-visible,
.mood-player input:focus-visible,
.mood-player a:focus-visible {
    outline: 2px solid #23536e;
    outline-offset: 2px;
}

.player-titlebar {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 29px;
    padding: 3px 5px 3px 9px;
    border-bottom: 1px solid #a0a5a2;
    background: linear-gradient(#f8f8f6, #d0d3d0);
}

.player-led {
    flex: 0 0 6px;
    height: 6px;
    border-radius: 50%;
    background: #788077;
    box-shadow: inset 0 1px 2px #0006;
}

.player-led--on { background: #4dba3b; box-shadow: 0 0 4px #4dba3b88; }
.player-brand { flex-shrink: 0; font-size: 9px; font-weight: 700; letter-spacing: .07em; }
.player-version { flex: 1; font-size: 6px; letter-spacing: .045em; text-align: right; }
.player-mini-track { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 10px; }

.player-window-button {
    flex: 0 0 23px;
    height: 23px;
    padding: 0;
    color: #3b4446;
    border: 1px solid #8d9290;
    border-radius: 2px;
    background: linear-gradient(#fff, #c9ceca);
    box-shadow: inset 1px 1px #fff;
}

.player-body { padding: 8px 9px 0; }

.player-display {
    display: flex;
    align-items: end;
    gap: 10px;
    min-height: 62px;
    padding: 7px 9px;
    color: #f8f9ef;
    border: 1px solid #747b70;
    border-radius: 2px;
    background: linear-gradient(120deg, #0c1818, #1e2926);
    box-shadow: inset 1px 2px 3px #000b, 0 1px #fff;
}

.player-track { flex: 1; min-width: 0; display: grid; gap: 2px; }
.player-station { color: var(--station-color); font: 8px/1.3 "DM Mono", monospace; letter-spacing: .07em; text-transform: uppercase; }
.player-track strong { overflow: hidden; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; }
.player-artist { overflow: hidden; color: #bdc8bc; font-size: 10px; white-space: nowrap; text-overflow: ellipsis; }
.player-equalizer { display: flex; align-items: end; gap: 2px; flex: 0 0 58px; height: 36px; padding-bottom: 2px; }

.player-equalizer i {
    width: 4px;
    height: var(--bar-height);
    background: repeating-linear-gradient(to top, transparent 0 3px, #16221e 3px 5px), linear-gradient(to top, #6bb841 0 45%, #e2c951 45% 78%, #df6846 78%);
    transform: scaleY(.15);
    transform-origin: bottom;
}

.player-equalizer--active i { animation: equalize .9s var(--bar-delay) ease-in-out infinite alternate; }
.player-timeline { display: flex; align-items: center; gap: 7px; margin: 7px 0; font: 9px/1 "DM Mono", monospace; }

.player-seek {
    appearance: none;
    flex: 1;
    min-width: 0;
    width: 100%;
    height: 5px;
    margin: 5px 0;
    border: 1px solid #90988d;
    border-radius: 0;
    background: linear-gradient(to right, #c6e684 var(--progress), #6f7a6d var(--progress));
}

.player-seek::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 13px;
    border: 1px solid #7e8979;
    border-radius: 2px;
    background: linear-gradient(#fff, #c4cdbb);
}

.player-seek::-moz-range-thumb {
    width: 8px;
    height: 11px;
    border: 1px solid #7e8979;
    border-radius: 2px;
    background: linear-gradient(#fff, #c4cdbb);
}
.player-controls { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.player-transport { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; width: 100%; }

.player-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    width: 100%;
    height: 42px;
    padding: 3px;
    color: #4e5855;
    border: 1px solid #8b9390;
    border-radius: 3px;
    background: linear-gradient(#fff 0%, #e9ece8 45%, #c1c8c2 50%, #e4e8e2 100%);
    box-shadow: inset 1px 1px #fff, inset -1px -1px #b0b7b1, 0 1px 1px #0002;
}

.player-control svg { width: 19px; height: 19px; fill: currentColor; filter: drop-shadow(0 1px 0 #fff); }
.player-control span { font: 7px/1 Arial, sans-serif; color: #333c36; }
.player-control--play svg { color: #26802c; }
.player-control:disabled { cursor: default; opacity: .5; }
.player-control:disabled.player-control--play { opacity: 1; background: linear-gradient(#d9e8cf, #c3d3b8); }
.player-control:not(:disabled):active,
.player-window-button:active { box-shadow: inset 1px 2px 3px #0004; background: #c6cdc5; }
.player-control[aria-pressed="true"] { background: #c6cdc5; box-shadow: inset 1px 1px 3px #0003; }
.player-volume { display: flex; align-items: center; gap: 7px; min-width: 0; flex: 1; font-size: 8px; letter-spacing: .08em; }
.player-volume input { width: 100%; min-width: 0; height: 14px; margin: 0; accent-color: #52664d; }
.player-footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; min-height: 25px; margin-top: 6px; border-top: 1px solid #a7aea6; font-size: 9px; }
.player-footer a { flex-shrink: 0; color: #46553e; font-size: 7px; text-underline-offset: 2px; }
.player-footer > span:last-child:not(.player-status) { font-size: 7px; }

.player-queue-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 7px;
}

.player-playlist-toggle {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 28px;
    padding: 3px 0;
    color: #333c36;
    border: 0;
    background: transparent;
    font-size: 8px !important;
}

.player-playlist-toggle span:first-child {
    font-variant-numeric: tabular-nums;
    color: #4d5e48;
}

.player-playlist {
    max-height: min(220px, 30dvh);
    overflow-y: auto;
    overscroll-behavior: contain;
    margin: 5px 0 0;
    padding: 3px;
    list-style: none;
    border: 1px solid #9ca39b;
    background: #f5f6ef;
    box-shadow: inset 1px 1px 2px #0002;
}

.player-playlist button {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    min-height: 43px;
    padding: 6px;
    color: #333c36;
    border: 0;
    background: transparent;
    text-align: left;
}

.player-playlist button:hover,
.player-playlist button[aria-current="true"] {
    background: #dce6d3;
}

.player-playlist button:focus-visible { outline-offset: -2px; }
.player-playlist-number { font-size: 9px; font-variant-numeric: tabular-nums; }
.player-playlist-track { flex: 1; display: grid; gap: 2px; min-width: 0; }
.player-playlist-track strong,
.player-playlist-track > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.player-playlist-track strong { font-size: 11px; }
.player-playlist-track > span { font-size: 9px; color: #52634e; }
.player-playlist-current { color: #28702b; font-size: 10px; }
.player-playlist-empty { padding: 10px; color: #52634e; }
.mood-player--mini .player-titlebar { min-height: 36px; border-bottom: 0; }
.radio-enter-active, .radio-leave-active { transition: opacity .2s, transform .2s; }
.radio-enter-from, .radio-leave-to { opacity: 0; transform: translateY(12px); }

@keyframes equalize { from { transform: scaleY(.25); } to { transform: scaleY(1); } }

@media (max-width: 560px) {
  .mood-player { right: max(12px, env(safe-area-inset-right)); bottom: max(12px, env(safe-area-inset-bottom)); width: min(360px, calc(100vw - 24px)); }
  .player-window-button { flex-basis: 28px; height: 28px; }
  .player-version { font-size: 0; }
  .player-control { height: 44px; }
  .player-queue-bar { gap: 10px; }
  .player-volume { gap: 4px; }
  .player-volume > span { font-size: 7px; }
}

@media (prefers-reduced-motion: reduce) {
  .player-equalizer--active i { animation: none; transform: scaleY(.65); }
  .radio-enter-active, .radio-leave-active { transition: none; }
}
</style>
