export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    await requireAdmin()
    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        `SELECT * FROM mcsa_testers ORDER BY created_at DESC`
      )
      return NextResponse.json({ testers: rows })
    } finally { client.release() }
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
