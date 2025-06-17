export interface Order {
  id?: string;
  orderNumber?: string;
  orderDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  customerId: string;
  enterpriseId: string;
  items: OrderItem[];
  notes?: string;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
} 