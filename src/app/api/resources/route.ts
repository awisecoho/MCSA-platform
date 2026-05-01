export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  const { userId } = await auth()
  const { searchParams } = new URL(req.url)
  const course   = searchParams.get('course')
  const category = searchParams.get('category')
  const search   = searchParams.get('q')

  // Testers get viewing access but no download links for member resources
  let isTester = false
  if (userId) {
    try {
      const clerk = await clerkClient()
      const u = await clerk.users.getUser(userId)
      const meta = u.publicMetadata as Record<string, string>
      isTester = meta?.role === 'tester'
    } catch {}
  }

  const client = await pool.connect()
  try {
    let query = `SELECT id, title, description, url, type, category, course_slug, source_name, access_level, created_at FROM mcsa_resources WHERE 1=1`
    const params: any[] = []
    let i = 1

    if (course)   { query += ` AND course_slug = $${i++}`;  params.push(course) }
    if (category) { query += ` AND category = $${i++}`;     params.push(category) }
    if (search)   {
      query += ` AND (title ILIKE $${i} OR description ILIKE $${i} OR source_name ILIKE $${i})`
      params.push(`%${search}%`); i++
    }
    query += ` ORDER BY access_level, course_slug, title`

    const { rows } = await client.query(query, params)
    const resources = rows.map(r => ({
      ...r,
      // Non-members AND testers cannot get member resource download links
      url: ((!userId || isTester) && r.access_level === 'member') ? null : r.url,
      locked: (!userId || isTester) && r.access_level === 'member',
      tester_blocked: isTester && r.access_level === 'member',
    }))

    client.release()
    return NextResponse.json({ resources })
  } catch (err: any) {
    client.release()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
