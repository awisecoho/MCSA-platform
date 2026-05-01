export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { pool } from '@/lib/db'

type Ctx = { params: { id: string } }

async function logActivity(client: any, clerk_id: string, event_type: string, package_id: string) {
  try { await client.query(`INSERT INTO mcsa_activity_log (clerk_id,event_type,package_id) VALUES ($1,$2,$3)`,[clerk_id,event_type,package_id]) } catch {}
}

export async function GET(_req: Request, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const client = await pool.connect()
  try {
    const { rows: pkgs } = await client.query(
      `SELECT * FROM mcsa_claim_packages WHERE id=$1 AND clerk_id=$2`, [params.id, userId]
    )
    if (!pkgs.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const { rows: photos } = await client.query(
      `SELECT * FROM mcsa_photo_checklist_items WHERE package_id=$1 ORDER BY sort_order`, [params.id]
    )
    const { rows: components } = await client.query(
      `SELECT * FROM mcsa_component_inventory_items WHERE package_id=$1 ORDER BY sort_order`, [params.id]
    )
    await logActivity(client, userId, 'view_claim_package', params.id)
    return NextResponse.json({ package: pkgs[0], photos, components })
  } finally { client.release() }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `UPDATE mcsa_claim_packages SET
        claim_number=COALESCE($3,claim_number), carrier_name=COALESCE($4,carrier_name),
        adjuster_name=COALESCE($5,adjuster_name), municipality_name=COALESCE($6,municipality_name),
        department=COALESCE($7,department), loss_date=COALESCE($8,loss_date),
        inspection_date=COALESCE($9,inspection_date), loss_type=COALESCE($10,loss_type),
        loss_location=COALESCE($11,loss_location), contact_person=COALESCE($12,contact_person),
        contact_phone=COALESCE($13,contact_phone), unit_type=COALESCE($14,unit_type),
        tier=COALESCE($15,tier), year=COALESCE($16,year), make=COALESCE($17,make),
        model=COALESCE($18,model), vin=COALESCE($19,vin), mileage=COALESCE($20,mileage),
        hours=COALESCE($21,hours), unit_number=COALESCE($22,unit_number),
        in_service_status=COALESCE($23,in_service_status),
        specialty_body_manufacturer=COALESCE($24,specialty_body_manufacturer),
        specialty_body_serial=COALESCE($25,specialty_body_serial),
        file_status=COALESCE($26,file_status), form_data=COALESCE($27,form_data),
        risk_flags=COALESCE($28,risk_flags), compliance_score=COALESCE($29,compliance_score),
        missing_items=COALESCE($30,missing_items), updated_at=NOW()
       WHERE id=$1 AND clerk_id=$2 RETURNING *`,
      [params.id, userId,
       body.claim_number||null, body.carrier_name||null, body.adjuster_name||null,
       body.municipality_name||null, body.department||null, body.loss_date||null,
       body.inspection_date||null, body.loss_type||null, body.loss_location||null,
       body.contact_person||null, body.contact_phone||null, body.unit_type||null,
       body.tier||null, body.year||null, body.make||null, body.model||null,
       body.vin||null, body.mileage||null, body.hours||null, body.unit_number||null,
       body.in_service_status||null, body.specialty_body_manufacturer||null,
       body.specialty_body_serial||null, body.file_status||null,
       body.form_data ? JSON.stringify(body.form_data) : null,
       body.risk_flags ? JSON.stringify(body.risk_flags) : null,
       body.compliance_score||null, body.missing_items||null]
    )
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await logActivity(client, userId, 'update_claim_package', params.id)
    return NextResponse.json({ package: rows[0] })
  } finally { client.release() }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const client = await pool.connect()
  try {
    await client.query(`DELETE FROM mcsa_claim_packages WHERE id=$1 AND clerk_id=$2`, [params.id, userId])
    return NextResponse.json({ ok: true })
  } finally { client.release() }
}
