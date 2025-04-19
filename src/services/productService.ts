
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { products as staticProducts } from '@/data/products';

// Function to sync static products to Supabase (used by admin)
export const syncProductsToSupabase = async () => {
  try {
    const { error } = await supabase
      .from('products')
      .upsert(staticProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price_original: product.price.original,
        price_current: product.price.current,
        discount: product.discount,
        images: product.images,
        category: product.category,
        tags: product.tags,
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured,
        deal_ends: product.dealEnds,
        deal_type: product.dealType
      })));

    if (error) {
      console.error('Error syncing products:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception while syncing products:', error);
    return { success: false, error };
  }
};

// Function to get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      // Fallback to static data if there's an error
      return staticProducts;
    }

    if (!data || data.length === 0) {
      console.log('No products found in database, using static data');
      return staticProducts;
    }

    // Transform database records to Product objects
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: {
        original: item.price_original,
        current: item.price_current
      },
      discount: item.discount,
      images: item.images,
      category: item.category,
      tags: item.tags,
      stock: item.stock,
      rating: item.rating,
      reviews: item.reviews,
      featured: item.featured,
      dealEnds: item.deal_ends,
      dealType: item.deal_type
    }));
  } catch (error) {
    console.error('Exception while fetching products:', error);
    return staticProducts;
  }
};

// Function to get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product by ID:', error);
      // Fallback to static data
      return staticProducts.find(product => product.id === id);
    }

    if (!data) {
      console.log('Product not found in database, checking static data');
      return staticProducts.find(product => product.id === id);
    }

    // Transform database record to Product object
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: {
        original: data.price_original,
        current: data.price_current
      },
      discount: data.discount,
      images: data.images,
      category: data.category,
      tags: data.tags,
      stock: data.stock,
      rating: data.rating,
      reviews: data.reviews,
      featured: data.featured,
      dealEnds: data.deal_ends,
      dealType: data.deal_type
    };
  } catch (error) {
    console.error('Exception while fetching product by ID:', error);
    return staticProducts.find(product => product.id === id);
  }
};

// Function to get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error('Error fetching products by category:', error);
      // Fallback to static data
      return staticProducts.filter(product => product.category === category);
    }

    if (!data || data.length === 0) {
      console.log('No products found in database for category, using static data');
      return staticProducts.filter(product => product.category === category);
    }

    // Transform database records to Product objects
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: {
        original: item.price_original,
        current: item.price_current
      },
      discount: item.discount,
      images: item.images,
      category: item.category,
      tags: item.tags,
      stock: item.stock,
      rating: item.rating,
      reviews: item.reviews,
      featured: item.featured,
      dealEnds: item.deal_ends,
      dealType: item.deal_type
    }));
  } catch (error) {
    console.error('Exception while fetching products by category:', error);
    return staticProducts.filter(product => product.category === category);
  }
};

// Function to get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true);

    if (error) {
      console.error('Error fetching featured products:', error);
      // Fallback to static data
      return staticProducts.filter(product => product.featured);
    }

    if (!data || data.length === 0) {
      console.log('No featured products found in database, using static data');
      return staticProducts.filter(product => product.featured);
    }

    // Transform database records to Product objects
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: {
        original: item.price_original,
        current: item.price_current
      },
      discount: item.discount,
      images: item.images,
      category: item.category,
      tags: item.tags,
      stock: item.stock,
      rating: item.rating,
      reviews: item.reviews,
      featured: item.featured,
      dealEnds: item.deal_ends,
      dealType: item.deal_type
    }));
  } catch (error) {
    console.error('Exception while fetching featured products:', error);
    return staticProducts.filter(product => product.featured);
  }
};

// Function to get products by deal type
export const getProductsByDealType = async (dealType: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('deal_type', dealType);

    if (error) {
      console.error('Error fetching products by deal type:', error);
      // Fallback to static data
      return staticProducts.filter(product => product.dealType === dealType);
    }

    if (!data || data.length === 0) {
      console.log('No products found in database for deal type, using static data');
      return staticProducts.filter(product => product.dealType === dealType);
    }

    // Transform database records to Product objects
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: {
        original: item.price_original,
        current: item.price_current
      },
      discount: item.discount,
      images: item.images,
      category: item.category,
      tags: item.tags,
      stock: item.stock,
      rating: item.rating,
      reviews: item.reviews,
      featured: item.featured,
      dealEnds: item.deal_ends,
      dealType: item.deal_type
    }));
  } catch (error) {
    console.error('Exception while fetching products by deal type:', error);
    return staticProducts.filter(product => product.dealType === dealType);
  }
};

// Function to search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error('Error searching products:', error);
      // Fallback to static data
      const lowercaseQuery = query.toLowerCase();
      return staticProducts.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    }

    if (!data || data.length === 0) {
      console.log('No search results found in database, using static data');
      const lowercaseQuery = query.toLowerCase();
      return staticProducts.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    }

    // Transform database records to Product objects
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: {
        original: item.price_original,
        current: item.price_current
      },
      discount: item.discount,
      images: item.images,
      category: item.category,
      tags: item.tags,
      stock: item.stock,
      rating: item.rating,
      reviews: item.reviews,
      featured: item.featured,
      dealEnds: item.deal_ends,
      dealType: item.deal_type
    }));
  } catch (error) {
    console.error('Exception while searching products:', error);
    const lowercaseQuery = query.toLowerCase();
    return staticProducts.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
};
