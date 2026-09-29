import type { BusinessHour, MenuFrame, Mood, MoodTrack } from "../types/kinnor";

export const businessHours: BusinessHour[] = [
    ["MON", "7AM — 7PM"],
    ["TUE", "CLOSED"],
    ["WED", "7AM — 7PM"],
    ["THU", "7AM — 7PM"],
    ["FRI", "7AM — 10PM"],
    ["SAT", "7AM — 10PM"],
    ["SUN", "7AM — 7PM"],
];

// export const menuFrames: MenuFrame[] = [
//     {
//         number: "01",
//         label: "COFFEE",
//         note: "Espresso, filter, and the good weird stuff.",
//         availability: "ALL DAY",
//     },
//     {
//         number: "02",
//         label: "NOT COFFEE",
//         note: "Tea, sparkle, zero-proof, and everything adjacent.",
//         availability: "ALL DAY",
//     },
//     {
//         number: "03",
//         label: "COCKTAILS",
//         note: "The room changes after dark. So does the menu.",
//         availability: "AFTER DARK",
//     },
// ];
export const menuFrames: MenuFrame[] = [
    {
        number: "01",
        label: "COFFEE",
        note: "Espresso, java, pour overs, and the like.",
        availability: "ALL DAY",
    },
    {
        number: "02",
        label: "NOT COFFEE",
        note: "Tea, sparkle, zero-proof, and everything adjacent.",
        availability: "ALL DAY",
    },
    {
        number: "03",
        label: "COCKTAILS",
        note: "Lights go down, proof goes up. The menu changes after dark.",
        availability: "AFTER DARK",
    },
];

const demoTracks: MoodTrack[] = [
    {
        title: "SoundHelix Song 1",
        artist: "T. Schürger",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        demo: true,
    },
    {
        title: "SoundHelix Song 2",
        artist: "T. Schürger",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        demo: true,
    },
    {
        title: "SoundHelix Song 3",
        artist: "T. Schürger",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        demo: true,
    },
];

const morningTracks: MoodTrack[] = [
    {
        title: "In A Sentimental Mood",
        artist: "John Coltrane",
        src: "/music/morning/in-a-sentimental-mood.mp3",
        demo: false,
    },
    {
        title: "Once In A Lifetime",
        artist: "Talking Heads",
        src: "/music/morning/once-in-a-lifetime.mp3",
        demo: false,
    },
    {
        title: "Dirty Work",
        artist: "Steely Dan",
        src: "/music/morning/dirty-work.mp3",
        demo: false,
    },
];

const afternoonTracks: MoodTrack[] = [
    {
        title: "Moonage Daydream",
        artist: "David Bowie",
        src: "/music/afternoon/moonage-daydream.mp3",
        demo: false,
    },
    {
        title: "Dance Yrself Clean",
        artist: "LCD Soundsystem",
        src: "/music/afternoon/dance-yrself-clean.mp3",
        demo: false,
    },
    {
        title: "Witches",
        artist: "Alice Phoebe Lou",
        src: "/music/afternoon/witches.mp3",
        demo: false,
    },
];

const nightTracks: MoodTrack[] = [
    {
        title: "Everybody Wants To Rule The World",
        artist: "Tears for Fears",
        src: "/music/night/everybody-wants-to-rule-the-world.mp3",
        demo: false,
    },
    {
        title: "I Wanna Be Your Lover",
        artist: "Prince",
        src: "/music/night/i-wanna-be-your-lover.mp3",
        demo: false,
    },
    {
        title: "Weird Fishes / Arpeggi",
        artist: "Radiohead",
        src: "/music/night/weird-fishes-arpeggi.mp3",
        demo: false,
    },
];


export const moods: Mood[] = [
    {
      id: "slow",
      time: "07:03",
      title: "Slow / Morning",
      note: "First light, soft voices, carefully dialed in.",
      color: "#f0ff54",
      frequency: "easy morning",
      playlist: [morningTracks[0], morningTracks[1], morningTracks[2]],
    },
    {
      id: "spark",
      time: "14:17",
      title: "Make Meet / Afternoon",
      note: "A table, a friend, a half-finished idea worth staying for.",
      color: "#ff82a9",
      frequency: "a creative afternoon",
      playlist: [afternoonTracks[0], afternoonTracks[1], afternoonTracks[2]],
    },
    {
      id: "night",
      time: "21:42",
      title: "Low Light / Night",
      note: "Coffee to cocktails. The room keeps humming.",
      color: "#ff5b3d",
      frequency: "after-dark low-light evening",
      playlist: [nightTracks[0], nightTracks[1], nightTracks[2]],
    },
];
