import type { BusinessHour } from "../types/kinnor";

export function summarizeStoreHours(hours: BusinessHour[]) {
    if (!hours.length) {
        return { heading: "COME SAY HI", detail: "See you in the room." };
    }

    if (hours.every(([, time]) => time === "CLOSED")) {
        return { heading: "CURRENTLY CLOSED", detail: "Check back for updated hours." };
    }

    const openEveryDay = hours.length === 7 && hours.every(([, time]) => time !== "CLOSED");
    const sameHours = openEveryDay && hours.every(([, time]) => time === hours[0][1]);

    return {
        heading: openEveryDay ? "OPEN EVERY DAY" : "PLAN YOUR VISIT",
        detail: sameHours ? `${hours[0][1]}. See you in the room.` : "See our weekly hours below.",
    };
}
