export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { requireAdmin } from '@/lib/auth'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const adminId = await requireAdmin()
    const body = await req.json()
    const { email, first_name, last_name, organization, notes, expires_at, send_welcome } = body

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const client = await pool.connect()
    try {
      // Ensure table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS mcsa_testers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          clerk_id TEXT,
          email TEXT UNIQUE NOT NULL,
          first_name TEXT,
          last_name TEXT,
          organization TEXT,
          notes TEXT,
          invited_by TEXT,
          status TEXT DEFAULT 'invited',
          expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `)

      // Check if already invited
      const { rows: existing } = await client.query(
        `SELECT id, status FROM mcsa_testers WHERE email = $1`, [email]
      )
      if (existing.length > 0) {
        return NextResponse.json({ error: 'This email has already been invited as a tester' }, { status: 409 })
      }

      // Create Clerk invitation with tester metadata
      const clerk = await clerkClient()
      const invitation = await clerk.invitations.createInvitation({
        emailAddress: email,
        notify: send_welcome !== false,
        publicMetadata: {
          role: 'tester',
          access_level: 'tester',
          organization: organization || null,
          invited_by: adminId,
        },
        ignoreExisting: true,
      })

      // Store in Neon
      const expiresAt = expires_at ? new Date(expires_at).toISOString() : null
      const { rows } = await client.query(
        `INSERT INTO mcsa_testers
          (email, first_name, last_name, organization, notes, invited_by, status, expires_at)
         VALUES ($1,$2,$3,$4,$5,$6,'invited',$7)
         RETURNING *`,
        [email, first_name || null, last_name || null, organization || null,
         notes || null, adminId, expiresAt]
      )

      // Log activity
      await client.query(
        `INSERT INTO mcsa_activity_log (clerk_id, event_type, metadata)
         VALUES ($1, 'invite_tester', $2)`,
        [adminId, JSON.stringify({ email, invitation_id: invitation.id })]
      )

      client.release()
      return NextResponse.json({
        success: true,
        tester: rows[0],
        invitation_id: invitation.id,
        message: `Invitation sent to ${email}`,
      })
    } catch (dbErr: any) {
      client.release()
      throw dbErr
    }
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    return NextResponse.json({ error: err.message || 'Failed to create invitation' }, { status: 500 })
  }
}
