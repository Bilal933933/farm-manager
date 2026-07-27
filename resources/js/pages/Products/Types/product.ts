export interface Movement {
  id: number;
  type: string;
  reason: string;
  quantity: number;
  unit_price: number | null;
  movement_date: string;
  notes: string | null;
}

export interface Product {
  id: number;
  code: string | null;
  name: string;
  category: string;
  unit: string;
  status: string;
  display_order: number;
  notes: string | null;
  last_purchase_price: number | null;
  stock_balance: number;
  stock_movements: Movement[];
}

export interface ShowProps {
  product: Product;
}
