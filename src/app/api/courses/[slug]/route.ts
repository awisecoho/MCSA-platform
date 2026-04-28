import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const courses = await sql`
      SELECT * FROM mcsa_courses
      WHERE slug = ${params.slug} AND is_published = true
      LIMIT 1
    `
    if (!courses.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const modules = await sql`
      SELECT id, course_id, title, content, duration_minutes, order_index, is_preview
      FROM mcsa_modules
      WHERE course_id = ${courses[0].id}
      ORDER BY order_index
    `
    return NextResponse.json({ course: courses[0], modules })
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
