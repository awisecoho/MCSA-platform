export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  const { resourceId } = await req.json()
  if (!resourceId) return NextResponse.json({ ok: false })

  const client = await pool.connect()
  try {
    await client.query(`
      INSERT INTO mcsa_activity_log (clerk_id, resource_id, event_type)
      VALUES ($1, $2, 'click_resource')
    `, [userId || null, resourceId])
    client.release()
    return NextResponse.json({ ok: true })
  } catch {
    // Silently fail — don't block the user's click
    client.release()
    return NextResponse.json({ ok: false })
  }
}
