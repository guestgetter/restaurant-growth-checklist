import { 
  RecurringTaskTemplate, 
  ClientRecurringTaskConfig, 
  RecurringTaskInstance,
  recurringTaskTemplates 
} from '../app/data/checklist-data';
import { Client } from '../components/Settings/ClientManagement';

// Calculate next due date based on frequency
export function calculateNextDueDate(
  frequency: string, 
  lastCompleted?: string, 
  preferredDay?: string
): string {
  const now = new Date();
  const lastDate = lastCompleted ? new Date(lastCompleted) : now;
  
  let nextDue = new Date(lastDate);
  
  switch (frequency) {
    case 'daily':
      nextDue.setDate(lastDate.getDate() + 1);
      break;
    case 'weekly':
      nextDue.setDate(lastDate.getDate() + 7);
      break;
    case 'bi-weekly':
      nextDue.setDate(lastDate.getDate() + 14);
      break;
    case 'monthly':
      nextDue.setMonth(lastDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDue.setMonth(lastDate.getMonth() + 3);
      break;
    default:
      // For custom frequencies, assume weekly
      nextDue.setDate(lastDate.getDate() + 7);
  }
  
  // Adjust to preferred day if specified
  if (preferredDay && frequency !== 'daily') {
    const dayMap = {
      'monday': 1, 'tuesday': 2, 'wednesday': 3, 
      'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0
    };
    
    const targetDay = dayMap[preferredDay as keyof typeof dayMap];
    const currentDay = nextDue.getDay();
    const daysToAdd = (targetDay - currentDay + 7) % 7;
    
    if (daysToAdd > 0) {
      nextDue.setDate(nextDue.getDate() + daysToAdd);
    }
  }
  
  return nextDue.toISOString();
}

// Check if a date is a blackout date
export function isBlackoutDate(date: string, blackoutDates: string[]): boolean {
  const checkDate = new Date(date).toISOString().split('T')[0];
  return blackoutDates.some(blackout => 
    new Date(blackout).toISOString().split('T')[0] === checkDate
  );
}

// Get relevant recurring tasks for a client based on their industry and settings
export function getRelevantTasksForClient(client: Client): RecurringTaskTemplate[] {
  return recurringTaskTemplates.filter(template => {
    // Check client type relevance
    if (!template.clientTypeRelevance.includes(client.industry)) {
      return false;
    }
    
    // Check conditions
    if (template.conditions) {
      // For now, we'll assume basic conditions are met
      // In a real implementation, you'd check actual client data
      if (template.conditions.minimumRevenue && 
          client.recurringTaskSettings?.customFrequencies) {
        // Simplified check - in reality you'd check actual revenue data
        return true;
      }
    }
    
    return true;
  });
}

// Get client-specific configuration for a task
export function getClientTaskConfig(
  client: Client, 
  templateId: string
): ClientRecurringTaskConfig | null {
  if (!client.recurringTaskSettings) return null;
  
  const template = recurringTaskTemplates.find(t => t.id === templateId);
  if (!template) return null;
  
  const isEnabled = client.recurringTaskSettings.enabledTasks.includes(templateId);
  const customFrequency = client.recurringTaskSettings.customFrequencies[templateId];
  
  return {
    clientId: client.id,
    taskId: templateId,
    isEnabled,
    customFrequency: customFrequency || template.defaultFrequency,
  };
}

// Generate recurring task instances for a client
export function generateTaskInstancesForClient(client: Client): RecurringTaskInstance[] {
  const relevantTasks = getRelevantTasksForClient(client);
  const instances: RecurringTaskInstance[] = [];
  
  relevantTasks.forEach(template => {
    const config = getClientTaskConfig(client, template.id);
    if (!config || !config.isEnabled) return;
    
    const frequency = config.customFrequency || template.defaultFrequency;
    const nextDue = calculateNextDueDate(frequency);
    const now = new Date();
    const dueDate = new Date(nextDue);
    
    // Skip if blackout date
    if (client.recurringTaskSettings?.blackoutDates &&
        isBlackoutDate(nextDue, client.recurringTaskSettings.blackoutDates)) {
      return;
    }
    
    const instance: RecurringTaskInstance = {
      id: `${client.id}-${template.id}-${Date.now()}`,
      templateId: template.id,
      clientId: client.id,
      dueDate: nextDue,
      completed: false,
      isOverdue: dueDate < now,
      daysSinceDue: Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    };
    
    instances.push(instance);
  });
  
  return instances;
}

// Get default recurring task settings for a new client
export function getDefaultRecurringTaskSettings(client: Client) {
  const relevantTasks = getRelevantTasksForClient(client);
  const enabledTasks = relevantTasks
    .filter(task => !task.isOptional)
    .map(task => task.id);
  
  // Adjust frequencies based on client type
  const customFrequencies: Record<string, string> = {};
  
  if (client.industry === 'Quick Service Restaurant') {
    customFrequencies['newsletter-campaign'] = 'weekly';
    customFrequencies['social-content'] = 'daily';
  } else if (client.industry === 'Fine Dining') {
    customFrequencies['newsletter-campaign'] = 'monthly';
    customFrequencies['social-content'] = 'weekly';
  }
  
  return {
    enabledTasks,
    customFrequencies,
    blackoutDates: [],
    preferredSchedule: 'morning' as const,
    notifications: {
      dueSoon: true,
      overdue: true,
      emailReminders: false,
    }
  };
}

// Format frequency for display
export function formatFrequency(frequency: string): string {
  const frequencyMap: Record<string, string> = {
    'daily': 'Daily',
    'weekly': 'Weekly', 
    'bi-weekly': 'Bi-weekly',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly'
  };
  
  return frequencyMap[frequency] || frequency;
}

// Calculate task urgency for sorting
export function getTaskUrgency(instance: RecurringTaskInstance): number {
  if (instance.completed) return 0;
  if (instance.isOverdue) return 3;
  
  const dueDate = new Date(instance.dueDate);
  const now = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue <= 1) return 2; // Due soon
  if (daysUntilDue <= 3) return 1; // Due this week
  return 0; // Not urgent
}

// Get status color for task instance
export function getTaskStatusColor(instance: RecurringTaskInstance): string {
  if (instance.completed) return 'green';
  if (instance.isOverdue) return 'red';
  
  const dueDate = new Date(instance.dueDate);
  const now = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue <= 1) return 'orange'; // Due soon
  if (daysUntilDue <= 3) return 'yellow'; // Due this week
  return 'blue'; // Upcoming
} 