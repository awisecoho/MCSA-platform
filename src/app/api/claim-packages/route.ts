export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { pool } from '@/lib/db'

async function logActivity(client: any, clerk_id: string, event_type: string, package_id?: string) {
  try {
    await client.query(
      `INSERT INTO mcsa_activity_log (clerk_id, event_type, package_id) VALUES ($1,$2,$3)`,
      [clerk_id, event_type, package_id || null]
    )
  } catch {}
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT id, claim_number, carrier_name, municipality_name, unit_type, tier,
              file_status, compliance_score, risk_flags, created_at, updated_at
       FROM mcsa_claim_packages WHERE clerk_id = $1 ORDER BY updated_at DESC`,
      [userId]
    )
    return NextResponse.json({ packages: rows })
  } finally { client.release() }
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `INSERT INTO mcsa_claim_packages
        (clerk_id, claim_number, carrier_name, adjuster_name, municipality_name,
         department, loss_date, inspection_date, loss_type, loss_location,
         contact_person, contact_phone, unit_type, tier, year, make, model, vin,
         mileage, hours, unit_number, in_service_status, specialty_body_manufacturer,
         specialty_body_serial, file_status, form_data, risk_flags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
       RETURNING *`,
      [userId, body.claim_number||null, body.carrier_name||null, body.adjuster_name||null,
       body.municipality_name||null, body.department||null, body.loss_date||null,
       body.inspection_date||null, body.loss_type||null, body.loss_location||null,
       body.contact_person||null, body.contact_phone||null, body.unit_type||null,
       body.tier||null, body.year||null, body.make||null, body.model||null, body.vin||null,
       body.mileage||null, body.hours||null, body.unit_number||null,
       body.in_service_status||null, body.specialty_body_manufacturer||null,
       body.specialty_body_serial||null, body.file_status||'Draft',
       JSON.stringify(body.form_data||{}), JSON.stringify(body.risk_flags||[])]
    )
    await logActivity(client, userId, 'create_claim_package', rows[0].id)
    return NextResponse.json({ package: rows[0] })
  } finally { client.release() }
}
