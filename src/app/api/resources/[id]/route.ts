export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT * FROM mcsa_resources WHERE id = $1`, [params.id]
    )
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const r = rows[0]
    if (!userId && r.access_level === 'member') {
      return NextResponse.json({ ...r, url: null, locked: true })
    }
    client.release()
    return NextResponse.json(r)
  } catch (err: any) {
    client.release()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
