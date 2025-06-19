import { z } from 'zod'

// Define validation schemas for all API inputs

export const ClientCreateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  type: z.enum(['fast-casual', 'fine-dining', 'quick-service', 'cafe', 'catering', 'food-truck']).optional(),
  industry: z.string().optional(),
  logo: z.string().optional(),
  location: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }).optional(),
  accountManager: z.string().optional(),
  fulfillmentManager: z.string().optional(),
  onboardingDate: z.string().optional(),
  currentPhase: z.enum(['onboarding', 'magnet', 'convert', 'keep', 'optimization']).optional(),
  googleAdsCustomerId: z.string().optional(),
  metaAdsAccountId: z.string().optional(),
  dreamCaseStudyGoal: z.string().optional(),
  targetAudience: z.string().optional(),
  topCompetitors: z.array(z.string()).optional(),
  monthlyRevenue: z.number().min(0).optional(),
  averageOrderValue: z.number().min(0).optional(),
  branding: z.record(z.any()).optional(),
  contact: z.record(z.any()).optional(),
})

export const ClientUpdateSchema = ClientCreateSchema.partial()

export const ClientProgressSchema = z.object({
  completedItems: z.array(z.string()).max(1000, 'Too many completed items'),
  completedSubtasks: z.array(z.string()).max(1000, 'Too many completed subtasks'),
})

export const ClientProfileSchema = z.object({
  conversations: z.array(z.any()).optional(),
  baseline: z.record(z.any()).optional(),
  dreamCaseStudy: z.record(z.any()).optional(),
})

export const ParamsSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/, 'Invalid client ID format'),
})

// Validation helper functions
export function validateClientId(id: string): boolean {
  try {
    ParamsSchema.parse({ id })
    return true
  } catch {
    return false
  }
}

export function validateClientCreate(data: unknown) {
  return ClientCreateSchema.parse(data)
}

export function validateClientUpdate(data: unknown) {
  return ClientUpdateSchema.parse(data)
}

export function validateClientProgress(data: unknown) {
  return ClientProgressSchema.parse(data)
}

export function validateClientProfile(data: unknown) {
  return ClientProfileSchema.parse(data)
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const key = identifier
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  const limit = rateLimitMap.get(key)!
  
  if (now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (limit.count >= maxRequests) {
    return false
  }
  
  limit.count++
  return true
}

// Error response helper
export function createErrorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
} 