import { Pool } from 'pg'

// Use a module-level pool so connections are reused across requests
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Tagged template literal helper that matches the neon() API surface
// so existing callers (sql`...`) work unchanged
export async function sql(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<any[]> {
  let text = ''
  strings.forEach((s, i) => {
    text += s
    if (i < values.length) text += `$${i + 1}`
  })
  const client = await pool.connect()
  try {
    const res = await client.query(text, values)
    return res.rows
  } finally {
    client.release()
  }
}

export { pool }

// Types
export type Profile = {
  id: string; clerk_id: string; email: string
  first_name: string | null; last_name: string | null
  role: 'member' | 'admin'; organization: string | null
  job_title: string | null; created_at: string
}
export type Course = {
  id: string; course_code: string; slug: string
  title: string; description: string; level: string
  duration_hours: number; is_published: boolean; order_index: number
}
export type Module = {
  id: string; course_id: string; title: string; content: string
  duration_minutes: number; order_index: number; is_preview: boolean
}
export type Enrollment = {
  id: string; clerk_id: string; course_id: string
  progress_percent: number; completed_at: string | null; created_at: string
}
