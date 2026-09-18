import type { BusinessHour, MenuFrame } from "../types/kinnor";

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
