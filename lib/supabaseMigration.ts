import { dbOperations } from './supabase';
import { Client } from '../components/Settings/ClientManagement';

export class DataMigrationService {
  private static isSupabaseConfigured(): boolean {
    return !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  // Migrate localStorage data to Supabase
  static async migrateToSupabase(): Promise<void> {
    if (!this.isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping migration');
      return;
    }

    try {
      // Get data from localStorage
      const localClients = localStorage.getItem('growth-os-clients');
      const currentClientId = localStorage.getItem('growth-os-current-client');

      if (localClients) {
        const clients: Client[] = JSON.parse(localClients);
        
        console.log('Migrating clients to Supabase:', clients);

        // Migrate each client
        for (const client of clients) {
          // Convert Client to Supabase format
          const supabaseClient = {
            id: client.id,
            name: client.name,
            industry: client.industry,
            logo: client.logo || null,
            branding: client.branding,
            contact: client.contact,
            status: client.status as 'active' | 'inactive',
            created_at: client.createdAt
          };

          try {
            await dbOperations.createClient(supabaseClient);
            console.log(`Migrated client: ${client.name}`);

            // Migrate progress for this client
            await this.migrateClientProgress(client.id);
          } catch (error: any) {
            if (error.code === '23505') { // Unique constraint violation
              console.log(`Client ${client.name} already exists in Supabase`);
            } else {
              console.error(`Failed to migrate client ${client.name}:`, error);
            }
          }
        }

        console.log('Migration completed successfully');
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  // Migrate progress for a specific client
  private static async migrateClientProgress(clientId: string): Promise<void> {
    try {
      const progressKey = `restaurant-checklist-progress-${clientId}`;
      const subtasksKey = `restaurant-checklist-subtasks-${clientId}`;
      
      const localProgress = localStorage.getItem(progressKey);
      const localSubtasks = localStorage.getItem(subtasksKey);

      const completedItems = localProgress ? JSON.parse(localProgress) : [];
      const completedSubtasks = localSubtasks ? JSON.parse(localSubtasks) : [];

      if (completedItems.length > 0 || completedSubtasks.length > 0) {
        await dbOperations.saveClientProgress(clientId, completedItems, completedSubtasks);
        console.log(`Migrated progress for client: ${clientId}`);
      }
    } catch (error) {
      console.error(`Failed to migrate progress for client ${clientId}:`, error);
    }
  }

  // Load clients with fallback to localStorage
  static async loadClients(): Promise<Client[]> {
    if (!this.isSupabaseConfigured()) {
      console.log('Using localStorage fallback for clients');
      return this.loadClientsFromLocalStorage();
    }

    try {
      const supabaseClients = await dbOperations.getClients();
      
      // Convert Supabase format to Client format
      const clients: Client[] = supabaseClients.map(sc => ({
        id: sc.id,
        name: sc.name,
        industry: sc.industry,
        logo: sc.logo || '',
        branding: sc.branding,
        contact: sc.contact,
        status: sc.status,
        createdAt: sc.created_at
      }));

      if (clients.length === 0) {
        // No clients in Supabase, try to migrate from localStorage
        await this.migrateToSupabase();
        return this.loadClientsFromLocalStorage();
      }

      return clients;
    } catch (error) {
      console.error('Failed to load from Supabase, falling back to localStorage:', error);
      return this.loadClientsFromLocalStorage();
    }
  }

  // Load client progress with fallback
  static async loadClientProgress(clientId: string): Promise<{
    completedItems: string[];
    completedSubtasks: string[];
  }> {
    if (!this.isSupabaseConfigured()) {
      return this.loadProgressFromLocalStorage(clientId);
    }

    try {
      const progress = await dbOperations.getClientProgress(clientId);
      
      if (progress) {
        return {
          completedItems: progress.completed_items || [],
          completedSubtasks: progress.completed_subtasks || []
        };
      } else {
        // No progress in Supabase, check localStorage
        return this.loadProgressFromLocalStorage(clientId);
      }
    } catch (error) {
      console.error('Failed to load progress from Supabase, falling back to localStorage:', error);
      return this.loadProgressFromLocalStorage(clientId);
    }
  }

  // Save client progress with fallback
  static async saveClientProgress(
    clientId: string, 
    completedItems: string[], 
    completedSubtasks: string[]
  ): Promise<void> {
    // Always save to localStorage for immediate response
    this.saveProgressToLocalStorage(clientId, completedItems, completedSubtasks);

    if (!this.isSupabaseConfigured()) {
      return;
    }

    try {
      await dbOperations.saveClientProgress(clientId, completedItems, completedSubtasks);
    } catch (error) {
      console.error('Failed to save progress to Supabase:', error);
      // LocalStorage save already completed, so user doesn't lose progress
    }
  }

  // LocalStorage helper methods
  private static loadClientsFromLocalStorage(): Client[] {
    const savedClients = localStorage.getItem('growth-os-clients');
    if (savedClients) {
      try {
        return JSON.parse(savedClients);
      } catch (error) {
        console.error('Error parsing clients from localStorage:', error);
      }
    }
    return [];
  }

  private static loadProgressFromLocalStorage(clientId: string): {
    completedItems: string[];
    completedSubtasks: string[];
  } {
    const progressKey = `restaurant-checklist-progress-${clientId}`;
    const subtasksKey = `restaurant-checklist-subtasks-${clientId}`;
    
    const localProgress = localStorage.getItem(progressKey);
    const localSubtasks = localStorage.getItem(subtasksKey);

    return {
      completedItems: localProgress ? JSON.parse(localProgress) : [],
      completedSubtasks: localSubtasks ? JSON.parse(localSubtasks) : []
    };
  }

  private static saveProgressToLocalStorage(
    clientId: string, 
    completedItems: string[], 
    completedSubtasks: string[]
  ): void {
    const progressKey = `restaurant-checklist-progress-${clientId}`;
    const subtasksKey = `restaurant-checklist-subtasks-${clientId}`;
    
    localStorage.setItem(progressKey, JSON.stringify(completedItems));
    localStorage.setItem(subtasksKey, JSON.stringify(completedSubtasks));
  }
} 