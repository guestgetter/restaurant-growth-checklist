// Migration utility to convert global checklist progress to client-specific progress
export function migrateGlobalProgressToClient() {
  // Check if there's existing global progress
  const globalProgress = localStorage.getItem('restaurant-checklist-progress');
  
  if (globalProgress) {
    // Get current client
    const currentClientId = localStorage.getItem('growth-os-current-client');
    
    if (currentClientId) {
      // Migrate the progress to client-specific key
      const clientProgressKey = `restaurant-checklist-progress-${currentClientId}`;
      
      // Only migrate if client-specific progress doesn't already exist
      if (!localStorage.getItem(clientProgressKey)) {
        localStorage.setItem(clientProgressKey, globalProgress);
        console.log(`Migrated global progress to client: ${currentClientId}`);
      }
    }
    
    // Remove the old global progress key
    localStorage.removeItem('restaurant-checklist-progress');
    console.log('Removed global progress key');
  }
}

// Function to get progress for a specific client
export function getClientProgress(clientId: string): string[] {
  const clientProgressKey = `restaurant-checklist-progress-${clientId}`;
  const saved = localStorage.getItem(clientProgressKey);
  return saved ? JSON.parse(saved) : [];
}

// Function to set progress for a specific client
export function setClientProgress(clientId: string, completedItems: string[]): void {
  const clientProgressKey = `restaurant-checklist-progress-${clientId}`;
  localStorage.setItem(clientProgressKey, JSON.stringify(completedItems));
}

// Function to get all client progress (useful for admin/overview)
export function getAllClientProgress(): Record<string, string[]> {
  const allProgress: Record<string, string[]> = {};
  
  // Get all clients
  const savedClients = localStorage.getItem('growth-os-clients');
  if (savedClients) {
    const clients = JSON.parse(savedClients);
    
    clients.forEach((client: any) => {
      allProgress[client.id] = getClientProgress(client.id);
    });
  }
  
  return allProgress;
} 