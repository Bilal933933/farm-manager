export interface DashboardStats {
    activeLands: number;
    totalLands: number;
    activeSeasons: number;
    salesTotal: number;
    costsTotal: number;
    profit: number;
}

export interface DashboardSeason {
    id: number;
    land_id: number;
    land_name: string;
    crop_name: string;
    planting_date: string | null;
    costs_total: number;
    status: string;
}

export interface DashboardSale {
    id: number;
    date: string | null;
    crop_name: string;
    party_name: string;
    quantity: number;
    total: number;
}

export interface DashboardPartyBalance {
    id: number;
    name: string;
    category: string;
    kind: 'receivable' | 'payable';
    amount: number;
}
