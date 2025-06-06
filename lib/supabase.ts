import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          industry: string;
          logo: string | null;
          branding: {
            primaryColor: string;
            secondaryColor: string;
            fontFamily: string;
          };
          contact: {
            email: string;
            phone: string;
            address: string;
          };
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
          user_id: string | null; // For multi-user support
        };
        Insert: {
          id?: string;
          name: string;
          industry: string;
          logo?: string | null;
          branding: {
            primaryColor: string;
            secondaryColor: string;
            fontFamily: string;
          };
          contact: {
            email: string;
            phone: string;
            address: string;
          };
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          industry?: string;
          logo?: string | null;
          branding?: {
            primaryColor: string;
            secondaryColor: string;
            fontFamily: string;
          };
          contact?: {
            email: string;
            phone: string;
            address: string;
          };
          status?: 'active' | 'inactive';
          updated_at?: string;
        };
      };
      checklist_progress: {
        Row: {
          id: string;
          client_id: string;
          completed_items: string[];
          completed_subtasks: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          completed_items?: string[];
          completed_subtasks?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          completed_items?: string[];
          completed_subtasks?: string[];
          updated_at?: string;
        };
      };
    };
  };
}

// Utility functions for database operations
export const dbOperations = {
  // Client operations
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createClient(client: Database['public']['Tables']['clients']['Insert']) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateClient(id: string, updates: Database['public']['Tables']['clients']['Update']) {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteClient(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Progress operations
  async getClientProgress(clientId: string) {
    const { data, error } = await supabase
      .from('checklist_progress')
      .select('*')
      .eq('client_id', clientId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  async saveClientProgress(clientId: string, completedItems: string[], completedSubtasks: string[]) {
    const { data, error } = await supabase
      .from('checklist_progress')
      .upsert({
        client_id: clientId,
        completed_items: completedItems,
        completed_subtasks: completedSubtasks,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}; 