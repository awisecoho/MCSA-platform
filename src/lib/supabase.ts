import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: 'member' | 'accredited' | 'admin'
  organization: string | null
  job_title: string | null
  created_at: string
}

export type Course = {
  id: string
  title: string
  slug: string
  description: string
  long_description: string
  price_cents: number
  is_certification: boolean
  certification_name: string | null
  duration_minutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  is_published: boolean
  is_member_free: boolean
  order_index: number
  category_id: string
  mcsa_course_categories?: { name: string; slug: string; icon: string }
}

export type Module = {
  id: string
  course_id: string
  title: string
  content: string
  order_index: number
  is_preview: boolean
  duration_minutes: number
}

export type Resource = {
  id: string
  title: string
  description: string
  category: string
  file_url: string | null
  file_type: string | null
  is_member_only: boolean
  is_published: boolean
}

export type Certification = {
  id: string
  user_id: string
  course_id: string
  certification_name: string
  certificate_number: string
  awarded_at: string
  expires_at: string | null
  is_active: boolean
}

export type MembershipPlan = {
  id: string
  name: string
  slug: string
  description: string
  price_monthly_cents: number
  price_annual_cents: number
  features: string[]
}
