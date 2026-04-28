export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { sql } from '@/lib/db'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')
  if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })

  try {
    const enrollments = await sql`
      SELECT * FROM mcsa_enrollments
      WHERE clerk_id = ${userId} AND course_id = ${courseId}
      LIMIT 1
    `
    if (!enrollments.length) {
      return NextResponse.json({ enrollment: null, completed: [] })
    }
    const progress = await sql`
      SELECT module_id FROM mcsa_module_progress
      WHERE enrollment_id = ${enrollments[0].id} AND completed = true
    `
    return NextResponse.json({
      enrollment: enrollments[0],
      completed: progress.map((p: any) => p.module_id)
    })
  } catch {
    return NextResponse.json({ enrollment: null, completed: [] })
  }
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId } = await req.json()

  // Ensure profile exists
  await sql`
    INSERT INTO mcsa_profiles (clerk_id, email, role)
    VALUES (${userId}, '', 'member')
    ON CONFLICT (clerk_id) DO NOTHING
  `

  const existing = await sql`
    SELECT * FROM mcsa_enrollments
    WHERE clerk_id = ${userId} AND course_id = ${courseId}
    LIMIT 1
  `
  if (existing.length) {
    return NextResponse.json({ enrollment: existing[0] })
  }

  const result = await sql`
    INSERT INTO mcsa_enrollments (clerk_id, course_id, progress_percent)
    VALUES (${userId}, ${courseId}, 0)
    RETURNING *
  `
  return NextResponse.json({ enrollment: result[0] })
}
