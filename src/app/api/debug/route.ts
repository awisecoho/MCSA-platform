export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const courses = await sql`SELECT count(*)::int as n FROM mcsa_courses`
    const modules = await sql`SELECT count(*)::int as n FROM mcsa_modules`
    const withContent = await sql`SELECT count(*)::int as n FROM mcsa_modules WHERE content IS NOT NULL AND content != ''`
    const sample = await sql`
      SELECT m.title, LEFT(m.content, 100) as content_preview, c.slug
      FROM mcsa_modules m
      JOIN mcsa_courses c ON c.id = m.course_id
      WHERE c.slug = 'mcsa-101-introduction'
      ORDER BY m.order_index LIMIT 4
    `
    return NextResponse.json({
      courses: courses[0].n,
      modules: modules[0].n,
      modules_with_content: withContent[0].n,
      sample_mcsa101: sample
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
