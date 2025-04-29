export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  photo?: string;
  companyId: number;
} 