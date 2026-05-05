export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  const { email, first_name, last_name, organization, role, notes } = await req.json()

  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    // Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS mcsa_founding_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        first_name TEXT,
        last_name TEXT,
        organization TEXT,
        role TEXT,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    // Check duplicate
    const { rows: existing } = await client.query(
      `SELECT id FROM mcsa_founding_members WHERE email = $1`, [email.toLowerCase().trim()]
    )
    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        already_registered: true,
        message: `${email} is already on the founding member list.`
      })
    }

    const { rows } = await client.query(
      `INSERT INTO mcsa_founding_members (email, first_name, last_name, organization, role, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, created_at`,
      [
        email.toLowerCase().trim(),
        first_name?.trim() || null,
        last_name?.trim() || null,
        organization?.trim() || null,
        role?.trim() || null,
        notes?.trim() || null,
      ]
    )

    // Log activity
    await client.query(
      `INSERT INTO mcsa_activity_log (event_type, metadata)
       VALUES ('founding_member_signup', $1)`,
      [JSON.stringify({ email: rows[0].email, id: rows[0].id })]
    ).catch(() => {}) // non-fatal

    return NextResponse.json({
      success: true,
      already_registered: false,
      message: `You're on the list. We'll reach out to ${email} with next steps.`
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  } finally {
    client.release()
  }
}

export async function GET() {
  // Admin endpoint to see signups - no auth for now, obscure by not linking it
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT id, email, first_name, last_name, organization, role, status, created_at
       FROM mcsa_founding_members ORDER BY created_at DESC`
    )
    return NextResponse.json({ count: rows.length, members: rows })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  } finally {
    client.release()
  }
}
