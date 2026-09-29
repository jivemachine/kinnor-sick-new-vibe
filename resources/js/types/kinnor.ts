export type BusinessHour = readonly [day: string, hours: string];

export type MenuFrame = {
    number: string;
    label: string;
    note: string;
    availability: string;
    groups: MenuGroup[];
    footer?: string;
};

export type Mood = {
    id: string;
    time: string;
    title: string;
    note: string;
    color: string;
    frequency: string;
    playlist: MoodPlaylist;
};

export type ClickBurst = {
    id: number;
    x: number;
    y: number;
    glyph: string;
};

export type MoodTrack = {
    title: string;
    artist: string;
    src: string;
    demo?: boolean;
};

export type MoodPlaylist = MoodTrack[] & {
    length: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

export type MenuItem = {
    name: string;
    price?: string;
    description?: string;
    detail?: string;
};

export type MenuGroup = {
    label?: string;
    items: MenuItem[];
};
