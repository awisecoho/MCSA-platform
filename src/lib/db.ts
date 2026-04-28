import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

// Types
export type Profile = {
  id: string
  clerk_id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: 'member' | 'admin'
  organization: string | null
  job_title: string | null
  created_at: string
}

export type Course = {
  id: string
  course_code: string
  slug: string
  title: string
  description: string
  level: string
  duration_hours: number
  is_published: boolean
  order_index: number
}

export type Module = {
  id: string
  course_id: string
  title: string
  content: string
  duration_minutes: number
  order_index: number
  is_preview: boolean
}

export type Enrollment = {
  id: string
  user_id: string
  course_id: string
  progress_percent: number
  completed_at: string | null
  created_at: string
}
