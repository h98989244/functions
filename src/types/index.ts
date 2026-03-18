export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  short_desc: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  buy_url: string | null;
  instructions: string | null;
  notice: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  contact_email: string | null;
  contact_phone: string | null;
  tax_id: string | null;
  updated_at: string;
}

export type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  email: string;
  phone: string | null;
  payment_method: string;
  status: string;
  subtotal: number;
  fee: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}
