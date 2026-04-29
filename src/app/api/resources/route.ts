export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = await auth()

  try {
    let resources
    if (userId) {
      // Logged-in: return all resources
      resources = await sql`
        SELECT * FROM mcsa_resources
        ORDER BY access_level, resource_type, title
      `
    } else {
      // Logged-out: return all but show member ones without content
      resources = await sql`
        SELECT id, title, description, resource_type, access_level,
          CASE WHEN access_level = 'member' THEN NULL ELSE external_url END as external_url
        FROM mcsa_resources
        ORDER BY access_level, resource_type, title
      `
    }
    return NextResponse.json({ resources })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
