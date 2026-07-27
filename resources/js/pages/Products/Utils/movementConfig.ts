import { ShoppingCart, Truck, RefreshCw, Trash2, AlertTriangle, RotateCcw } from 'lucide-react';

export const movementTypeIcons: Record<string, typeof Truck> = {
  داخل: ShoppingCart,
  خارج: Truck,
};

export const reasonIcons: Record<string, typeof Truck> = {
  شراء: ShoppingCart,
  صرف: Truck,
  جرد: RefreshCw,
  إتلاف: Trash2,
  مرتجع: RotateCcw,
  تصحيح: AlertTriangle,
};

export const movementTypeColors: Record<string, string> = {
  داخل: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  خارج: 'text-rose-700 bg-rose-50 border border-rose-200',
};
