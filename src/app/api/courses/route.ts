export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const courses = await sql`
      SELECT * FROM mcsa_courses
      WHERE is_published = true
      ORDER BY order_index
    `
    return NextResponse.json({ courses })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
