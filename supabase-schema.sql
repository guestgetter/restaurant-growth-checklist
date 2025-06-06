-- Growth OS Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    logo TEXT,
    branding JSONB NOT NULL DEFAULT '{"primaryColor": "#3B82F6", "secondaryColor": "#1E40AF", "fontFamily": "Inter"}',
    contact JSONB NOT NULL DEFAULT '{"email": "", "phone": "", "address": ""}',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Checklist progress table
CREATE TABLE public.checklist_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    completed_items TEXT[] DEFAULT '{}',
    completed_subtasks TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id)
);

-- Indexes for better performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_checklist_progress_client_id ON public.checklist_progress(client_id);

-- Row Level Security (RLS) policies
-- Note: These assume you'll add authentication later
-- For now, we'll make it public but you should add auth

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;

-- Public access policies (remove these when you add authentication)
CREATE POLICY "Allow public access to clients" ON public.clients
    FOR ALL USING (true);

CREATE POLICY "Allow public access to checklist_progress" ON public.checklist_progress
    FOR ALL USING (true);

-- Functions to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER handle_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_checklist_progress_updated_at
    BEFORE UPDATE ON public.checklist_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Sample data (optional)
INSERT INTO public.clients (id, name, industry, branding, contact, status, created_at) VALUES
(
    '1',
    'Pizza Palace',
    'Quick Service Restaurant',
    '{"primaryColor": "#e53e3e", "secondaryColor": "#ff6b6b", "fontFamily": "Inter"}',
    '{"email": "owner@pizzapalace.com", "phone": "(555) 123-4567", "address": "123 Main St, Anytown, USA"}',
    'active',
    NOW()
);

-- Grant permissions (adjust as needed)
GRANT ALL ON public.clients TO anon, authenticated;
GRANT ALL ON public.checklist_progress TO anon, authenticated; 