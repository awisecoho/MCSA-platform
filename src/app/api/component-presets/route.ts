export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import presets from '@/lib/component_presets.json'
export async function GET() {
  return NextResponse.json(presets)
}
