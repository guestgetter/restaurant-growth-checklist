// Database Service Layer - Handles localStorage migration to Postgres
import { prisma } from '../prisma';
import { safeLocalStorage } from '../defensive';
import type { Client } from '../../types/restaurant-growth';

export interface DatabaseClient extends Client {
  // Add database-specific fields that may not be in the base Client interface
  industry?: string;
  logo?: string;
  metaAdsAccountId?: string;
  branding?: any;
  contact?: any;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientProgress {
  clientId: string;
  completedItems: string[];
  completedSubtasks: string[];
  progressPercentage?: number;
  lastItemCompleted?: string;
  lastCompletedAt?: Date;
}

export class DatabaseService {
  
  // ===================
  // CLIENT MANAGEMENT
  // ===================
  
  /**
   * Get all clients - reads from database with localStorage fallback
   */
  static async getAllClients(userId?: string): Promise<DatabaseClient[]> {
    try {
      // Try database first
      const dbClients = await prisma.client.findMany({
        where: userId ? { userId } : {},
        include: {
          checklistProgress: true,
          growthMetrics: true,
        },
        orderBy: { createdAt: 'asc' }
      });

      if (dbClients.length > 0) {
        return dbClients.map(this.mapDbClientToClient);
      }
    } catch (error) {
      console.error('Database read error, falling back to localStorage:', error);
    }

    // Fallback to localStorage
    return this.getClientsFromLocalStorage();
  }

  /**
   * Get a specific client by ID
   */
  static async getClient(clientId: string): Promise<DatabaseClient | null> {
    try {
      const dbClient = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          checklistProgress: true,
          growthMetrics: true,
          engagementEvents: true,
          actionItems: true,
        }
      });

