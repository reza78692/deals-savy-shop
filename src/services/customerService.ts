
import { supabase } from '@/lib/supabase';

// Customer type definition
export interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
  last_login?: string;
  order_count?: number;
}

// Function to get all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    // Fetch users from Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users from auth:', authError);
      return [];
    }
    
    if (!authUsers || authUsers.users.length === 0) {
      return [];
    }
    
    // Get user profiles with additional information
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) {
      console.error('Error fetching user profiles:', profilesError);
    }
    
    // Get order counts for each user using a raw SQL query via Supabase functions
    const { data: orderCounts, error: ordersError } = await supabase
      .rpc('get_user_order_counts');
      
    if (ordersError) {
      console.error('Error fetching order counts:', ordersError);
    }
    
    // If the RPC function isn't available, get order counts manually
    let userOrderCounts: Record<string, number> = {};
    
    if (!orderCounts || ordersError) {
      // Fetch all orders and count them manually for each user
      const { data: orders, error: fetchOrdersError } = await supabase
        .from('orders')
        .select('user_id')
        .or('status.eq.pending,status.eq.processing,status.eq.shipped,status.eq.delivered');
      
      if (fetchOrdersError) {
        console.error('Error fetching orders:', fetchOrdersError);
      } else if (orders) {
        // Count orders manually
        orders.forEach(order => {
          if (order.user_id) {
            userOrderCounts[order.user_id] = (userOrderCounts[order.user_id] || 0) + 1;
          }
        });
      }
    } else {
      // Convert RPC result to expected format
      orderCounts.forEach((item: any) => {
        userOrderCounts[item.user_id] = item.count;
      });
    }
    
    // Combine auth users with their profiles and order counts
    return authUsers.users.map(user => {
      const profile = profiles?.find(p => p.id === user.id);
      
      return {
        id: user.id,
        email: user.email || '',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        phone: profile?.phone || '',
        created_at: user.created_at,
        last_login: user.last_sign_in_at,
        order_count: userOrderCounts[user.id] || 0
      };
    });
  } catch (error) {
    console.error('Exception while fetching customers:', error);
    return [];
  }
};

// Function to get customer by ID
export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    // Fetch user from Supabase Auth
    const { data: user, error: authError } = await supabase.auth.admin.getUserById(id);
    
    if (authError || !user) {
      console.error('Error fetching user from auth:', authError);
      return null;
    }
    
    // Get user profile with additional information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }
    
    // Get order count for this user - fixed query
    const { data, error: orderError } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', id);
      
    if (orderError) {
      console.error('Error fetching order count:', orderError);
    }
    
    const count = data ? data.length : 0;
    
    return {
      id: user.user.id,
      email: user.user.email || '',
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      created_at: user.user.created_at,
      last_login: user.user.last_sign_in_at,
      order_count: count || 0
    };
  } catch (error) {
    console.error('Exception while fetching customer by ID:', error);
    return null;
  }
};
