import { Session } from 'next-auth'
import { Client } from '../components/Settings/ClientManagement'

/**
 * Filter clients based on user's role and permissions
 */
export function filterClientsForUser(allClients: Client[], session: Session | null): Client[] {
  if (!session?.user) {
    return []
  }

  const { role, allowedClients } = session.user

  // Team members can see all clients
  if (role === 'team' && allowedClients === 'all') {
    return allClients
  }

  // Restaurant clients can only see their specific restaurant
  if (role === 'client' && allowedClients) {
    return allClients.filter(client => client.id === allowedClients);
  }

  // No access if not properly configured
  return []
}

/**
 * Check if user has access to a specific client
 */
export function canUserAccessClient(clientId: string, session: Session | null): boolean {
  if (!session?.user) {
    return false
  }

  const { role, allowedClients } = session.user

  // Team members can access all clients
  if (role === 'team' && allowedClients === 'all') {
    return true
  }

  // Restaurant clients can only access their specific restaurant
  if (role === 'client' && allowedClients === clientId) {
    return true
  }

  return false
}

/**
 * Get the default client for a user (first allowed client)
 */
export function getDefaultClientForUser(allClients: Client[], session: Session | null): Client | null {
  const allowedClients = filterClientsForUser(allClients, session)
  return allowedClients.length > 0 ? allowedClients[0] : null
} 