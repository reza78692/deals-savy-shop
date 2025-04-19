import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem } from "@/types/product";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load cart from Supabase if user is logged in, otherwise from localStorage
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      
      if (user) {
        // Load cart from Supabase if user is logged in
        try {
          const { data, error } = await supabase
            .from('carts')
            .select('cart_items')
            .eq('user_id', user.id)
            .single();
          
          if (error) {
            console.error("Error loading cart from Supabase:", error);
            // Fallback to localStorage
            loadFromLocalStorage();
          } else if (data) {
            setCartItems(data.cart_items || []);
          } else {
            // No cart found for this user, check if there's something in localStorage
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error("Failed to fetch cart from Supabase:", error);
          loadFromLocalStorage();
        }
      } else {
        // Load from localStorage if no user is logged in
        loadFromLocalStorage();
      }
      
      setIsLoading(false);
    };
    
    const loadFromLocalStorage = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error);
          localStorage.removeItem("cart");
          setCartItems([]);
        }
      }
    };
    
    loadCart();
  }, [user]);

  // Save cart to Supabase if user is logged in, otherwise to localStorage
  useEffect(() => {
    if (isLoading) return; // Don't save during initial loading
    
    const saveCart = async () => {
      if (user) {
        // Save to Supabase
        try {
          const { error } = await supabase
            .from('carts')
            .upsert({ 
              user_id: user.id, 
              cart_items: cartItems,
              updated_at: new Date().toISOString()
            }, { 
              onConflict: 'user_id'
            });
          
          if (error) {
            console.error("Error saving cart to Supabase:", error);
            // Fallback to localStorage
            localStorage.setItem("cart", JSON.stringify(cartItems));
          }
        } catch (error) {
          console.error("Failed to save cart to Supabase:", error);
          localStorage.setItem("cart", JSON.stringify(cartItems));
        }
      } else {
        // Save to localStorage if no user is logged in
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    };
    
    saveCart();
  }, [cartItems, user, isLoading]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        
        // Check if we're exceeding the available stock
        if (newQuantity > product.stock) {
          toast.error(`Sorry, only ${product.stock} items available`);
          return prevItems.map(item => 
            item.id === product.id 
              ? { ...item, quantity: product.stock } 
              : item
          );
        }
        
        toast.success(`Updated ${product.name} quantity in cart`);
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      }
      
      toast.success(`Added ${product.name} to cart`);
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const product = prevItems.find(item => item.id === productId);
      if (product) {
        toast.success(`Removed ${product.name} from cart`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const product = prevItems.find(item => item.id === productId);
      
      if (!product) return prevItems;
      
      // Check if we're exceeding the available stock
      if (quantity > product.stock) {
        toast.error(`Sorry, only ${product.stock} items available`);
        return prevItems.map(item => 
          item.id === productId 
            ? { ...item, quantity: product.stock } 
            : item
        );
      }
      
      return prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price.current * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getTotalItems,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
