export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { requireAdmin } from '@/lib/auth'
import { pool } from '@/lib/db'

type Ctx = { params: { id: string } }

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireAdmin()
    const body = await req.json()
    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        `UPDATE mcsa_testers SET
          status = COALESCE($2, status),
          notes = COALESCE($3, notes),
          expires_at = COALESCE($4, expires_at),
          updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [params.id, body.status || null, body.notes || null, body.expires_at || null]
      )
      if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ tester: rows[0] })
    } finally { client.release() }
  } catch (err: any) {
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireAdmin()
    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        `DELETE FROM mcsa_testers WHERE id = $1 RETURNING email, clerk_id`, [params.id]
      )
      if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

      // Revoke Clerk invitation if we have a clerk_id
      if (rows[0].clerk_id) {
        try {
          const clerk = await clerkClient()
          await clerk.invitations.revokeInvitation(rows[0].clerk_id)
        } catch {} // Non-fatal
      }
      return NextResponse.json({ ok: true, email: rows[0].email })
    } finally { client.release() }
  } catch (err: any) {
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
