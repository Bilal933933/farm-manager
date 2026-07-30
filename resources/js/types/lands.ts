export interface Crop {
  id: number;
  name: string;
}

export interface Season {
  id: number;
  crop_id?: number | null;
  crop_obj?: Crop | null;
  cultivated_area?: string;
  crop?: Crop | null;
  planting_date: string;
  harvest_date?: string;
  expected_cost?: string;
  status: string;
  notes?: string;
  farmer_id?: number | null;
  farmer_contract_id?: number | null;
  farmer?: { id: number; name: string } | null;
  harvests?: { id: number; date: string; quantity: string }[];
}

export interface SeasonStats {
  total_harvest: number;
  total_sold_qty: number;
  total_sales: number;
  total_cost: number;
  profit: number;
}

export interface StockProductOption {
  id: number;
  name: string;
  unit: string;
  category: string;
  last_purchase_price: number | null;
}

export interface CostData {
  id: number;
  season_id?: number;
  crop_name?: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  notes: string | null;
  land_id?: number | null;
  land_season_id?: number | null;
  land?: { id: number; name: string } | null;
  land_season?: { id: number } | null;
  crop?: { id: number; name: string } | null;
  borne_by?: string;
}

export interface SaleData {
  id: number;
  date: string;
  quantity: string;
  unit_price: string;
  total: number;
  unit?: string;
  party: { id: number; name: string } | null;
  harvest: { land_season_id: number } | null;
}

export interface Contract {
  id: number;
  type: string;
  settlement_type?: string | null;
  share_percentage?: string | null;
  start_date: string;
  end_date?: string;
  amount: string;
  paid_amount?: number;
  remaining?: number;
  party_id?: number | null;
  party?: { id: number; name: string; type: string } | null;
}

export interface Land {
  id: number;
  name: string;
  location: string | null;
  area: string;
  area_unit: string;
  status: string;
  notes: string | null;
  seasons?: Season[];
  contracts?: Contract[];
  [key: string]: unknown;
}
