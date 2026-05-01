export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { pool } from '@/lib/db'
type Ctx = { params: { id: string } }

export async function POST(req: Request, { params }: Ctx) {
  const { userId } = await auth()
  const { export_type } = await req.json()
  const isPublic = !userId
  const client = await pool.connect()
  try {
    // Get package (public can export preview)
    const { rows: pkgs } = await client.query(
      `SELECT * FROM mcsa_claim_packages WHERE id=$1 ${!isPublic ? 'AND clerk_id=$2' : ''}`,
      isPublic ? [params.id] : [params.id, userId]
    )
    if (!pkgs.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const pkg = pkgs[0]
    const { rows: photos } = await client.query(
      `SELECT * FROM mcsa_photo_checklist_items WHERE package_id=$1 ORDER BY sort_order`, [params.id]
    )
    const { rows: components } = await client.query(
      `SELECT * FROM mcsa_component_inventory_items WHERE package_id=$1 ORDER BY sort_order`, [params.id]
    )

    // Build CSV export
    if (export_type === 'csv') {
      const formData = pkg.form_data || {}
      const lines: string[] = []
      lines.push('MCSA Claim Package Export')
      lines.push(`Claim Number,${pkg.claim_number||''}`)
      lines.push(`Carrier,${pkg.carrier_name||''}`)
      lines.push(`Adjuster,${pkg.adjuster_name||''}`)
      lines.push(`Municipality,${pkg.municipality_name||''}`)
      lines.push(`Department,${pkg.department||''}`)
      lines.push(`Loss Date,${pkg.loss_date||''}`)
      lines.push(`Unit Type,${pkg.unit_type||''}`)
      lines.push(`Tier,${pkg.tier||''}`)
      lines.push(`Year,${pkg.year||''}`)
      lines.push(`Make,${pkg.make||''}`)
      lines.push(`Model,${pkg.model||''}`)
      lines.push(`VIN,${pkg.vin||''}`)
      lines.push(`File Status,${pkg.file_status||''}`)
      lines.push(`Compliance Score,${pkg.compliance_score||''}`)
      lines.push('')
      lines.push('Photo Checklist')
      lines.push('Item,Status,Notes')
      for (const p of photos) {
        lines.push(`"${p.photo_item}","${p.status}","${p.notes||''}"`)
      }
      lines.push('')
      lines.push('Component Inventory')
      lines.push('Component,System,OEM/Aftermarket,Condition,Recommendation,Doc Needed,Notes')
      for (const c of components) {
        lines.push(`"${c.component_name}","${c.system_category||''}","${c.oem_aftermarket||''}","${c.condition||''}","${c.recommendation||''}","${c.documentation_needed||''}","${c.notes||''}"`)
      }
      if (userId) {
        await client.query(
          `INSERT INTO mcsa_claim_exports (package_id,clerk_id,export_type,watermarked) VALUES ($1,$2,'csv',$3)`,
          [params.id, userId, isPublic]
        )
        await client.query(
          `INSERT INTO mcsa_activity_log (clerk_id,event_type,package_id) VALUES ($1,'export_claim_package',$2)`,
          [userId, params.id]
        )
      }
      return new Response(lines.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="mcsa-claim-${pkg.claim_number||params.id}.csv"`,
        }
      })
    }

    // For print/PDF — return structured JSON for client-side rendering
    const watermarked = isPublic || export_type === 'watermarked'
    if (userId) {
      await client.query(
        `INSERT INTO mcsa_claim_exports (package_id,clerk_id,export_type,watermarked) VALUES ($1,$2,'pdf',$3)`,
        [params.id, userId, watermarked]
      )
      await client.query(
        `INSERT INTO mcsa_activity_log (clerk_id,event_type,package_id) VALUES ($1,'export_claim_package',$2)`,
        [userId, params.id]
      )
    }
    return NextResponse.json({ package: pkg, photos, components, watermarked, export_type })
  } finally { client.release() }
}
