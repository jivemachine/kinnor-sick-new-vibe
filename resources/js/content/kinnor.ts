import type { BusinessHour, MenuFrame, Mood, MoodTrack } from "../types/kinnor";

export const businessHours: BusinessHour[] = [
    ["MON", "7AM — 6PM"],
    ["TUE", "7AM - 6PM"],
    ["WED", "7AM — 6PM"],
    ["THU", "7AM — 6PM"],
    ["FRI", "7AM — 6PM"],
    ["SAT", "7AM — 6PM"],
    ["SUN", "7AM — 6PM"],
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
        groups: [
            {
                label: "Espresso Drinks",
                items: [
                    {
                        name: "Latte",
                        price: "$5.50",
                        description: "2 oz espresso / 8 oz milk"
                    },
                    {
                        name: "Cappuccino",
                        price: "$4.50",
                        description: "2 oz espresso / 4 oz milk"
                    },
                    {
                        name: "Cortado",
                        price: "$4.00",
                        description: "2 oz espresso / 2 oz milk"
                    },
                    {
                        name: "Double Shot",
                        price: "$3.00",
                        description: "2 oz espresso"
                    },
                    {
                        name: "Cowboy Like Me",
                        price: "$6.50",
                        description: "Cold brew, double shot of espresso, oat milk, and simple syrup.",
                        detail: "Milk substitutions available."
                    },
                    {
                        name: "Americano",
                        price: "$3.00",
                        description: "Double shot of espresso and water.",
                        detail: "Hot or iced. “Cascade” +$0.50."
                    }
                ]
            },
            {
                label: "Filter Coffee",
                items: [
                    {
                        name: "Pour Over",
                        price: "Market price",
                        description: "Ask your server for options."
                    },
                    {
                        name: "Drip",
                        price: "$3.50 / $4.00",
                        description: "12 oz / 16 oz"
                    },
                    {
                        name: "Cold Brew",
                        price: "$5.00 / $6.00",
                        description: "12 oz / 16 oz"
                    }
                ]
            }
        ]
    },
    {
        number: "02",
        label: "NOT COFFEE",
        note: "Tea, sparkle, zero-proof, and everything adjacent.",
        availability: "ALL DAY",
        groups: [
            {
                items: [
                    {
                        name: "Chai Latte",
                        price: "$5.00",
                        description: "Unsweet. Add a double shot +$1.25."
                    },
                    {
                        name: "London Fog",
                        price: "$5.00",
                        description: "Unsweet. Add a double shot +$1.25."
                    },
                    {
                        name: "Pineapple Hibiscus Tea",
                        price: "$5.00"
                    },
                    {
                        name: "Lemonade",
                        price: "$4.00"
                    },
                    {
                        name: "Hot Chocolate",
                        price: "$4.00"
                    },
                    {
                        name: "Iced Black Tea",
                        price: "$3.00"
                    }
                ]
            }
        ]
    },
    {
        number: "03",
        label: "COCKTAILS",
        note: "Lights go down, proof goes up. The menu changes after dark.",
        availability: "AFTER DARK",
        groups: [],
        footer: "FULL MENU / SOON",
    },
    {
        number: "04",
        label: "SPECIALTY SYRUPS",
        note: "A little something extra, made in-house.",
        availability: "ADD TO YOUR DRINK",
        groups: [
            {
                items: [
                    {
                      name: "Sugar & Soul",
                      price: "$1.00",
                      description: "House-made syrup with honey, brown sugar, cinnamon, and vanilla."
                    },
                    {
                      name: "Slow & Steady",
                      price: "$0.75",
                      description: "House-made syrup with maple, vanilla, cinnamon, cardamom, brown sugar, orange juice, and peel."
                    },
                    {
                      name: "Vanilla",
                      price: "$0.75",
                      description: "House-made syrup with hand-scraped vanilla beans."
                    },
                    {
                      name: "Vanilla Lavender",
                      price: "$0.75",
                      description: "House-made syrup with hand-scraped vanilla beans, lavender syrup, and dried lavender flowers."
                    },
                    {
                      name: "Butterscotch",
                      price: "$1.50",
                      description: "House-made butterscotch with butter, heavy cream, brown sugar, and sea salt."
                    },
                    {
                      name: "Mocha",
                      price: "$1.50",
                      description: "House-made chocolate ganache (dairy-free)."
                    },
                    {
                      name: "White Chocolate Mocha",
                      price: "$1.50",
                      description: "Ganache with white chocolate chips and heavy cream."
                    },
                    {
                      name: "Honey",
                      price: "$0.75",
                      description: "House-made honey syrup with Texas wildflower honey."
                    }
                ]
            }
        ]
    },
    {
        number: "05",
        label: "FALL SEASONAL",
        note: "House-made flavors for sweater-weather sipping.",
        availability: "FALL SPECIALS",
        groups: [
            {
                items: [
                    {
                        name: "Pumpkin Pie",
                        description: "House-made syrup with real baked pumpkins, cinnamon, nutmeg, ginger, cloves, and cardamom."
                    },
                    {
                        name: "Fall Cake",
                        description: "House-made syrup with zucchini, cinnamon, and nutmeg."
                    },
                    {
                        name: "Granny Smith",
                        description: "House-made syrup with Granny Smith apples, brown sugar, and cinnamon."
                    },
                    {
                        name: "Smooth Operator",
                        description: "House-made syrup with Granny Smith apples, brown sugar, and cinnamon.",
                        detail: "Topped with a peanut butter whipped cream cheese."
                    }
                ]
            }
        ]
    }
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
