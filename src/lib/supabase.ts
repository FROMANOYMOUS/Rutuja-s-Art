import { createClient } from '@supabase/supabase-js';
import { User, CartItem } from '../types';

// Read credentials from environment variables if present
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Save or update Customer Profile in Supabase table `customer_profiles`
 */
export async function saveCustomerProfileToSupabase(user: User) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from('customer_profiles')
      .upsert({
        id: user.id,
        email: user.email.toLowerCase(),
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
        email_verified: user.verified ?? true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (error) {
      console.warn('Supabase customer profile save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase profile save exception:', err);
    return false;
  }
}

/**
 * Sync Customer Cart to Supabase table `customer_carts`
 */
export async function saveCustomerCartToSupabase(email: string, cartItems: CartItem[]) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from('customer_carts')
      .upsert({
        user_email: email.toLowerCase(),
        cart_data: JSON.stringify(cartItems),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_email' });

    if (error) {
      console.warn('Supabase customer cart save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase cart save exception:', err);
    return false;
  }
}

/**
 * Get Customer Cart from Supabase
 */
export async function fetchCustomerCartFromSupabase(email: string): Promise<CartItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('customer_carts')
      .select('cart_data')
      .eq('user_email', email.toLowerCase())
      .single();

    if (error || !data) return null;
    return JSON.parse(data.cart_data || '[]');
  } catch (err) {
    console.warn('Supabase cart fetch exception:', err);
    return null;
  }
}

