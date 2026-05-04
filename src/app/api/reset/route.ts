export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== 'mcsa-setup-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await pool.connect()
  try {
    // Wipe all seeded content (preserves user data)
    await client.query(`DELETE FROM mcsa_module_progress`)
    await client.query(`DELETE FROM mcsa_enrollments`)
    await client.query(`DELETE FROM mcsa_modules`)
    await client.query(`DELETE FROM mcsa_resources`)
    await client.query(`DELETE FROM mcsa_courses`)
    await client.query(`DELETE FROM mcsa_course_categories`)
    await client.query(`DELETE FROM mcsa_membership_plans`)

    const { rows: c } = await client.query(`SELECT count(*)::int as n FROM mcsa_modules`)
    const { rows: r } = await client.query(`SELECT count(*)::int as n FROM mcsa_resources`)
    client.release()

    return NextResponse.json({
      cleared: true,
      modules_remaining: c[0].n,
      resources_remaining: r[0].n,
      next: 'Now call /api/setup?token=mcsa-setup-2026 once to re-seed cleanly'
    })
  } catch (err: any) {
    client.release()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
