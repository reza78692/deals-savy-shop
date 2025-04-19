
import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types/product';

export interface OrderAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: string;
  shipping_address: OrderAddress;
  payment_intent_id?: string;
  tracking_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
}

// Create a new order
export const createOrder = async (
  userId: string,
  items: CartItem[],
  total: number,
  shippingAddress: OrderAddress,
  paymentIntentId?: string
): Promise<{ success: boolean; orderId?: string; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items,
        total,
        status: 'pending',
        shipping_address: shippingAddress,
        payment_intent_id: paymentIntentId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error };
    }

    return { success: true, orderId: data.id };
  } catch (error) {
    console.error('Exception creating order:', error);
    return { success: false, error };
  }
};

// Get orders for a specific user
export const getUserOrders = async (userId: string): Promise<OrdersResponse> => {
  try {
    const { data, error, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return { orders: [], count: 0 };
    }

    return { orders: data as Order[], count: count || 0 };
  } catch (error) {
    console.error('Exception fetching user orders:', error);
    return { orders: [], count: 0 };
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data as Order;
  } catch (error) {
    console.error('Exception fetching order:', error);
    return null;
  }
};

// Get all orders (admin only)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }

    return data as Order[];
  } catch (error) {
    console.error('Exception fetching all orders:', error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  status: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating order status:', error);
    return false;
  }
};

// Update tracking number
export const updateTrackingNumber = async (
  orderId: string, 
  trackingNumber: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating tracking number:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating tracking number:', error);
    return false;
  }
};

// Ensure the cancelOrder function is properly exported
export const cancelOrder = async (
  orderId: string,
  userId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // First, check if order belongs to user
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError || !order) {
      console.error('Error fetching order for cancellation:', fetchError);
      return { success: false, error: fetchError || new Error('Order not found') };
    }
    
    // Check if order can be cancelled (only pending or processing orders)
    if (order.status !== 'pending' && order.status !== 'processing') {
      return { 
        success: false, 
        error: new Error('Cannot cancel an order that has been shipped or delivered') 
      };
    }
    
    // Update order status to cancelled
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId);
    
    if (updateError) {
      console.error('Error cancelling order:', updateError);
      return { success: false, error: updateError };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception cancelling order:', error);
    return { success: false, error };
  }
};
