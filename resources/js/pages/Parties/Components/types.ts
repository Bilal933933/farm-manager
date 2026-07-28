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

export interface Party {
  id: number;
  name: string;
  type: string;
  phone: string | null;
  email: string | null;
  national_id: string | null;
  address: string | null;
  notes: string | null;
  contracts?: Contract[];
  payments?: Payment[];
  purchases?: Purchase[];
}

export interface FinancialSummary {
  totalContractAmount: number;
  totalPaidTo: number;
  totalReceivedFrom: number;
  netBalance: number;
}

export function currency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
