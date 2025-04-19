
export interface Product {
  id: string;
  name: string;
  description: string;
  price: {
    original: number;
    current: number;
  };
  discount: number; // Percentage discount
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  dealEnds?: string; // ISO date string for deal end time
  dealType?: 'flash' | 'clearance' | 'limited'; // Type of deal
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = 
  | 'electronics' 
  | 'fashion' 
  | 'home' 
  | 'toys' 
  | 'beauty' 
  | 'sports';

export type DealType = 
  | 'flash' 
  | 'clearance' 
  | 'limited';