      if (dbClient) {
        return this.mapDbClientToClient(dbClient);
      }
    } catch (error) {
      console.error('Database read error, falling back to localStorage:', error);
    }

    // Fallback to localStorage
    const localClients = this.getClientsFromLocalStorage();
    return localClients.find(c => c.id === clientId) || null;
  }

  /**
   * Create a new client - dual write to database and localStorage
   */
  static async createClient(clientData: Omit<DatabaseClient, 'id'>): Promise<DatabaseClient> {
    const client: DatabaseClient = {
      id: this.generateId(),
      ...clientData,
    };

    // Write to localStorage immediately (for reliability)
    this.saveClientToLocalStorage(client);

    // Try to write to database
    try {
      const dbClient = await prisma.client.create({
        data: {
          id: client.id,
          name: client.name,
          type: client.type,
          industry: client.industry,
          logo: client.logo,
          location: client.location,
          accountManager: client.accountManager,
          fulfillmentManager: client.fulfillmentManager,
          onboardingDate: client.onboardingDate,
          currentPhase: client.currentPhase,
          googleAdsCustomerId: client.googleAdsCustomerId,
          metaAdsAccountId: client.metaAdsAccountId,
          dreamCaseStudyGoal: client.dreamCaseStudyGoal,
          targetAudience: client.targetAudience,
          topCompetitors: client.topCompetitors,
          monthlyRevenue: client.monthlyRevenue,
          averageOrderValue: client.averageOrderValue,
          branding: client.branding || {},
          contact: client.contact || {},
          userId: client.userId,
        }
      });
      
      console.log('Client saved to database:', dbClient.id);
      return this.mapDbClientToClient(dbClient);
    } catch (error) {
      console.error('Failed to save client to database:', error);
      return client; // Return localStorage version
    }
  }

  /**
   * Update an existing client - dual write
   */
  static async updateClient(clientId: string, updates: Partial<DatabaseClient>): Promise<DatabaseClient | null> {
    // Update localStorage first
    const localClients = this.getClientsFromLocalStorage();
    const clientIndex = localClients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      throw new Error(`Client ${clientId} not found`);
    }

    const updatedClient = { ...localClients[clientIndex], ...updates };
    localClients[clientIndex] = updatedClient;
    this.saveAllClientsToLocalStorage(localClients);

    // Try to update database
    try {
      const dbClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.type && { type: updates.type }),
          ...(updates.logo && { logo: updates.logo }),
          ...(updates.location && { location: updates.location }),
          ...(updates.accountManager && { accountManager: updates.accountManager }),
          ...(updates.fulfillmentManager && { fulfillmentManager: updates.fulfillmentManager }),
          ...(updates.currentPhase && { currentPhase: updates.currentPhase }),
          ...(updates.googleAdsCustomerId && { googleAdsCustomerId: updates.googleAdsCustomerId }),
          ...(updates.metaAdsAccountId && { metaAdsAccountId: updates.metaAdsAccountId }),
          ...(updates.dreamCaseStudyGoal && { dreamCaseStudyGoal: updates.dreamCaseStudyGoal }),
          ...(updates.targetAudience && { targetAudience: updates.targetAudience }),
          ...(updates.topCompetitors && { topCompetitors: updates.topCompetitors }),
          ...(updates.monthlyRevenue && { monthlyRevenue: updates.monthlyRevenue }),
          ...(updates.averageOrderValue && { averageOrderValue: updates.averageOrderValue }),
          ...(updates.branding && { branding: updates.branding }),
          ...(updates.contact && { contact: updates.contact }),
        }
      });

      return this.mapDbClientToClient(dbClient);
    } catch (error) {
      console.error('Failed to update client in database:', error);
      return updatedClient; // Return localStorage version
    }
  }

  // ===================
  // PROGRESS TRACKING
  // ===================

  /**
   * Get client progress - database with localStorage fallback
   */
  static async getClientProgress(clientId: string): Promise<ClientProgress> {
    try {
      const dbProgress = await prisma.clientProgress.findUnique({
        where: { clientId }
      });

      if (dbProgress) {
        return {
          clientId: dbProgress.clientId,
          completedItems: dbProgress.completedItems,
          completedSubtasks: dbProgress.completedSubtasks,
          progressPercentage: dbProgress.progressPercentage || undefined,
          lastItemCompleted: dbProgress.lastItemCompleted || undefined,
          lastCompletedAt: dbProgress.lastCompletedAt || undefined,
        };
      }
    } catch (error) {
      console.error('Database read error, falling back to localStorage:', error);
    }

    // Fallback to localStorage
    return this.getProgressFromLocalStorage(clientId);
  }

  /**
   * Save client progress - dual write
   */
  static async saveClientProgress(
    clientId: string, 
    completedItems: string[], 
    completedSubtasks: string[]
  ): Promise<void> {
    const progressData = {
      clientId,
      completedItems,
      completedSubtasks,
      progressPercentage: this.calculateProgressPercentage(completedItems),
      lastItemCompleted: completedItems[completedItems.length - 1],
      lastCompletedAt: new Date(),
    };

    // Save to localStorage immediately
    this.saveProgressToLocalStorage(clientId, completedItems, completedSubtasks);

    // Try to save to database
    try {
      await prisma.clientProgress.upsert({
        where: { clientId },
        update: {
          completedItems,
          completedSubtasks,
          progressPercentage: progressData.progressPercentage,
          lastItemCompleted: progressData.lastItemCompleted,
          lastCompletedAt: progressData.lastCompletedAt,
        },
        create: {
          clientId,
          completedItems,
          completedSubtasks,
          progressPercentage: progressData.progressPercentage,
          lastItemCompleted: progressData.lastItemCompleted,
          lastCompletedAt: progressData.lastCompletedAt,
        }
      });

      console.log('Progress saved to database for client:', clientId);
    } catch (error) {
      console.error('Failed to save progress to database:', error);
      // localStorage save already completed
    }
  }

  // ===================
  // MIGRATION UTILITIES
  // ===================

  /**
   * Migrate all localStorage data to database
   */
  static async migrateLocalStorageToDatabase(userId?: string): Promise<{
    clients: number;
    progressRecords: number;
    errors: string[];
  }> {
    const results = {
      clients: 0,
      progressRecords: 0,
      errors: [] as string[]
    };

    try {
      // Migrate clients
      const localClients = this.getClientsFromLocalStorage();
      
      for (const client of localClients) {
        try {
          await prisma.client.upsert({
            where: { id: client.id },
            update: {
              name: client.name,
              type: client.type,
              location: client.location,
              accountManager: client.accountManager,
              fulfillmentManager: client.fulfillmentManager,
              onboardingDate: client.onboardingDate,
              currentPhase: client.currentPhase,
              googleAdsCustomerId: client.googleAdsCustomerId,
              dreamCaseStudyGoal: client.dreamCaseStudyGoal,
              targetAudience: client.targetAudience,
              topCompetitors: client.topCompetitors,
              monthlyRevenue: client.monthlyRevenue,
              averageOrderValue: client.averageOrderValue,
              userId,
            },
            create: {
              id: client.id,
              name: client.name,
              type: client.type,
              location: client.location,
              accountManager: client.accountManager,
              fulfillmentManager: client.fulfillmentManager,
              onboardingDate: client.onboardingDate,
              currentPhase: client.currentPhase,
              googleAdsCustomerId: client.googleAdsCustomerId,
              dreamCaseStudyGoal: client.dreamCaseStudyGoal,
              targetAudience: client.targetAudience,
              topCompetitors: client.topCompetitors,
              monthlyRevenue: client.monthlyRevenue,
              averageOrderValue: client.averageOrderValue,
              userId,
            }
          });

          results.clients++;

          // Migrate progress for this client
          const progress = this.getProgressFromLocalStorage(client.id);
          if (progress.completedItems.length > 0 || progress.completedSubtasks.length > 0) {
            await prisma.clientProgress.upsert({
              where: { clientId: client.id },
              update: {
                completedItems: progress.completedItems,
                completedSubtasks: progress.completedSubtasks,
              },
              create: {
                clientId: client.id,
                completedItems: progress.completedItems,
                completedSubtasks: progress.completedSubtasks,
              }
            });

            results.progressRecords++;
          }
        } catch (error) {
          results.errors.push(`Failed to migrate client ${client.name}: ${error}`);
        }
      }

      console.log('Migration completed:', results);
      return results;
    } catch (error) {
      results.errors.push(`Migration failed: ${error}`);
      return results;
    }
  }

  // ===================
  // PRIVATE HELPERS
  // ===================

  private static mapDbClientToClient(dbClient: any): DatabaseClient {
    return {
      id: dbClient.id,
      name: dbClient.name,
      type: dbClient.type,
      industry: dbClient.industry,
      logo: dbClient.logo,
      location: dbClient.location,
      accountManager: dbClient.accountManager,
      fulfillmentManager: dbClient.fulfillmentManager,
      onboardingDate: dbClient.onboardingDate,
      currentPhase: dbClient.currentPhase,
      googleAdsCustomerId: dbClient.googleAdsCustomerId,
      metaAdsAccountId: dbClient.metaAdsAccountId,
      dreamCaseStudyGoal: dbClient.dreamCaseStudyGoal,
      targetAudience: dbClient.targetAudience,
      topCompetitors: dbClient.topCompetitors,
      monthlyRevenue: dbClient.monthlyRevenue,
      averageOrderValue: dbClient.averageOrderValue,
      branding: dbClient.branding,
      contact: dbClient.contact,
      userId: dbClient.userId,
      createdAt: dbClient.createdAt,
      updatedAt: dbClient.updatedAt,
    };
  }

  private static getClientsFromLocalStorage(): DatabaseClient[] {
    if (typeof window === 'undefined') return [];
    
    const savedClients = safeLocalStorage.getItem('growth-os-clients');
    if (savedClients) {
      try {
        return JSON.parse(savedClients);
      } catch (error) {
        console.error('Error parsing clients from localStorage:', error);
      }
    }
    return [];
  }

  private static saveClientToLocalStorage(client: DatabaseClient): void {
    const existingClients = this.getClientsFromLocalStorage();
    const updatedClients = [...existingClients, client];
    this.saveAllClientsToLocalStorage(updatedClients);
  }

  private static saveAllClientsToLocalStorage(clients: DatabaseClient[]): void {
    safeLocalStorage.setItem('growth-os-clients', JSON.stringify(clients));
  }

  private static getProgressFromLocalStorage(clientId: string): ClientProgress {
    const progressKey = `restaurant-checklist-progress-${clientId}`;
    const subtasksKey = `restaurant-checklist-subtasks-${clientId}`;
    
    const localProgress = safeLocalStorage.getItem(progressKey);
    const localSubtasks = safeLocalStorage.getItem(subtasksKey);

    return {
      clientId,
      completedItems: localProgress ? JSON.parse(localProgress) : [],
      completedSubtasks: localSubtasks ? JSON.parse(localSubtasks) : [],
    };
  }

  private static saveProgressToLocalStorage(
    clientId: string, 
    completedItems: string[], 
    completedSubtasks: string[]
  ): void {
    const progressKey = `restaurant-checklist-progress-${clientId}`;
    const subtasksKey = `restaurant-checklist-subtasks-${clientId}`;
    
    safeLocalStorage.setItem(progressKey, JSON.stringify(completedItems));
    safeLocalStorage.setItem(subtasksKey, JSON.stringify(completedSubtasks));
  }

  private static calculateProgressPercentage(completedItems: string[]): number {
    // This would need to be calculated based on total available items
    // For now, return a simple calculation
    return Math.min(completedItems.length * 2, 100);
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 