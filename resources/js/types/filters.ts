export interface SeasonFilterValues {
    land_id?: string;
    land_season_id?: string;
}

export interface LandOption {
    id: number;
    name: string;
}

export interface SeasonOption {
    id: number;
    land_id: number;
    label: string;
    planting_date?: string;
}
