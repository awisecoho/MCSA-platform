export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import schema from '@/lib/claim_package_schema.json'
export async function GET() {
  return NextResponse.json(schema)
}
