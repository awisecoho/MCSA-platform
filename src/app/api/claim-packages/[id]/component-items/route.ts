export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { pool } from '@/lib/db'
type Ctx = { params: { id: string } }
export async function POST(req: Request, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items: any[] = await req.json()
  const client = await pool.connect()
  try {
    const { rows } = await client.query(`SELECT id FROM mcsa_claim_packages WHERE id=$1 AND clerk_id=$2`,[params.id,userId])
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await client.query(`DELETE FROM mcsa_component_inventory_items WHERE package_id=$1`, [params.id])
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      await client.query(
        `INSERT INTO mcsa_component_inventory_items
          (package_id,component_name,system_category,oem_aftermarket,condition,recommendation,documentation_needed,notes,sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [params.id, item.component_name, item.system_category||null, item.oem_aftermarket||null,
         item.condition||null, item.recommendation||null, item.documentation_needed||null, item.notes||null, i]
      )
    }
    const { rows: updated } = await client.query(
      `SELECT * FROM mcsa_component_inventory_items WHERE package_id=$1 ORDER BY sort_order`, [params.id]
    )
    return NextResponse.json({ components: updated })
  } finally { client.release() }
}
