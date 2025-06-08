import { useState, useEffect } from 'react'

interface Client {
  id: string
  name: string
  logo?: string
  googleAdsCustomerId?: string
  metaAdsAccountId?: string
  checklistItems?: ChecklistItem[]
}

interface ChecklistItem {
  id: string
  originalId: string
  text: string
  completed: boolean
  description?: string
  section: {
    id: string
    title: string
    emoji: string
    description: string
  }
  subTasks: ChecklistSubTask[]
}

interface ChecklistSubTask {
  id: string
  originalId: string
  text: string
  completed: boolean
}

export function useDatabase() {
  const [clients, setClients] = useState<Client[]>([])
  const [currentClientId, setCurrentClientId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all clients
  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/clients')
      const data = await response.json()
      
      if (data.success) {
        setClients(data.clients)
        // If no current client but clients exist, set the first one
        if (!currentClientId && data.clients.length > 0) {
          setCurrentClientId(data.clients[0].id)
        }
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch clients')
      console.error('Error fetching clients:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create a new client
  const createClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      })
      
      const data = await response.json()
      if (data.success) {
        await fetchClients() // Refresh the list
        return data.client
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError('Failed to create client')
      throw err
    }
  }

  // Get checklist for current client
  const fetchChecklist = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/checklist`)
      const data = await response.json()
      
      if (data.success) {
        return data.checklistItems
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError('Failed to fetch checklist')
      throw err
    }
  }

  // Update checklist item completion
  const updateChecklistItem = async (
    clientId: string, 
    itemId?: string, 
    subtaskId?: string, 
    completed?: boolean
  ) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/checklist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, subtaskId, completed })
      })
      
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error)
      }
    } catch (err) {
      setError('Failed to update checklist')
      throw err
    }
  }

  // Initialize data on mount
  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    currentClientId,
    setCurrentClientId,
    loading,
    error,
    setError,
    fetchClients,
    createClient,
    fetchChecklist,
    updateChecklistItem
  }
} 