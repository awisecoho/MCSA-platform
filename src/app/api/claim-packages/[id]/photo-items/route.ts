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
    // Verify ownership
    const { rows } = await client.query(`SELECT id FROM mcsa_claim_packages WHERE id=$1 AND clerk_id=$2`,[params.id,userId])
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // Delete existing and re-insert
    await client.query(`DELETE FROM mcsa_photo_checklist_items WHERE package_id=$1`, [params.id])
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      await client.query(
        `INSERT INTO mcsa_photo_checklist_items (package_id,photo_item,status,missing_reason,notes,sort_order)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [params.id, item.photo_item, item.status||'Missing', item.missing_reason||null, item.notes||null, i]
      )
    }
    const { rows: updated } = await client.query(
      `SELECT * FROM mcsa_photo_checklist_items WHERE package_id=$1 ORDER BY sort_order`, [params.id]
    )
    return NextResponse.json({ photos: updated })
  } finally { client.release() }
}
