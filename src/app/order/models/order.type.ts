export interface Order {
  id?: number;
  orderNumber?: string;
  orderDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  customerId: number;
  companyId: number;
  items: OrderItem[];
  notes?: string;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
} 