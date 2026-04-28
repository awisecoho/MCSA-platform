import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { sql } from '@/lib/db'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { enrollmentId, moduleId } = await req.json()

  await sql`
    INSERT INTO mcsa_module_progress (enrollment_id, module_id, completed, completed_at)
    VALUES (${enrollmentId}, ${moduleId}, true, NOW())
    ON CONFLICT (enrollment_id, module_id)
    DO UPDATE SET completed = true, completed_at = NOW()
  `

  const stats = await sql`
    SELECT
      COUNT(*) FILTER (WHERE mp.completed = true) as done,
      COUNT(m.id) as total
    FROM mcsa_modules m
    LEFT JOIN mcsa_module_progress mp
      ON mp.module_id = m.id AND mp.enrollment_id = ${enrollmentId}
    WHERE m.course_id = (
      SELECT course_id FROM mcsa_enrollments WHERE id = ${enrollmentId}
    )
  `
  const pct = Math.round((Number(stats[0].done) / Number(stats[0].total)) * 100)

  await sql`
    UPDATE mcsa_enrollments
    SET progress_percent = ${pct},
        completed_at = CASE WHEN ${pct} = 100 THEN NOW() ELSE NULL END
    WHERE id = ${enrollmentId}
  `

  return NextResponse.json({ ok: true, progress: pct })
}
