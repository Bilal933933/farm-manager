export interface Land {
  id: number;
  name: string;
}

export interface Contract {
  id: number;
  land_id: number;
  land?: Land | null;
  type: string;
  start_date: string;
  end_date: string | null;
  amount: string;
  paid_amount?: number;
  remaining?: number;
  settlement_type?: string | null;
  share_percentage?: string | null;
}

export interface Payment {
  id: number;
  type: string;
  date: string;
  amount: string;
  notes: string | null;
}

export interface Product {
  id: number;
  name: string;
}

export interface PurchaseItem {
  id: number;
  product: Product | null;
  quantity: string;
  unit_price: string;
}

export interface Purchase {
  id: number;
  date: string;
  payment_type: string;
  items_count: number;
  items_total: number;
  items: PurchaseItem[];
}

export interface Sale {
  id: number;
  date: string;
  quantity: string;
  unit_price: string;
  total?: number;
}

export interface Party {
  id: number;
  name: string;
  type: string;
  category: string | null;
  phone: string | null;
  email: string | null;
  national_id: string | null;
  address: string | null;
  notes: string | null;
  contracts?: Contract[];
  payments?: Payment[];
  purchases?: Purchase[];
  sales?: Sale[];
}

export interface FinancialSummary {
  totalContractAmount: number;
  totalPaidTo: number;
  totalReceivedFrom: number;
  netBalance: number;
  totalPurchases?: number;
  totalSales?: number;
}

export interface FarmerSettlementSeason {
  season_id: number;
  land_name: string;
  planting_date: string;
  harvest_date: string | null;
  settlement_type: string;
  share_percentage: number | null;
  total_revenue: number;
  shared_cost: number;
  farmer_cost: number;
  owner_cost: number;
  net_revenue: number;
  farmer_share: number;
  owner_share: number;
  farmer_share_net: number;
  owner_share_net: number;
  contract_amount: number | null;
}

export interface FarmerSettlementSummary {
  total_farmer_share_net: number;
  total_owner_share_net: number;
  total_farmer_cost: number;
  total_owner_cost: number;
  settlements_count: number;
  settlements: FarmerSettlementSeason[];
}

export interface FarmerSeasonFinancials {
  season_id: number;
  land_name: string;
  planting_date: string;
  harvest_date: string | null;
  settlement_type: string;
  share_percentage: number | null;
  total_revenue: number;
  shared_cost: number;
  farmer_cost: number;
  farmer_share: number;
  farmer_share_net: number;
  advances: number;
  profit: number;
}

export interface FarmerFinancials {
  total_revenue: number;
  total_shared_cost: number;
  total_farmer_share: number;
  total_farmer_share_net: number;
  total_advances: number;
  total_profit: number;
  seasons_count: number;
  seasons: FarmerSeasonFinancials[];
}

export interface LessorContractFinancials {
  contract_id: number;
  land_name: string;
  contract_amount: number;
  paid: number;
  remaining: number;
}

export interface LessorFinancials {
  total_rent_amount: number;
  total_paid: number;
  total_remaining: number;
  contracts: LessorContractFinancials[];
}

export interface LesseeFinancials {
  total_rent_amount: number;
  total_paid: number;
  total_remaining: number;
  contracts: LessorContractFinancials[];
}

export interface SupplierPurchaseFinancials {
  purchase_id: number;
  date: string;
  purchase_total: number;
  paid: number;
  remaining: number;
}

export interface SupplierFinancials {
  total_purchases_amount: number;
  total_paid: number;
  total_remaining: number;
  purchases: SupplierPurchaseFinancials[];
}

export interface MerchantSaleFinancials {
  sale_id: number;
  date: string;
  sale_total: number;
  received: number;
  remaining: number;
}

export interface MerchantFinancials {
  total_sales_amount: number;
  total_received: number;
  total_due: number;
  sales: MerchantSaleFinancials[];
}

export interface AmanatFinancials {
  total_deposited: number;
  total_returned: number;
  total_remaining: number;
}

export function currency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
