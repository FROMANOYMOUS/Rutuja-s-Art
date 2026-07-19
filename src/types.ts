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
