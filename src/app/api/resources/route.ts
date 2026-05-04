export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const course   = searchParams.get('course')
  const category = searchParams.get('category')
  const search   = searchParams.get('q')

  const client = await pool.connect()
  try {
    let query = `SELECT id, title, description, url, type, category, course_slug, source_name, access_level, created_at FROM mcsa_resources WHERE 1=1`
    const params: any[] = []
    let i = 1
    if (course)   { query += ` AND course_slug = $${i++}`; params.push(course) }
    if (category) { query += ` AND category = $${i++}`;    params.push(category) }
    if (search)   {
      query += ` AND (title ILIKE $${i} OR description ILIKE $${i} OR source_name ILIKE $${i})`
      params.push(`%${search}%`); i++
    }
    query += ` ORDER BY access_level, course_slug, title`

    const { rows } = await client.query(query, params)
    // All resources fully open during testing — no locking
    return NextResponse.json({ resources: rows.map(r => ({ ...r, locked: false })) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  } finally {
    client.release()
  }
}
