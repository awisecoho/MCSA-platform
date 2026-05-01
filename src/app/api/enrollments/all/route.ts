export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { pool } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ enrollments: [] })
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT e.id, e.progress_percent, e.created_at,
              c.title, c.course_code, c.slug, c.level, c.duration_hours
       FROM mcsa_enrollments e
       JOIN mcsa_courses c ON c.id = e.course_id
       WHERE e.clerk_id = $1
       ORDER BY e.created_at DESC`,
      [userId]
    )
    return NextResponse.json({ enrollments: rows })
  } catch {
    return NextResponse.json({ enrollments: [] })
  } finally {
    client.release()
  }
}
