
import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "p1",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    price: {
      original: 349.99,
      current: 249.99,
    },
    discount: 29,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "electronics",
    tags: ["headphones", "audio", "wireless", "bluetooth"],
    stock: 45,
    rating: 4.7,
    reviews: 128,
    featured: true,
    dealEnds: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    dealType: "flash",
  },
  {
    id: "p2",
    name: "Smart Fitness Watch",
    description: "Track your health metrics, workouts, and sleep patterns with this advanced fitness tracker featuring heart rate monitor and GPS.",
    price: {
      original: 199.99,
      current: 149.99,
    },
    discount: 25,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "electronics",
    tags: ["fitness", "smartwatch", "health", "wearable"],
    stock: 78,
    rating: 4.5,
    reviews: 93,
    featured: true,
    dealEnds: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    dealType: "limited",
  },
  {
    id: "p3",
    name: "Robot Vacuum Cleaner",
    description: "Smart robot vacuum with mapping technology, powerful suction, and app control for effortless home cleaning.",
    price: {
      original: 499.99,
      current: 299.99,
    },
    discount: 40,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "home",
    tags: ["vacuum", "smart home", "cleaning", "robot"],
    stock: 34,
    rating: 4.6,
    reviews: 67,
    featured: true,
    dealEnds: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
    dealType: "flash",
  },
  {
    id: "p4",
    name: "UltraHD 4K Smart TV - 55\"",
    description: "Crystal-clear 4K resolution, smart streaming capabilities, and sleek design for the ultimate home entertainment experience.",
    price: {
      original: 899.99,
      current: 699.99,
    },
    discount: 22,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "electronics",
    tags: ["tv", "entertainment", "smart tv", "4k"],
    stock: 12,
    rating: 4.8,
    reviews: 52,
    featured: false,
    dealEnds: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    dealType: "limited",
  },
  {
    id: "p5",
    name: "Premium Chef Knife Set",
    description: "Professional-grade 8-piece knife set with high-carbon stainless steel blades and ergonomic handles.",
    price: {
      original: 149.99,
      current: 89.99,
    },
    discount: 40,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "home",
    tags: ["kitchen", "cooking", "knives", "chef"],
    stock: 29,
    rating: 4.9,
    reviews: 41,
    featured: false,
    dealType: "clearance",
  },
  {
    id: "p6",
    name: "Bluetooth Portable Speaker",
    description: "Waterproof portable speaker with 24-hour battery life, rich sound, and built-in microphone for calls.",
    price: {
      original: 129.99,
      current: 79.99,
    },
    discount: 38,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "electronics",
    tags: ["audio", "bluetooth", "speaker", "portable"],
    stock: 63,
    rating: 4.4,
    reviews: 87,
    featured: true,
    dealEnds: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    dealType: "flash",
  },
  {
    id: "p7",
    name: "Men's Running Shoes",
    description: "Lightweight, breathable running shoes with responsive cushioning and durable outsole for maximum performance.",
    price: {
      original: 119.99,
      current: 79.99,
    },
    discount: 33,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "fashion",
    tags: ["shoes", "running", "men", "sports"],
    stock: 41,
    rating: 4.6,
    reviews: 63,
    featured: false,
    dealType: "clearance",
  },
  {
    id: "p8",
    name: "Electric Coffee Grinder",
    description: "Precision coffee grinder with multiple grind settings for the perfect brew every time.",
    price: {
      original: 79.99,
      current: 49.99,
    },
    discount: 37,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "home",
    tags: ["coffee", "kitchen", "grinder", "appliance"],
    stock: 55,
    rating: 4.3,
    reviews: 39,
    featured: false,
    dealType: "clearance",
  },
  {
    id: "p9",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with premium sound quality, 30-hour total battery life, and comfortable in-ear fit.",
    price: {
      original: 149.99,
      current: 99.99,
    },
    discount: 33,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "electronics",
    tags: ["audio", "earbuds", "wireless", "bluetooth"],
    stock: 89,
    rating: 4.5,
    reviews: 112,
    featured: true,
    dealEnds: new Date(Date.now() + 86400000 * 1.5).toISOString(), // 1.5 days from now
    dealType: "flash",
  },
  {
    id: "p10",
    name: "Smart Home Security Camera",
    description: "HD security camera with night vision, motion detection, and two-way audio for complete home monitoring.",
    price: {
      original: 129.99,
      current: 89.99,
    },
    discount: 31,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "electronics",
    tags: ["security", "camera", "smart home", "surveillance"],
    stock: 37,
    rating: 4.7,
    reviews: 48,
    featured: false,
    dealEnds: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days from now
    dealType: "limited",
  },
  {
    id: "p11",
    name: "Professional Hair Dryer",
    description: "Salon-quality hair dryer with ionic technology, multiple heat and speed settings, and ergonomic design.",
    price: {
      original: 89.99,
      current: 59.99,
    },
    discount: 33,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "beauty",
    tags: ["beauty", "hair care", "styling", "hair dryer"],
    stock: 42,
    rating: 4.4,
    reviews: 56,
    featured: false,
    dealType: "clearance",
  },
  {
    id: "p12",
    name: "Adjustable Dumbbell Set",
    description: "Space-saving adjustable dumbbells that replace multiple weights, perfect for home workouts.",
    price: {
      original: 299.99,
      current: 199.99,
    },
    discount: 33,
    images: ["/placeholder.svg", "/placeholder.svg"],
    category: "sports",
    tags: ["fitness", "weights", "exercise", "gym"],
    stock: 23,
    rating: 4.8,
    reviews: 37,
    featured: true,
    dealEnds: new Date(Date.now() + 86400000 * 2.5).toISOString(), // 2.5 days from now
    dealType: "flash",
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByDealType = (dealType: string): Product[] => {
  return products.filter(product => product.dealType === dealType);
};

export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const currentProduct = getProductById(productId);
  if (!currentProduct) return [];
  
  return products
    .filter(product => 
      product.id !== productId && 
      (product.category === currentProduct.category || 
       product.tags.some(tag => currentProduct.tags.includes(tag)))
    )
    .slice(0, limit);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
