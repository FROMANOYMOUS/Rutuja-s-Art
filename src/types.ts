export interface Product {
  id: string;
  name: string;
  category: 'flower' | 'garland';
  flowerType: 'hibiscus' | 'marigold' | 'chafa';
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  specs: {
    flowerCount?: number;
    length?: string;
    materials: string[];
    durability: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface OrderRecord {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'ordered' | 'crafting' | 'packed' | 'shipped' | 'delivered';
  courier: string;
  trackingNo: string;
  address: string;
  paymentMode: string;
  paymentType: string;
  paymentStatus: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount?: number;
}
