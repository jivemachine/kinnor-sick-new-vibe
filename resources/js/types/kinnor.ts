export type BusinessHour = readonly [day: string, hours: string];

export type MenuFrame = {
    number: string;
    label: string;
    note: string;
    availability: string;
};

export type Mood = {
    id: string;
    time: string;
    title: string;
    note: string;
    color: string;
    frequency: string;
};

export type ClickBurst = {
    id: number;
    x: number;
    y: number;
    glyph: string;
};
